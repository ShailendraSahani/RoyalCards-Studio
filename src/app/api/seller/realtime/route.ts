import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Send initial status
        const sendEvent = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Send initial seller status
        sendEvent({
          type: 'seller_status',
          status: user.sellerRequestStatus,
          isSeller: user.isSeller,
          shopName: user.shopName,
          timestamp: new Date().toISOString(),
        });

        // Poll for changes every 2 seconds
        let lastStatus = user.sellerRequestStatus;
        let lastIsSeller = user.isSeller;
        
        const interval = setInterval(async () => {
          try {
            const currentUser = await User.findById(session.user.id);
            
            if (currentUser) {
              // Check if status changed
              if (currentUser.sellerRequestStatus !== lastStatus || currentUser.isSeller !== lastIsSeller) {
                lastStatus = currentUser.sellerRequestStatus;
                lastIsSeller = currentUser.isSeller;
                
                sendEvent({
                  type: 'seller_status',
                  status: currentUser.sellerRequestStatus,
                  isSeller: currentUser.isSeller,
                  shopName: currentUser.shopName,
                  previousStatus: user.sellerRequestStatus,
                  timestamp: new Date().toISOString(),
                });

                // If approved, also send approval event
                if (currentUser.sellerRequestStatus === 'approved' && currentUser.isSeller) {
                  sendEvent({
                    type: 'seller_approved',
                    message: 'Your seller request has been approved!',
                    shopName: currentUser.shopName,
                    timestamp: new Date().toISOString(),
                  });
                }
              }
            }
          } catch (error) {
            console.error('Error checking seller status:', error);
          }
        }, 2000);

        // Clean up on close
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Seller realtime error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
