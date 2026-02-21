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
    
    if (!user || (!user.isSeller && user.role !== 'seller')) {
      return NextResponse.json(
        { message: 'Seller access required' },
        { status: 403 }
      );
    }

    // Get seller's card designs
    const sellerCards = await CardDesign.find({ createdBy: session.user.id }).select('_id');
    const sellerCardIds = sellerCards.map(card => card._id);

    // Get bookings for seller's cards
    const bookings = await Booking.find({ templateId: { $in: sellerCardIds } })
      .populate('userId', 'name email')
      .populate('templateId', 'name')
      .sort({ createdAt: -1 });

    // Transform to orders format
    const orders = bookings.map(booking => ({
      _id: booking._id,
      orderId: booking.orderId,
      customerName: booking.userId?.name || 'Unknown',
      customerEmail: booking.userId?.email || '',
      cardName: booking.templateId?.name || 'Unknown Card',
      total: booking.price,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      weddingDate: booking.wedding?.date,
      groomName: booking.groom?.fullName,
      brideName: booking.bride?.fullName,
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
