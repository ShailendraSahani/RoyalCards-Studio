'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
  isActive: boolean;
}

interface Template {
  id: string;
  image: string;
  title: string;
  price: number;
}

// Default fallback templates in case API fails
const defaultTemplates: Template[] = [
  {
    id: "1",
    image: "/templates/RAm.jpeg",
    title: "Traditional Wedding Card",
    price: 299
  },
  {
    id: "2",
    image: "/templates/Love.jpeg",
    title: "Love Theme Card",
    price: 349
  },
  {
    id: "3",
    image: "/templates/Template.jpeg",
    title: "Classic Wedding Card",
    price: 399
  }
];

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Function to fetch templates from API
  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/cards');
      if (!res.ok) throw new Error('Failed to fetch templates');
      const data = await res.json();
      
      // Map CardDesign data to template format
      const mappedTemplates = data.map((card: CardDesign) => ({
        id: card._id,
        image: card.templateImage,
        title: card.name,
        price: card.price
      }));
      
      setTemplates(mappedTemplates);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates');
      // Fallback to default templates
      setTemplates(defaultTemplates);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and real-time updates
  useEffect(() => {
    // Fetch templates on mount
    fetchTemplates();

    // Set up real-time connection using Server-Sent Events
    let eventSource: EventSource | null = null;

    const connectRealtime = () => {
      eventSource = new EventSource('/api/admin/realtime');
      
      eventSource.onopen = () => {
        setIsRealtimeConnected(true);
        console.log('Real-time connection established for templates');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Check if the update is related to carddesigns
          if (data.type === 'update' && data.collection === 'carddesigns') {
            console.log('Card design updated:', data);
            // Refetch templates when there's an update
            fetchTemplates();
          }
          
          // Handle connection message
          if (data.type === 'connected') {
            console.log('Real-time connected');
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      eventSource.onerror = () => {
        setIsRealtimeConnected(false);
        console.log('Real-time connection error, retrying...');
        // Close and reconnect after 5 seconds
        if (eventSource) {
          eventSource.close();
        }
        setTimeout(connectRealtime, 5000);
      };
    };

    // Connect to real-time updates
    connectRealtime();

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Real-time status indicator */}
      <div className="flex justify-end items-center px-10 pt-4">
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-pink-600">
            {isRealtimeConnected ? 'Live updates enabled' : 'Connecting...'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mx-10 mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
        {templates.map((template) => (
          <Link href={`/form/${template.id}`} key={template.id}>
            <div className="border shadow-xl cursor-pointer rounded-lg overflow-hidden hover:shadow-2xl transition-shadow bg-white">
              <img 
                src={template.image} 
                alt={template.title} 
                className="w-full h-auto"
                onError={(e) => {
                  // Fallback image if the template image fails to load
                  (e.target as HTMLImageElement).src = '/templates/Template.jpeg';
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-pink-800">{template.title}</h3>
                <p className="text-xl font-bold text-indigo-600 mt-2">₹{template.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-pink-500 text-lg">No templates available at the moment.</p>
        </div>
      )}
    </div>
  );
}
