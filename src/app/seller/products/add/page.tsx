'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
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
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/seller/dashboard');
    } else if (status === 'authenticated') {
      const userRole = (session.user as any)?.role;
      const isSeller = (session.user as any)?.isSeller;
      const sellerStatus = (session.user as any)?.sellerRequestStatus;
      
      if (userRole !== 'seller' && !isSeller) {
        router.push('/become-seller');
      } else if (sellerStatus !== 'approved') {
        router.push('/become-seller?status=pending');
      }
    }
  }, [status, session, router]);

  // Handle image file upload (convert to base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, templateImage: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, templateImage: 'Image size must be less than 5MB' });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData({ ...formData, templateImage: result });
      setImagePreview(result);
      setUploading(false);
      if (errors.templateImage) {
        setErrors({ ...errors, templateImage: '' });
      }
    };
    reader.onerror = () => {
      setUploading(false);
      setErrors({ ...errors, templateImage: 'Error reading file' });
    };
    reader.readAsDataURL(file);
  };

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
      newErrors.templateImage = 'Template image is required';
    }
    if (formData.price < 0) {
      newErrors.price = 'Price must be greater than or equal to 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'loading') {
      setErrors({ submit: 'Please wait while we load your session' });
      return;
    }

    if (!session?.user?.id) {
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
        createdBy: session.user.id,
      };

      const response = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/seller/dashboard?tab=products');
      } else {
        const errorData = await response.json();
        
        if (errorData.errors) {
          const newErrors: Record<string, string> = {};
          for (const [key, message] of Object.entries(errorData.errors)) {
            newErrors[key] = message as string;
          }
          setErrors({ ...newErrors, submit: errorData.message || 'Validation failed' });
        } else {
          setErrors({ submit: errorData.message || 'An error occurred while adding the product' });
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setErrors({ submit: 'An error occurred while adding the product' });
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

  const removeImage = () => {
    setFormData({ ...formData, templateImage: '' });
    setImagePreview('');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
          <p className="text-pink-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50">
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/seller/dashboard" className="text-pink-600 hover:text-pink-800 flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold text-pink-900">Add New Product</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-pink-900 ${
                  errors.name ? 'border-red-500' : 'border-pink-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-pink-900 ${
                  errors.description ? 'border-red-500' : 'border-pink-300'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                aria-label="Category"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-pink-900 ${
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

            {/* Template Image - Upload */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Template Image *
              </label>
              
              {(imagePreview || formData.templateImage) && (
                <div className="mb-3 relative inline-block">
                  <img 
                    src={imagePreview || formData.templateImage} 
                    alt="Preview" 
                    className="max-w-xs max-h-48 rounded-lg border border-pink-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="product-image-upload"
                  disabled={uploading}
                />
                <label 
                  htmlFor="product-image-upload"
                  className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
                    errors.templateImage 
                      ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                      : 'border-pink-300 bg-pink-50 hover:bg-pink-100'
                  }`}
                >
                  {uploading ? (
                    <span className="text-pink-600 flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="text-pink-600 font-medium flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Click to Upload Image
                    </span>
                  )}
                </label>
                <p className="mt-1 text-xs text-pink-500 text-center">
                  Supports JPG, PNG, GIF (Max 5MB)
                </p>
              </div>

              {errors.templateImage && <p className="mt-1 text-sm text-red-600">{errors.templateImage}</p>}
            </div>

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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 ${
                  errors.price ? 'border-red-500' : 'border-pink-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-pink-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-pink-900">
                Active (visible to customers)
              </label>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Link
                href="/seller/dashboard"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center space-x-2"
              >
                <span>Cancel</span>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-4 py-2 rounded-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{loading ? 'Adding...' : 'Add Product'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
