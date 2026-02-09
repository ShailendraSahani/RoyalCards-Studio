import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const responseStream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

        const db = mongoose.connection.db;

        if (!db) {
          controller.enqueue(`data: ${JSON.stringify({ type: 'error', message: 'Database connection failed' })}\n\n`);
          controller.close();
          return;
        }

        // Collections to watch for changes
        const collections = ['weddingbookings', 'users', 'carddesigns', 'orders'];

        // Set up change streams for each collection
        const changeStreams: mongoose.mongo.ChangeStream[] = [];

        collections.forEach(collectionName => {
          try {
            const changeStream = db.collection(collectionName).watch();
            changeStream.on('change', (change) => {
              // Send update event to client
              controller.enqueue(`data: ${JSON.stringify({
                type: 'update',
                collection: collectionName,
                operation: change.operationType,
                timestamp: new Date().toISOString()
              })}\n\n`);
            });
            changeStreams.push(changeStream);
          } catch (error) {
            console.error(`Error setting up change stream for ${collectionName}:`, error);
          }
        });

        // Clean up on connection close
        request.signal.addEventListener('abort', () => {
          changeStreams.forEach(stream => stream.close());
          controller.close();
        });
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('Error in realtime API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
