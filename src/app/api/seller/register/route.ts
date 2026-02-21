import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Please login to become a seller' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { shopName, shopDescription, businessAddress, gstNumber } = await request.json();

    // Validate input
    if (!shopName || !businessAddress) {
      return NextResponse.json(
        { message: 'Shop name and business address are required' },
        { status: 400 }
      );
    }

    // Find user and update seller request
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already a seller
    if (user.isSeller) {
      return NextResponse.json(
        { message: 'You are already a seller' },
        { status: 400 }
      );
    }

    // Check if already has pending request
    if (user.sellerRequestStatus === 'pending') {
      return NextResponse.json(
        { message: 'You already have a pending seller request' },
        { status: 400 }
      );
    }

    // Update user as seller request
    user.isSeller = false;
    user.sellerRequestStatus = 'pending';
    user.shopName = shopName;
    user.shopDescription = shopDescription || '';
    user.businessAddress = businessAddress;
    user.gstNumber = gstNumber || '';
    user.sellerRequestedAt = new Date();

    await user.save();

    return NextResponse.json(
      { 
        message: 'Seller request submitted successfully. Waiting for admin approval.',
        status: 'pending'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seller registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Please login to check seller status' },
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

    return NextResponse.json(
      {
        isSeller: user.isSeller,
        sellerRequestStatus: user.sellerRequestStatus,
        shopName: user.shopName,
        shopDescription: user.shopDescription,
        businessAddress: user.businessAddress,
        gstNumber: user.gstNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get seller status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
