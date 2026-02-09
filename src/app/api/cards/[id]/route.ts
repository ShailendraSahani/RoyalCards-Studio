import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import CardDesign from '@/models/CardDesign';

// GET single card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const card = await CardDesign.findById(id);

    if (!card) return NextResponse.json({ message: 'Card not found' }, { status: 404 });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT update card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();

    const { name, description, category, templateImage, price, isActive } = await request.json();

    // Validation
    if (!name?.trim() || !description?.trim() || !category?.trim() || !templateImage?.trim()) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      return NextResponse.json({ message: 'Price must be a number ≥ 0' }, { status: 400 });
    }

    const card = await CardDesign.findByIdAndUpdate(
      id,
      { name: name.trim(), description: description.trim(), category: category.trim(), templateImage: templateImage.trim(), price: priceNumber, isActive },
      { new: true }
    );

    if (!card) return NextResponse.json({ message: 'Card not found' }, { status: 404 });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();

    const card = await CardDesign.findByIdAndDelete(id);

    if (!card) return NextResponse.json({ message: 'Card not found' }, { status: 404 });

    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
