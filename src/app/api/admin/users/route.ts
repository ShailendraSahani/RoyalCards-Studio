import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get all users with their order counts and seller info
    const users = await User.find({})
      .select('name email role createdAt isSeller sellerRequestStatus shopName shopDescription businessAddress gstNumber sellerRequestedAt')
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

// PUT method to update user role or seller status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const { userId, role, sellerStatus } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (role) {
      updateData.role = role;
    }
    
    if (sellerStatus) {
      updateData.sellerRequestStatus = sellerStatus.status;
      if (sellerStatus.status === 'approved') {
        updateData.isSeller = true;
        updateData.role = 'seller';
        updateData.sellerApprovedAt = new Date();
      } else if (sellerStatus.status === 'rejected') {
        updateData.isSeller = false;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
