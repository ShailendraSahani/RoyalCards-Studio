import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import CardDesign from '@/models/CardDesign';
import Booking from '@/models/Booking';

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
    
    // Check if user is a seller with approved status
    if (!user || (!user.isSeller && user.role !== 'seller') || user.sellerRequestStatus !== 'approved') {
      return NextResponse.json(
        { message: 'Seller access required. Please complete seller approval first.' },
        { status: 403 }
      );
    }

    // Get seller's card designs (products)
    const totalProducts = await CardDesign.countDocuments({ createdBy: session.user.id });
    const activeProducts = await CardDesign.countDocuments({ createdBy: session.user.id, isActive: true });

    // Get bookings made from seller's card designs
    const sellerCards = await CardDesign.find({ createdBy: session.user.id }).select('_id');
    const sellerCardIds = sellerCards.map(card => card._id);

    // Get bookings for seller's cards
    const bookings = await Booking.find({
      templateId: { $in: sellerCardIds }
    });

    const totalOrders = bookings.length;
    const completedOrders = bookings.filter(b => b.status === 'completed').length;
    const pendingOrders = bookings.filter(b => b.paymentStatus === 'pending').length;
    const paidOrders = bookings.filter(b => b.paymentStatus === 'paid');
    
    const totalRevenue = paidOrders.reduce((sum, b) => sum + (b.price || 0), 0);

    // Get chart data for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= date && bookingDate < nextDate;
      });

      const dayRevenue = dayBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.price || 0), 0);

      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        bookings: dayBookings.length,
        revenue: dayRevenue,
      });
    }

    const stats = {
      totalProducts,
      activeProducts,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
      recentRevenue: last7Days,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
