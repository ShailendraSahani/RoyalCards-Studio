import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
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

    const user = await User.findById(session.user.id);
    
    // Check if user is a seller with approved status
    if (!user || (!user.isSeller && user.role !== 'seller') || user.sellerRequestStatus !== 'approved') {
      return NextResponse.json(
        { message: 'Seller access required. Please complete seller approval first.' },
        { status: 403 }
      );
    }

    // Get seller's card designs
    const products = await CardDesign.find({ createdBy: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
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

    const user = await User.findById(session.user.id);
    
    // Check if user is a seller with approved status
    if (!user || (!user.isSeller && user.role !== 'seller') || user.sellerRequestStatus !== 'approved') {
      return NextResponse.json(
        { message: 'Seller access required. Please complete seller approval first.' },
        { status: 403 }
      );
    }

    const { name, description, price, templateImage, category, isActive } = await request.json();

    if (!name || !price) {
      return NextResponse.json(
        { message: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Create new card design for seller
    const newCard = new CardDesign({
      name,
      description: description || '',
      price: Number(price),
      templateImage: templateImage || '',
      category: category || 'traditional',
      isActive: isActive !== false,
      createdBy: session.user.id,
    });

    await newCard.save();

    return NextResponse.json(
      { message: 'Product created successfully', card: newCard },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating seller product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
