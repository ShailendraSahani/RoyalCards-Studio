import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import CardDesign from '@/models/CardDesign';
import Booking from '@/models/Booking';

// GET - Fetch all sellers with their stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    // Find all users who are sellers or have seller request
    const query = {
      $or: [
        { role: 'seller' },
        { isSeller: true },
        { sellerRequestStatus: { $in: ['pending', 'approved', 'rejected'] } }
      ]
    };

    const sellers = await User.find(query).sort({ createdAt: -1 });

    // Get stats for each seller
    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        // Get seller's card designs
        const cardCount = await CardDesign.countDocuments({ createdBy: seller._id });
        const activeCardCount = await CardDesign.countDocuments({ createdBy: seller._id, isActive: true });

        // Get bookings from seller's cards
        const sellerCards = await CardDesign.find({ createdBy: seller._id }).select('_id');
        const sellerCardIds = sellerCards.map(card => card._id);
        
        const bookings = await Booking.find({ templateId: { $in: sellerCardIds } });
        const totalOrders = bookings.length;
        const paidOrders = bookings.filter(b => b.paymentStatus === 'paid');
        const totalRevenue = paidOrders.reduce((sum, b) => sum + (b.price || 0), 0);

        return {
          _id: seller._id,
          name: seller.name,
          email: seller.email,
          role: seller.role,
          isSeller: seller.isSeller,
          sellerRequestStatus: seller.sellerRequestStatus || 'none',
          shopName: seller.shopName || '',
          shopDescription: seller.shopDescription || '',
          businessAddress: seller.businessAddress || '',
          gstNumber: seller.gstNumber || '',
          sellerRequestedAt: seller.sellerRequestedAt,
          createdAt: seller.createdAt,
          stats: {
            totalCards: cardCount,
            activeCards: activeCardCount,
            totalOrders,
            totalRevenue,
          }
        };
      })
    );

    // Filter results
    let filteredSellers = sellersWithStats;
    if (filter === 'pending') {
      filteredSellers = sellersWithStats.filter(s => s.sellerRequestStatus === 'pending');
    } else if (filter === 'approved') {
      filteredSellers = sellersWithStats.filter(s => s.sellerRequestStatus === 'approved' || s.isSeller);
    }

    return NextResponse.json(filteredSellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update seller status (approve/reject/disable)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, sellerStatus } = body;

    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'approve':
        targetUser.isSeller = true;
        targetUser.sellerRequestStatus = 'approved';
        targetUser.role = 'seller';
        await targetUser.save();
        break;

      case 'reject':
        targetUser.sellerRequestStatus = 'rejected';
        await targetUser.save();
        break;

      case 'disable':
        targetUser.isSeller = false;
        targetUser.sellerRequestStatus = 'rejected';
        await targetUser.save();
        break;

      case 'enable':
        targetUser.isSeller = true;
        targetUser.sellerRequestStatus = 'approved';
        await targetUser.save();
        break;

      case 'update_status':
        if (sellerStatus?.status) {
          targetUser.sellerRequestStatus = sellerStatus.status;
          if (sellerStatus.status === 'approved') {
            targetUser.isSeller = true;
            targetUser.role = 'seller';
          } else {
            targetUser.isSeller = false;
          }
          await targetUser.save();
        }
        break;

      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Seller updated successfully', user: targetUser });
  } catch (error) {
    console.error('Error updating seller:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
