'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';

export default function AddCardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'traditional',
    templateImage: '',
    price: 100,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.templateImage.trim()) {
      newErrors.templateImage = 'Template image URL is required';
    } else if (!isValidUrl(formData.templateImage)) {
      newErrors.templateImage = 'Please enter a valid URL';
    }
  if (formData.price < 0) {
    newErrors.price = 'Price must be greater than or equal to 0';
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'loading') {
      setErrors({ submit: 'Please wait while we load your session' });
      return;
    }

    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    if (!session.user.id) {
      setErrors({ submit: 'Unable to get user ID. Please try logging in again.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        createdBy: session?.user?.id,
      };

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/cards');
      } else {
        const errorData = await response.json();
        
        // Handle validation errors from the backend
        if (errorData.errors) {
          const newErrors: Record<string, string> = {};
          for (const [key, message] of Object.entries(errorData.errors)) {
            newErrors[key] = message as string;
          }
          setErrors({ ...newErrors, submit: errorData.message || 'Validation failed' });
        } else {
          setErrors({ submit: errorData.message || 'An error occurred while adding the card' });
        }
      }
    } catch (error) {
      console.error('Error adding card:', error);
      setErrors({ submit: 'An error occurred while adding the card' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/cards" className="text-yellow-600 hover:text-yellow-800 flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back to Cards</span>
              </Link>
              <h1 className="text-2xl font-bold text-pink-900">Add New Card Design</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Card Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-pink-900 ${
                  errors.name ? 'border-red-500' : 'border-pink-300'
                }`}
                placeholder="Enter card name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-pink-900 ${
                  errors.description ? 'border-red-500' : 'border-pink-300'
                }`}
                placeholder="Enter card description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                aria-label="Category"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-pink-900 ${
                  errors.category ? 'border-red-500' : 'border-pink-300'
                }`}
              >
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
                <option value="elegant">Elegant</option>
                <option value="fun">Fun</option>
                <option value="royal">Royal</option>
                <option value="floral">Floral</option>
                <option value="birthday">Birthday</option>
                <option value="party">Party</option>
                <option value="marriage">Marriage</option>
                <option value="tilak">Tilak</option>
                <option value="engagement">Engagement</option>
                <option value="babyShower">Baby Shower</option>
                <option value="anniversary">Anniversary</option>
                <option value="reception">Reception</option>
                <option value="haldi">Haldi</option>
                <option value="mehendi">Mehendi</option>
                <option value="sangeet">Sangeet</option>
                <option value="roka">Roka</option>
                <option value="festival">Festival</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Template Image URL */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Template Image URL *
              </label>
              <input
                type="url"
                value={formData.templateImage}
                onChange={(e) => handleInputChange('templateImage', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-pink-900 ${
                  errors.templateImage ? 'border-red-500' : 'border-pink-300'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.templateImage && <p className="mt-1 text-sm text-red-600">{errors.templateImage}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.price ? 'border-red-500' : 'border-pink-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-pink-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-pink-900">
                Active (visible to users)
              </label>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/cards"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center space-x-2"
              >
                <span>Cancel</span>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{loading ? 'Adding...' : 'Add Card'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
