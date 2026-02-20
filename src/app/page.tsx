"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChevronRight, Star } from 'lucide-react';

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
}

export default function HomePage() {
  const [featuredCards, setFeaturedCards] = useState<CardDesign[]>([]);
  const { data: session } = useSession();

  const fetchFeaturedCards = async () => {
    try {
      const response = await fetch('/api/cards?limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedCards(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching featured cards:', error);
    }
  };

  useEffect(() => {
    const loadCards = async () => {
      await fetchFeaturedCards();
    };
    loadCards();
    const interval = setInterval(fetchFeaturedCards, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: 'Traditional', icon: '🏛️', count: '150+' },
    { name: 'Modern', icon: '✨', count: '200+' },
    { name: 'Elegant', icon: '💎', count: '120+' },
    { name: 'Fun', icon: '🎉', count: '80+' },
    { name: 'Royal', icon: '👑', count: '90+' },
    { name: 'Floral', icon: '🌸', count: '100+' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6]">

      {/* Banner Strip - Pink Theme */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            <div className="flex-shrink-0 w-[160px] cursor-pointer hover:opacity-90 transition">
              <img 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop" 
                alt="Wedding Special"
                className="w-full h-[140px] object-cover rounded-sm"
              />
            </div>
            <div className="flex-shrink-0 w-[160px] cursor-pointer hover:opacity-90 transition">
              <img 
                src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&h=200&fit=crop" 
                alt="New Designs"
                className="w-full h-[140px] object-cover rounded-sm"
              />
            </div>
            <div className="flex-shrink-0 w-[160px] cursor-pointer hover:opacity-90 transition">
              <img 
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300&h=200&fit=crop" 
                alt="Custom Cards"
                className="w-full h-[140px] object-cover rounded-sm"
              />
            </div>
            <div className="flex-shrink-0 w-[160px] cursor-pointer hover:opacity-90 transition">
              <img 
                src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=300&h=200&fit=crop" 
                alt="Premium Collection"
                className="w-full h-[140px] object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Strip */}
      <section className="bg-white shadow-sm py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/cards?category=${category.name.toLowerCase()}`}
                className="flex flex-col items-center min-w-[80px] hover:opacity-80 transition group"
              >
                <div className="text-3xl mb-1">{category.icon}</div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-pink-600">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500">{category.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {/* Left Side - Cards */}
            <div className="flex-1">
              {/* Featured Cards Section */}
              <div className="bg-white rounded-sm shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Wedding Cards - Trending Now</h2>
                    <p className="text-sm text-gray-500">Discover our most popular designs</p>
                  </div>
                  <Link 
                    href="/cards" 
                    className="text-pink-600 font-medium text-sm hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {featuredCards.length > 0 ? featuredCards.map((card) => (
                    <Link 
                      key={card._id}
                      href={`/cards/${card._id}`}
                      className="group border border-gray-100 rounded-sm p-2 hover:shadow-md transition"
                    >
                      <div className="relative mb-2">
                        <img 
                          src={card.templateImage} 
                          alt={card.name} 
                          className="w-full h-32 object-cover rounded-sm"
                        />
                        <div className="absolute top-1 right-1 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
                          4.2 ★
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-800 truncate">{card.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">{card.category}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">₹{card.price}</span>
                          <span className="text-xs text-gray-400 line-through">₹{card.price + 50}</span>
                          <span className="text-xs text-green-600 font-medium">50% OFF</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">Free Shipping</div>
                      </div>
                    </Link>
                  )) : [1,2,3,4,5,6].map((id) => (
                    <Link 
                      key={id}
                      href={`/cards/${id}`}
                      className="group border border-gray-100 rounded-sm p-2 hover:shadow-md transition"
                    >
                      <div className="relative mb-2">
                        <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-sm flex items-center justify-center">
                          <span className="text-4xl">💒</span>
                        </div>
                        <div className="absolute top-1 right-1 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
                          4.{id} ★
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-800 truncate">Card Design {id}</h3>
                        <p className="text-xs text-gray-500 mb-1">Traditional</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">₹{149 + id*20}</span>
                          <span className="text-xs text-gray-400 line-through">₹{299 + id*20}</span>
                          <span className="text-xs text-green-600 font-medium">50% OFF</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">Free Shipping</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* More Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Best Sellers', 'New Arrivals', 'Premium Collection', 'Budget Friendly'].map((title, idx) => (
                  <div key={title} className="bg-white rounded-sm shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{title}</h3>
                      <Link href="/cards" className="text-pink-600 text-sm hover:underline">
                        See All
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[1,2,3,4].map((i) => (
                        <Link 
                          key={i}
                          href={`/cards/${idx * 4 + i}`}
                          className="group"
                        >
                          <div className="w-full h-24 bg-gradient-to-br from-pink-50 to-rose-50 rounded-sm mb-2 flex items-center justify-center">
                            <span className="text-2xl">🎊</span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 truncate">Design {idx * 4 + i}</p>
                          <p className="text-sm font-bold">₹{199 + idx * 50}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Offers */}
            <div className="hidden lg:block w-[235px] flex-shrink-0">
              <div className="bg-white rounded-sm shadow-sm p-4 sticky top-20">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Top Offers</h3>
                <div className="space-y-3">
                  {[
                    { icon: '🎁', title: 'Bank Offers', desc: '5% Instant Discount' },
                    { icon: '📱', title: 'Mobile Recharge', desc: 'Get 10% SuperCash' },
                    { icon: '🛒', title: 'Buy More Save More', desc: 'Up to 50% Off' },
                    { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹299' },
                  ].map((offer, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-sm cursor-pointer transition">
                      <span className="text-xl">{offer.icon}</span>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{offer.title}</p>
                        <p className="text-xs text-gray-500">{offer.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/cards"
                  className="block text-center mt-4 text-pink-600 font-medium text-sm hover:underline"
                >
                  View All Offers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Compact Style */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🎨', title: 'Professional Designs', desc: 'Expert designers' },
              { icon: '⚡', title: 'Instant Customization', desc: 'Real-time editing' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick production' },
              { icon: '💰', title: 'Best Prices', desc: 'Quality at affordable rates' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-medium text-sm text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Flipkart Style */}
      <footer className="bg-[#172337] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <h4 className="font-semibold mb-3 text-gray-400">ABOUT</h4>
              <ul className="space-y-1 text-sm">
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                <li><Link href="/careers" className="hover:underline">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-400">HELP</h4>
              <ul className="space-y-1 text-sm">
                <li><Link href="/shipping" className="hover:underline">Shipping Info</Link></li>
                <li><Link href="/cancellation" className="hover:underline">Cancellation</Link></li>
                <li><Link href="/returns" className="hover:underline">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-400">SOCIAL</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:underline">Facebook</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-400">Mail Us</h4>
              <p className="text-sm">support@weddingcards.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-400">Registered Office</h4>
              <p className="text-sm text-gray-400">
                Wedding Cards Pvt Ltd<br/>
                123, Card Street<br/>
                Mumbai, Maharashtra
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 WeddingCards. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
