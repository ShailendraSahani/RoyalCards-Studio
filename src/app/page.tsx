"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();

  const fetchFeaturedCards = async () => {
    try {
      const response = await fetch('/api/cards?limit=3');
      if (response.ok) {
        const data = await response.json();
        setFeaturedCards(data.slice(0, 3)); // Show only first 3 cards
      }
    } catch (error) {
      console.error('Error fetching featured cards:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedCards();
    // Set up polling for real-time updates
    const interval = setInterval(fetchFeaturedCards, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
          >
           Royal Shaadi Cards
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Create beautiful, personalized wedding invitation cards with our advanced digital editor.
            Design, customize, and order professional marriage cards in minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/cards"
              className="bg-white text-rose-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:scale-105 transform"
            >
              Browse Cards
            </Link>
            {status === 'authenticated' && session ? (
              <Link
                href={session.user.role === 'admin' ? '/admin' : '/dashboard'}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-rose-600 transition-colors hover:scale-105 transform"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-rose-600 transition-colors hover:scale-105 transform"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-rose-50 to-transparent"></div>
      </section>

      {/* Search & Category Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Wedding Card</h2>
            <p className="text-gray-600 text-lg">Choose from various categories and styles to match your wedding theme</p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search wedding cards..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-rose-400 focus:outline-none shadow-lg"
              />
              <button
                className="absolute right-3 top-3 bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 transition-colors shadow-md"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Traditional', icon: '🏛️', count: '150+' },
              { name: 'Modern', icon: '✨', count: '200+' },
              { name: 'Elegant', icon: '💎', count: '120+' },
              { name: 'Fun', icon: '🎉', count: '80+' }
            ].map((category) => (
              <Link
                key={category.name}
                href={`/cards?category=${category.name.toLowerCase()}`}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-lg transition-all text-center group transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.count} designs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Wedding Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Wedding Cards</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover our most popular and trending wedding card designs loved by couples worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredCards.length > 0 ? featuredCards.map((card) => (
              <motion.div
                key={card._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="relative">
                  <img src={card.templateImage} alt={card.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">Featured</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{card.name}</h3>
                    <span className="text-rose-600 font-bold">₹{card.price}</span>
                  </div>
                  <p className="text-gray-500 mb-4">{card.category}</p>
                  <div className="flex gap-2">
                    <Link href={`/cards/${card._id}`} className="flex-1 bg-rose-500 text-white text-center py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium">View Details</Link>
                    <Link href={`/customize/${card._id}`} className="flex-1 border-2 border-rose-500 text-rose-500 text-center py-2 rounded-lg hover:bg-rose-50 transition-colors font-medium">Customize</Link>
                  </div>
                </div>
              </motion.div>
            )) : [1,2,3].map((id) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <div className="text-6xl">💒</div>
                  </div>
                  <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">Featured</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">Card {id}</h3>
                    <span className="text-rose-600 font-bold">₹{149 + id*30}</span>
                  </div>
                  <p className="text-gray-500 mb-4">Category</p>
                  <div className="flex gap-2">
                    <Link href={`/cards/${id}`} className="flex-1 bg-rose-500 text-white text-center py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium">View Details</Link>
                    <Link href={`/customize/${id}`} className="flex-1 border-2 border-rose-500 text-rose-500 text-center py-2 rounded-lg hover:bg-rose-50 transition-colors font-medium">Customize</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/cards" className="inline-block bg-rose-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-rose-600 transition-colors shadow-lg">
              View All Cards
            </Link>
          </div>
        </div>
      </section>

      {/* Live Editor & 3D Preview Highlight */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 initial={{x:-50, opacity:0}} whileInView={{x:0, opacity:1}} transition={{duration:0.7}} className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Live Editor & 3D Preview</motion.h2>
              <motion.p initial={{x:-50, opacity:0}} whileInView={{x:0, opacity:1}} transition={{duration:0.7, delay:0.2}} className="text-gray-600 text-lg mb-8">
                Experience our revolutionary canvas editor powered by Fabric.js. Add text, shapes, and images with real-time editing. See your design come to life with our interactive 3D preview using Three.js technology.
              </motion.p>

              <div className="space-y-4 mb-8">
                {[
                  { icon:'✏️', title:'Canvas Editor', desc:'Drag, resize, and customize elements with ease', bg:'bg-rose-100'},
                  { icon:'🎨', title:'3D Preview', desc:'See your card in 3D with realistic lighting', bg:'bg-blue-100'},
                  { icon:'💾', title:'Auto Save', desc:'Never lose your work with automatic saving', bg:'bg-green-100'}
                ].map((item,index)=>(
                  <motion.div key={index} whileHover={{scale:1.02}} className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center`}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href="/cards" className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-pink-600 transition-colors shadow-lg">
                Try Live Editor
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-2xl">
                <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center relative z-10">
                    <div className="text-8xl mb-4">💒</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Sample Card</h3>
                    <p className="text-gray-600">Interactive 3D Preview</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ y: -30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Why Choose Shaadi Cards?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              We&apos;re committed to making your wedding invitations perfect with cutting-edge technology and exceptional service.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '🎨', title: 'Professional Designs', desc: 'Choose from hundreds of professionally designed templates created by expert designers' },
              { icon: '⚡', title: 'Instant Customization', desc: 'Real-time editing with our advanced canvas editor. See changes instantly as you design' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick production and reliable delivery service to ensure your cards arrive on time' },
              { icon: '💰', title: 'Best Prices', desc: 'Competitive pricing with no hidden costs. Quality cards at affordable rates' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Design your cards anywhere, anytime with our fully responsive mobile interface' },
              { icon: '🛡️', title: 'Secure & Private', desc: 'Your personal information and designs are protected with enterprise-grade security' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-2"
            >
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Shaadi Cards
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Creating beautiful memories, one invitation at a time. Your perfect wedding card is just a few clicks away.
              </p>
              <div className="flex space-x-4">
                {['📘', '📷', '🐦', '💼'].map((icon, i) => (
                  <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">
                    {icon}
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/cards" className="text-gray-300 hover:text-white transition-colors">Browse Cards</Link></li>
            {session ? (
              <Link href={session.user.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            ) : (
              <Link href="/auth/signup" className="text-gray-300 hover:text-white transition-colors">Sign Up</Link>
            )}
                <li><Link href="/auth/signin" className="text-gray-300 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="border-t border-gray-800 mt-8 pt-8 text-center"
          >
            <p className="text-gray-400">
              © 2024 Shaadi Cards. All rights reserved. Made with ❤️ for happy couples.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
