'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, ShoppingCart } from 'lucide-react';

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
}

export default function CardDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [card, setCard] = useState<CardDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCard = async () => {
    try {
      const res = await fetch(`/api/cards/${id}`);
      if (!res.ok) throw new Error('Failed to fetch card');
      const data = await res.json();
      setCard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status]);

  useEffect(() => {
    if (params.id) fetchCard();
  }, [params.id]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;

  if (!card) return <div className="flex h-screen items-center justify-center">Card not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">

      {/* HEADER */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-bold text-xl">{card.name}</h1>
          <div className="flex gap-3">
            <Link href="/cards" className="text-indigo-600">← Back to Cards</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CARD IMAGE */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-center">
          <img
            src={card.templateImage}
            alt={card.name}
            className="max-w-full max-h-96 object-contain rounded-lg shadow"
          />
        </div>

        {/* CARD DETAILS */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">

          <div>
            <h2 className="text-2xl font-bold text-pink-800 mb-2">{card.name}</h2>
            <p className="text-pink-600">{card.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {card.category}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-pink-800">Price:</span>
              <span className="text-2xl font-bold text-indigo-600">₹{card.price}</span>
            </div>
            <p className="text-sm text-pink-600">Price per card. Quantity can be selected during booking.</p>
          </div>

          {/* FEATURES */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Eye className="mr-2 text-indigo-600" size={20} />
              Features
            </h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                High-quality PDF generation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Customizable recipient details
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Secure online payment
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Instant confirmation and download
              </li>
            </ul>
          </div>

          {/* BOOK NOW BUTTON */}
          <div className="pt-4">
            <Link
              href={`/book/${card._id}`}
              className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center"
            >
              <ShoppingCart className="mr-2" size={20} />
              Book Now
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
