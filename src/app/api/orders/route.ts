import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { cartItems, shippingAddress, totalPrice } = await request.json();

    // Validate input
    if (!cartItems || !shippingAddress || !totalPrice) {
      return NextResponse.json(
        { message: 'Cart items, shipping address, and total price are required' },
        { status: 400 }
      );
    }

    // Create orders for each cart item
    const orders = [];
    for (const cartItem of cartItems) {
      const cart = await Cart.findById(cartItem.customization).populate({
        path: 'customization',
        populate: {
          path: 'cardDesign',
          select: 'name price',
        },
      });

      if (!cart) continue;

      const order = await Order.create({
        user: session.user.id,
        cardDesign: cart.customization.cardDesign._id,
        customization: cart.customization._id,
        quantity: cartItem.quantity,
        totalPrice: cart.customization.cardDesign.price * cartItem.quantity,
        shippingAddress,
      });

      orders.push(order);

      // Remove from cart
      await Cart.findByIdAndDelete(cart._id);
    }

    // Return the first order (or you could return all orders)
    return NextResponse.json(orders[0], { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const orders = await Order.find({ user: session.user.id })
      .populate('cardDesign', 'name price')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
