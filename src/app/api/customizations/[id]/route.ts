import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import WeddingBooking from '@/models/WeddingBooking';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const booking = await WeddingBooking.findOne({
      _id: id,
      userId: session.user.id
    }).select('theme messages events');

    if (!booking) {
      return NextResponse.json(
        { message: 'Customization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      theme: booking.theme,
      messages: booking.messages,
      events: booking.events
    });
  } catch (error) {
    console.error('Error fetching customization:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const updateData = await request.json();

    const booking = await WeddingBooking.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updateData },
      { new: true }
    ).select('theme messages events');

    if (!booking) {
      return NextResponse.json(
        { message: 'Customization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      theme: booking.theme,
      messages: booking.messages,
      events: booking.events
    });
  } catch (error) {
    console.error('Error updating customization:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export default {};
