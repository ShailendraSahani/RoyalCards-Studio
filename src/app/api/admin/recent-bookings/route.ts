import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/mongodb';
import WeddingBooking from '@/models/WeddingBooking';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get recent 10 bookings
    const recentBookings = await WeddingBooking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id orderId groom.fullName bride.fullName paymentStatus createdAt price')
      .lean();

    return NextResponse.json(recentBookings);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
