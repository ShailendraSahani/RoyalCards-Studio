import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import CardDesign from '@/models/CardDesign';

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
    if (category && category !== 'all' && all !== 'true') {
      query.category = category;
    }

    // Return real data from database (no fallback)
    const cards = await CardDesign.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST create new card (admin only)
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

    const isValidUrl = (str: string) => { try { new URL(str); return true; } catch { return false; } };

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
  } catch (error: any) {
    console.error('Error creating card:', error);
    
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(error.errors)) {
        validationErrors[key] = (value as any).message;
      }
      console.error('Validation errors:', validationErrors);
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      }, { status: 400 });
    }
    
    // Handle other known error types
    if (error.name === 'CastError') {
      return NextResponse.json({ 
        message: `Invalid ${error.path}: ${error.value}` 
      }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
