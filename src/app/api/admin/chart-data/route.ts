import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import WeddingBooking from '@/models/WeddingBooking';
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

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Bookings over last 30 days (daily)
    const bookingsOverTime = await WeddingBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Revenue over last 30 days (daily)
    const revenueOverTime = await WeddingBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Payment status distribution
    const paymentStatusData = await WeddingBooking.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Users over last 30 days (daily)
    const usersOverTime = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Weekly bookings for bar chart
    const weeklyBookings = await WeddingBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Format data for charts
    const formatDateData = (data: any[], key: string) => {
      return data.map(item => ({
        date: item._id,
        [key]: item.count || item.revenue || 0
      }));
    };

    const chartData = {
      bookingsOverTime: formatDateData(bookingsOverTime, 'bookings'),
      revenueOverTime: formatDateData(revenueOverTime, 'revenue'),
      paymentStatus: paymentStatusData.map(item => ({
        name: item._id,
        value: item.count
      })),
      usersOverTime: formatDateData(usersOverTime, 'users'),
      weeklyBookings: formatDateData(weeklyBookings, 'bookings')
    };

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
