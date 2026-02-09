'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  _id: string;
  cardDesign: {
    name: string;
  };
  customization: {
    previewImage: string;
  };
  quantity: number;
  totalPrice: number;
  status: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  createdAt: string;
}

export default function DownloadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status, router]);

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else if (response.status === 404) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvitation = async () => {
    if (!order) return;

    setDownloading(true);
    try {
      // Create a canvas to generate the invitation
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Fill background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add border
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Add title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Marriage Invitation', canvas.width / 2, 80);

      // Add card design image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const imgWidth = 400;
        const imgHeight = 300;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = 120;

        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

        // Add order details
        ctx.fillStyle = '#374151';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';

        const details = [
          `Order ID: ${order._id}`,
          `Card: ${order.cardDesign.name}`,
          `Quantity: ${order.quantity}`,
          `Total: ₹${order.totalPrice}`,
          `Status: ${order.status}`,
          '',
          'Shipping Address:',
          order.shippingAddress.name,
          order.shippingAddress.address,
          `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`,
          `Phone: ${order.shippingAddress.phone}`,
        ];

        let yPos = imgY + imgHeight + 40;
        details.forEach((detail, index) => {
          ctx.fillText(detail, 60, yPos + (index * 20));
        });

        // Add footer
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Thank you for choosing our service!', canvas.width / 2, canvas.height - 30);

        // Download the image
        const link = document.createElement('a');
        link.download = `marriage-invitation-${order._id}.png`;
        link.href = canvas.toDataURL();
        link.click();

        setDownloading(false);
      };

      img.src = order.customization.previewImage;
    } catch (error) {
      console.error('Error generating invitation:', error);
      setDownloading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || !order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Download Digital Invitation</h1>
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Marriage Invitation</h2>
              <p className="text-lg text-gray-600">
                Download your digital marriage invitation card
              </p>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Order ID:</span> {order._id}</p>
                  <p><span className="font-medium">Card Design:</span> {order.cardDesign.name}</p>
                  <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
                  <p><span className="font-medium">Total Price:</span> ₹{order.totalPrice}</p>
                  <p><span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="space-y-1">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Card Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Card Preview</h3>
              <div className="flex justify-center">
                <img
                  src={order.customization.previewImage}
                  alt="Card Preview"
                  className="max-w-md border border-gray-300 rounded-md shadow-md"
                />
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <button
                onClick={downloadInvitation}
                disabled={downloading || order.status !== 'delivered'}
                className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? 'Generating...' :
                 order.status !== 'delivered' ? 'Available when delivered' :
                 'Download Digital Invitation'}
              </button>
              {order.status !== 'delivered' && (
                <p className="text-sm text-gray-600 mt-2">
                  Digital invitation will be available once your order is delivered.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
