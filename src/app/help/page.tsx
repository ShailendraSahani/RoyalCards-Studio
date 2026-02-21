'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function HelpPage() {
  const helpCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      topics: [
        { name: 'How to create an account', link: '#account' },
        { name: 'Browsing wedding cards', link: '#browse' },
        { name: 'Understanding pricing', link: '#pricing' }
      ]
    },
    {
      title: 'Customization',
      icon: '🎨',
      topics: [
        { name: 'Using the canvas editor', link: '#editor' },
        { name: 'Adding text and images', link: '#text-images' },
        { name: '3D preview guide', link: '#preview' }
      ]
    },
    {
      title: 'Orders & Payment',
      icon: '💳',
      topics: [
        { name: 'Placing an order', link: '#ordering' },
        { name: 'Payment methods', link: '#payment' },
        { name: 'Order tracking', link: '#tracking' }
      ]
    },
    {
      title: 'Technical Support',
      icon: '🛠️',
      topics: [
        { name: 'Browser compatibility', link: '#browser' },
        { name: 'File upload issues', link: '#upload' },
        { name: 'Mobile app access', link: '#mobile' }
      ]
    }
  ];

  const quickGuides = [
    {
      title: 'Quick Start Guide',
      description: 'Get up and running in under 5 minutes',
      icon: '⚡',
      steps: [
        'Create your free account',
        'Browse and select a card design',
        'Customize with your details',
        'Place your order'
      ]
    },
    {
      title: 'Design Tips',
      description: 'Make your cards look professional',
      icon: '💡',
      steps: [
        'Choose high-resolution images',
        'Use readable fonts and sizes',
        'Maintain good contrast',
        'Proofread all text carefully'
      ]
    },
    {
      title: 'Order Timeline',
      description: 'What to expect after ordering',
      icon: '⏰',
      steps: [
        'Order confirmation (instant)',
        'Design approval (24 hours)',
        'Printing (2-3 business days)',
        'Shipping (2-7 business days)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-pink-600 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-6 py-4 text-lg border-2 border-pink-200 rounded-full focus:border-rose-400 focus:outline-none shadow-lg"
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
        </motion.div>

        {/* Help Categories */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-pink-800 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.topics.map((topic, i) => (
                    <li key={i}>
                      <a href={topic.link} className="text-rose-600 hover:text-rose-800 transition-colors text-sm">
                        {topic.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Guides */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Quick Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {quickGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-4xl mb-4">{guide.icon}</div>
                <h3 className="text-xl font-bold text-pink-800 mb-2">{guide.title}</h3>
                <p className="text-pink-600 mb-6">{guide.description}</p>
                <ol className="space-y-2">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="bg-rose-100 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-pink-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'How to upload and edit photos', views: '2.3k views' },
              { title: 'Understanding delivery timelines', views: '1.8k views' },
              { title: 'Custom sizing and paper options', views: '1.5k views' },
              { title: 'Payment and refund policies', views: '1.2k views' }
            ].map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-pink-800 mb-2">{article.title}</h3>
                <p className="text-sm text-pink-500">{article.views}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-rose-500 to-yellow-500 rounded-xl shadow-lg p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
            <p className="text-lg opacity-90 mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-100 transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="tel:+917388711487"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-rose-600 transition-colors"
              >
                Call Now: +91 73887 11487
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
