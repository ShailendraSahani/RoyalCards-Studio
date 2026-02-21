import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRealtime } from './useRealtime';

interface CartItem {
  _id: string;
  quantity: number;
  totalPrice: number;
  cardDesign?: {
    name: string;
    price: number;
  };
}

interface UseCartCountReturn {
  cartCount: number;
  isLoading: boolean;
  error: Error | null;
  refreshCart: () => Promise<void>;
}

export function useCartCount(): UseCartCountReturn {
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch cart count from API
  const fetchCartCount = useCallback(async () => {
    if (status === 'unauthenticated') {
      setCartCount(0);
      setIsLoading(false);
      return;
    }

    if (status !== 'authenticated' || !session?.user?.id) {
      return;
    }

    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data: CartItem[] = await response.json();
        // Calculate total quantity from all cart items
        const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalQuantity);
      } else {
        console.error('Failed to fetch cart:', response.status);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  // Handle realtime updates for cart
  const handleRealtimeUpdate = useCallback(() => {
    // When there's a cart update, refresh the cart count
    fetchCartCount();
  }, [fetchCartCount]);

  // Use the realtime hook to listen for cart updates
  useRealtime({
    endpoint: '/api/realtime',
    onMessage: (data) => {
      if (data.collection === 'carts') {
        handleRealtimeUpdate();
      }
    },
    enabled: status === 'authenticated',
  });

  // Fetch initial cart count
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return {
    cartCount,
    isLoading,
    error,
    refreshCart: fetchCartCount,
  };
}
