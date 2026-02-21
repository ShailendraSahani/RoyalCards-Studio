'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-400 text-white py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-yellow-400"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300 rounded-full opacity-20"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-300 rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-white">
                💒 Royal Card Studio
              </h3>
              <p className="text-white/90 mb-4 max-w-md">
                Create beautiful wedding invitations that tell your unique love story. 
                Premium quality cards with fast delivery across India.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: '📘', label: 'Facebook' },
                  { icon: '📷', label: 'Instagram' },
                  { icon: '🐦', label: 'Twitter' },
                  { icon: '💼', label: 'LinkedIn' }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg hover:bg-white/30 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-white border-b border-white/30 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Browse Cards', href: '/cards' },
                { name: 'Templates', href: '/templates' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'Track Order', href: '/dashboard' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-white hover:underline transition-colors flex items-center gap-2"
                  >
                    <span className="text-yellow-300">►</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-white border-b border-white/30 pb-2">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Help Center', href: '/help' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'FAQs', href: '/help' },
                { name: 'Returns', href: '/help' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="text-white/80 hover:text-white hover:underline transition-colors flex items-center gap-2"
                  >
                    <span className="text-yellow-300">►</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4 text-lg text-white border-b border-white/30 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="text-white/90 text-sm">Email</p>
                <a href="mailto:shailendrasahani273209@gmail.com" className="text-white hover:underline">
                    shailendrasahani273209@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-white/90 text-sm">Phone</p>
                  <a href="tel:+917388711487" className="text-white hover:underline">
                    +91 73887 11487
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-white/90 text-sm">Address</p>
                  <p className="text-white/90 text-sm">
                    123, CL-1, Sector-5<br />
                    Gorakhpur-273209, U.P
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/30 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/90 text-sm">
              © {new Date().getFullYear()} Royal Card Studio. All rights reserved.
            </p>
            <div className="flex gap-6">
              {[
                { name: 'Terms & Conditions', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Refund Policy', href: '#' },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-white/80 text-sm hover:text-white hover:underline transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm">
              💳 We accept: UPI, Credit/Debit Cards, Net Banking, Wallets
            </p>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span>🔒 Secure Payments by</span>
              <span className="font-bold text-white">Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
