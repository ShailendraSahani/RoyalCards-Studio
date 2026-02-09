import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import CardDesign from '@/models/CardDesign';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const { quantity } = await request.json();

    // Validate input
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { message: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    // Find cart item and ensure it belongs to user
    const cartItem = await Cart.findOne({
      _id: id,
      user: session.user.id,
    }).populate('cardDesign', 'price');

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Update quantity and total price
    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.customization.cardDesign.price * quantity;

    await cartItem.save();

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    // Find and delete cart item, ensuring it belongs to user
    const cartItem = await Cart.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
