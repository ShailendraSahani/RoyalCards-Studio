import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get all users with their order counts
    const users = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    // Add order counts for each user
    const usersWithOrderCounts = await Promise.all(
      users.map(async (user) => {
        const ordersCount = await Order.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          ordersCount,
        };
      })
    );

    return NextResponse.json(usersWithOrderCounts);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
