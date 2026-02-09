import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import CardDesign from '@/models/CardDesign';
import mongoose from 'mongoose';

type CardLean = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  __v: number;
};

// GET all active cards or all cards for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const all = searchParams.get('all');

    let query: { isActive?: boolean; category?: string } = { isActive: true };
    if (all === 'true') {
      query = {};
    }
    if (category && category !== 'all' && all !== 'true') query.category = category;

    let cards: any[] = await CardDesign.find(query).sort({ createdAt: -1 }).lean();

    // If no cards in database, return sample cards for testing
    if (cards.length === 0) {
      cards = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Royal Wedding Card',
          description: 'Elegant royal wedding card with gold accents',
          category: 'traditional',
          templateImage: 'https://via.placeholder.com/300x200?text=Royal+Wedding+Card',
          price: 500,
          isActive: true,
          createdAt: new Date(),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Modern Wedding Card',
          description: 'Modern wedding card with clean design',
          category: 'modern',
          templateImage: 'https://via.placeholder.com/300x200?text=Modern+Wedding+Card',
          price: 400,
          isActive: true,
          createdAt: new Date(),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Elegant Wedding Card',
          description: 'Elegant wedding card with floral design',
          category: 'elegant',
          templateImage: 'https://via.placeholder.com/300x200?text=Elegant+Wedding+Card',
          price: 600,
          isActive: true,
          createdAt: new Date(),
          __v: 0,
        },
      ];
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST create new card
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, description, category, templateImage, price, isActive, createdBy } = body;
    const priceNumber = Number(price);

    const isValidUrl = (string: string) => { try { new URL(string); return true; } catch { return false; } };

    if (!name?.trim()) return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    if (!description?.trim()) return NextResponse.json({ message: 'Description is required' }, { status: 400 });
    if (!category?.trim()) return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    if (!templateImage?.trim() || !isValidUrl(templateImage))
      return NextResponse.json({ message: 'Template image URL is invalid' }, { status: 400 });
    if (isNaN(priceNumber) || priceNumber < 0)
      return NextResponse.json({ message: 'Price must be a number >= 0' }, { status: 400 });
    if (!createdBy) return NextResponse.json({ message: 'CreatedBy is required' }, { status: 400 });

    const card = await CardDesign.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      templateImage: templateImage.trim(),
      price: priceNumber,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      createdBy,
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
