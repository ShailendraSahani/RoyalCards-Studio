import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import CardDesign from '@/models/CardDesign';

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

    const cartItems = await Cart.find({ user: session.user.id })
      .populate('cardDesign', 'name price')
      .sort({ createdAt: -1 });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { cardDesign, quantity } = await request.json();

    // Validate input
    if (!cardDesign || !quantity) {
      return NextResponse.json(
        { message: 'Card design and quantity are required' },
        { status: 400 }
      );
    }

    // Get card design details to calculate price
    const cardDesignDoc = await CardDesign.findById(cardDesign);
    if (!cardDesignDoc) {
      return NextResponse.json(
        { message: 'Card design not found' },
        { status: 404 }
      );
    }

    const totalPrice = cardDesignDoc.price * quantity;

    // Check if item already exists in cart
    const existingItem = await Cart.findOne({
      user: session.user.id,
      cardDesign,
    });

    if (existingItem) {
      // Update existing item
      existingItem.quantity += quantity;
      existingItem.totalPrice = cardDesignDoc.price * existingItem.quantity;
      await existingItem.save();
      return NextResponse.json(existingItem, { status: 200 });
    } else {
      // Create new cart item
      const cartItem = await Cart.create({
        user: session.user.id,
        cardDesign,
        quantity,
        totalPrice,
      });

      return NextResponse.json(cartItem, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
