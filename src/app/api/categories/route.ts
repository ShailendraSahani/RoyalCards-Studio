import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import CardDesign from '@/models/CardDesign';

// Define category icons and metadata
const categoryMetadata: Record<string, { icon: string; description: string }> = {
  traditional: { icon: '🏛️', description: 'Classic designs with cultural heritage' },
  modern: { icon: '✨', description: 'Contemporary and stylish patterns' },
  elegant: { icon: '💎', description: 'Sophisticated and graceful designs' },
  fun: { icon: '🎉', description: 'Playful and cheerful celebrations' },
  royal: { icon: '👑', description: 'Grand and luxurious designs' },
  floral: { icon: '🌸', description: 'Beautiful flower-inspired designs' },
  birthday: { icon: '🎂', description: 'Celebrate special birthdays' },
  party: { icon: '🎊', description: 'Fun party invitations' },
  marriage: { icon: '💒', description: 'Wedding invitations' },
  tilak: { icon: '🔴', description: 'Traditional tilak ceremonies' },
  engagement: { icon: '💍', description: 'Engagement ceremony invites' },
  babyShower: { icon: '👶', description: 'Baby shower celebrations' },
  anniversary: { icon: '🥂', description: 'Anniversary celebrations' },
  reception: { icon: '🍽️', description: 'Reception party invites' },
  haldi: { icon: '🟡', description: 'Haldi ceremony cards' },
  mehendi: { icon: '🟢', description: 'Mehendi ceremony invites' },
  sangeet: { icon: '🎵', description: 'Sangeet party cards' },
  roka: { icon: '🔵', description: 'Roka ceremony invitations' },
  festival: { icon: '🎏', description: 'Festival greetings' },
  other: { icon: '📁', description: 'Other occasions' },
};

// GET all unique categories with card counts
export async function GET() {
  try {
    await dbConnect();
    
    // Get all unique categories from the database
    const categories = await CardDesign.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Map categories with metadata
    const result = categories.map((cat) => {
      const key = cat._id.toLowerCase();
      const metadata = categoryMetadata[key] || { icon: '📁', description: `${cat._id} cards` };
      return {
        name: cat._id,
        count: cat.count,
        icon: metadata.icon,
        description: metadata.description,
      };
    });

    // If no categories exist in database, return default categories
    if (result.length === 0) {
      const defaultCategories = Object.entries(categoryMetadata).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: 0,
        icon: value.icon,
        description: value.description,
      }));
      return NextResponse.json(defaultCategories);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
