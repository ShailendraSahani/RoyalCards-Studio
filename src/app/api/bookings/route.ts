import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import WeddingBooking from '@/models/WeddingBooking';
import User from '@/models/User';
import Razorpay from 'razorpay';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user ID from mobile (stored as email in session)
    const user = await User.findOne({ mobile: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const query: Record<string, any> = {};

    // If not admin, only show user's own bookings
    if (user.role !== 'admin') {
      query.userId = user._id;
    } else if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await WeddingBooking.find(query)
      .populate('templateId', 'name price templateImage')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user ID from mobile (stored as email in session)
    const user = await User.findOne({ mobile: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const bookingData = await request.json();

    // Validate required fields for WeddingBooking
    const requiredFields = [
      'templateId', 'aspirant', 'groom', 'bride', 'wedding', 'price'
    ];

    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Prepare booking data with defaults for required fields
    const bookingDataWithDefaults = {
      ...bookingData,
      userId: user._id,
      price: bookingData.price,
      wedding: {
        ...bookingData.wedding,
        time: bookingData.wedding.time || '10:00',
        fullAddress: bookingData.wedding.fullAddress || bookingData.wedding.venueName,
      },
      events: bookingData.events || [],
    };

    // Create booking
    const booking = await WeddingBooking.create(bookingDataWithDefaults);

    // Populate template details
    await booking.populate('templateId', 'name price templateImage');

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create Razorpay order
    const paymentOrder = await razorpay.orders.create({
      amount: booking.price * 100, // Amount in paisa
      currency: 'INR',
      receipt: `receipt_${booking._id}`,
    });

    // Update booking with Razorpay order ID
    booking.razorpayOrderId = paymentOrder.id;
    await booking.save();

    return NextResponse.json({ booking, paymentOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
