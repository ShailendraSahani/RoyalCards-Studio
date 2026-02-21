import { useEffect, useState, useCallback, useRef } from 'react';

interface SellerStatus {
  status: string;
  isSeller: boolean;
  shopName: string;
  previousStatus?: string;
}

interface UseSellerRealtimeReturn {
  isConnected: boolean;
  sellerStatus: SellerStatus | null;
  error: Error | null;
  reconnect: () => void;
}

// Hook specifically for seller status realtime updates
export function useSellerRealtime(enabled: boolean = true): UseSellerRealtimeReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [sellerStatus, setSellerStatus] = useState<SellerStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const connectRef = useRef<(() => void) | null>(null);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    disconnect();
    if (connectRef.current) {
      connectRef.current();
    }
  }, [disconnect]);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource('/api/seller/realtime');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('[SellerRealtime] Connected to seller status updates');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[SellerRealtime] Received:', data);
          setSellerStatus(data);
        } catch (parseError) {
          console.error('[SellerRealtime] Error parsing message:', parseError);
        }
      };

      eventSource.onerror = (err) => {
        console.error('[SellerRealtime] SSE Error:', err);
        setIsConnected(false);
        eventSource.close();

        // Implement reconnection with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = 3000 * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`[SellerRealtime] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            if (connectRef.current) {
              connectRef.current();
            }
          }, delay);
        } else {
          setError(new Error('Max reconnection attempts reached'));
        }
      };
    } catch (err) {
      console.error('[SellerRealtime] Error creating EventSource:', err);
      setError(err as Error);
    }
  }, []);

  // Store connect in ref for use in reconnect
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (!enabled) {
      disconnect();
      return;
    }

    // Delay connection slightly to avoid synchronous state updates
    const timer = setTimeout(() => {
      connect();
    }, 100);

    return () => {
      clearTimeout(timer);
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    sellerStatus,
    error,
    reconnect,
  };
}
