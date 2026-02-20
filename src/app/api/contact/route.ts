import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    // Save contact message
    const contactMessage = {
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      status: 'unread'
    };

    const result = await db.collection('contacts').insertOne(contactMessage);

    // Here you could also send an email notification to admin
    // For now, we'll just save to database

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        id: result.insertedId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
