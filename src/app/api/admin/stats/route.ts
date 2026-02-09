import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import WeddingBooking from '@/models/WeddingBooking';
import CardDesign from '@/models/CardDesign';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all stats in parallel
    const [
      totalUsers,
      totalBookings,
      totalRevenueResult,
      pendingPayments,
      todayBookings,
      activeCards
    ] = await Promise.all([
      // Total users
      User.countDocuments(),

      // Total bookings
      WeddingBooking.countDocuments(),

      // Total revenue (sum of paid bookings)
      WeddingBooking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),

      // Pending payments count
      WeddingBooking.countDocuments({ paymentStatus: 'pending' }),

      // Today's bookings
      WeddingBooking.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow }
      }),

      // Active cards count
      CardDesign.countDocuments({ isActive: { $ne: false } })
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const stats = {
      totalUsers,
      totalBookings,
      totalRevenue,
      pendingPayments,
      todayBookings,
      activeCards
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
