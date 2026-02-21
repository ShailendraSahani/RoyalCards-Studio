import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  let userId: string | undefined;
  
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Get the session to identify the user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      // Return SSE response with auth error instead of HTTP 401
      // This allows the client to handle the error gracefully
      const authErrorStream = new ReadableStream({
        start(controller) {
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'error', 
            code: 'AUTH_REQUIRED',
            message: 'Authentication required. Please sign in.' 
          })}\n\n`);
          controller.close();
        },
      });
      
      return new Response(authErrorStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Get userId - prefer id, fall back to email
    userId = session.user.id as string || session.user.email as string;

    // Validate userId format - check if it's a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId) && 
      new mongoose.Types.ObjectId(userId).toString() === userId;

    const responseStream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`);

        const db = mongoose.connection.db;

        if (!db) {
          controller.enqueue(`data: ${JSON.stringify({ type: 'error', message: 'Database connection failed' })}\n\n`);
          controller.close();
          return;
        }

        // Watch for changes in user's bookings and cart
        const collections = ['weddingbookings', 'carts', 'customizations', 'orders'];

        const changeStreams: mongoose.mongo.ChangeStream[] = [];

        collections.forEach(collectionName => {
          try {
            // Determine the match stage based on collection and userId type
            let matchStage = {};
            
            if (collectionName === 'weddingbookings' || collectionName === 'carts') {
              if (isValidObjectId) {
                // Use ObjectId for valid MongoDB ObjectIds
                matchStage = { 
                  $match: { 
                    $or: [
                      { 'fullDocument.userId': new mongoose.Types.ObjectId(userId as string) },
                      { 'fullDocument.userId': userId } // Also match string ID
                    ]
                  } 
                };
              } else {
                // Use email for non-ObjectId identifiers
                matchStage = { 
                  $match: { 'fullDocument.userId': userId } 
                };
              }
            }

            const changeStream = db.collection(collectionName).watch(
              collectionName === 'weddingbookings' || collectionName === 'carts'
                ? [matchStage]
                : [],
              { fullDocument: 'updateLookup' }
            );

            changeStream.on('change', (change: unknown) => {
              const changeDoc = change as { operationType?: string; fullDocument?: Record<string, unknown> };
              // Send update event to client with userId
              controller.enqueue(`data: ${JSON.stringify({
                type: 'update',
                collection: collectionName,
                operation: changeDoc.operationType,
                timestamp: new Date().toISOString(),
                data: {
                  userId,
                  ...changeDoc.fullDocument
                }
              })}\n\n`);
            });
            
            changeStream.on('error', (error) => {
              console.error(`Change stream error for ${collectionName}:`, error);
              controller.enqueue(`data: ${JSON.stringify({ 
                type: 'error', 
                collection: collectionName,
                message: `Stream error: ${error.message}` 
              })}\n\n`);
            });
            
            changeStreams.push(changeStream);
          } catch (error) {
            console.error(`Error setting up change stream for ${collectionName}:`, error);
          }
        });

        // Clean up on connection close
        request.signal.addEventListener('abort', () => {
          changeStreams.forEach(stream => stream.close());
          controller.close();
        });
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('Error in user realtime API:', error);
    
    // Return SSE error response instead of HTTP error
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(`data: ${JSON.stringify({ 
          type: 'error', 
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        })}\n\n`);
        controller.close();
      },
    });
    
    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}
