import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import WeddingBooking from '@/models/WeddingBooking';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const booking = await WeddingBooking.findOne({
      shareSlug: slug,
      status: { $in: ['confirmed', 'paid', 'completed'] }
    }).populate('templateId', 'name price templateImage category description');

    if (!booking) {
      return NextResponse.json(
        { message: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Return public booking data (exclude sensitive information)
    const publicBooking = {
      _id: booking._id,
      templateId: booking.templateId,
      groom: booking.groom,
      bride: booking.bride,
      wedding: booking.wedding,
      events: booking.events,
      messages: booking.messages,
      theme: booking.theme,
      aspirant: booking.aspirant,
      createdAt: booking.createdAt,
    };

    return NextResponse.json({
      booking: publicBooking,
      card: booking.templateId
    });
  } catch (error) {
    console.error('Error fetching public booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
