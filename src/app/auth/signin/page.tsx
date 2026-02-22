'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(session.user.role === 'admin' ? '/admin' : '/');
    }
  }, [session, status, router]);

  const validateMobile = (value: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!value) return 'Mobile number is required';
    if (!mobileRegex.test(value)) return 'Invalid Indian mobile number';
    return '';
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobile(value);
    setMobileError(validateMobile(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const err = validateMobile(mobile);
    if (err) {
      setMobileError(err);
      setLoading(false);
      return;
    }

    try {
      // Add timeout to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );

      const signInPromise = signIn('credentials', {
        mobile,
        password,
        redirect: false,
      });

      const res = await Promise.race([signInPromise, timeoutPromise]) as any;

      if (res?.error) {
        setError('Invalid mobile or password');
        setLoading(false);
        return;
      }

      // Wait a bit for session to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force refresh the session
      const session = await getSession();
      
      if (session?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message === 'Request timeout' ? 'Server timeout. Please try again.' : 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#ff6b9f,#111)] px-4">

      {/* Glass Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 text-white">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 flex items-center justify-center shadow-xl">
            💍
          </div>
          <h2 className="text-3xl font-bold mt-3">RoyalCards Studio</h2>
          <p className="text-sm text-white/70">Login to customize your wedding card</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Mobile */}
          <div className="relative">
            <input
              type="tel"
              value={mobile}
              onChange={handleMobileChange}
              placeholder=" "
              className="peer w-full bg-transparent border border-white/30 rounded-xl px-4 pt-5 pb-2 text-white focus:outline-none focus:border-pink-500 transition"
            />
            <label className="absolute left-4 top-2 text-xs text-white/70 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
              Mobile Number
            </label>
            {mobileError && <p className="text-red-400 text-xs mt-1">{mobileError}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full bg-transparent border border-white/30 rounded-xl px-4 pt-5 pb-2 text-white focus:outline-none focus:border-pink-500 transition"
            />
            <label className="absolute left-4 top-2 text-xs text-white/70 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
              Password
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
              ⚠ {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-500 font-bold text-black hover:scale-105 transition-transform shadow-lg"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-white/70">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
