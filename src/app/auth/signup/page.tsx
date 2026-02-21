'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, password }),
      });

      if (response.ok) {
        router.push('/auth/signin?message=Registration successful');
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-white px-4">

      {/* Card Box */}
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border border-pink-200">

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-pink-700">Create Your Account 💍</h2>
          <p className="text-pink-600 mt-1">Start booking beautiful marriage cards</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white border-2 border-pink-400 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 
              placeholder-gray-500 text-black shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              placeholder="Enter 10 digit mobile number"
              className="w-full px-4 py-3 bg-white border-2 border-pink-400 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 
              placeholder-gray-500 text-black shadow-sm"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Create password"
              className="w-full px-4 py-3 bg-white border-2 border-pink-400 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 
              placeholder-gray-500 text-black shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Confirm password"
              className="w-full px-4 py-3 bg-white border-2 border-pink-400 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 
              placeholder-gray-500 text-black shadow-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-600 to-yellow-500 
            hover:from-pink-700 hover:to-yellow-600 transition-all duration-300 shadow-lg"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-pink-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-pink-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
