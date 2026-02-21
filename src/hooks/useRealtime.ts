import { useEffect, useState, useCallback, useRef } from 'react';

interface RealtimeMessage {
  type: string;
  collection?: string;
  operation?: string;
  timestamp?: string;
  data?: unknown;
  code?: string;
  message?: string;
}

interface UseRealtimeOptions {
  endpoint: string;
  onMessage?: (data: RealtimeMessage) => void;
  enabled?: boolean;
  reconnectInterval?: number;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  lastMessage: RealtimeMessage | null;
  error: Error | null;
  reconnect: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export function useRealtime({
  endpoint,
  onMessage,
  enabled = true,
  reconnectInterval = 5000,
}: UseRealtimeOptions): UseRealtimeReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<RealtimeMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isAuthErrorRef = useRef(false);
  
  // Use ref to store the connect function to avoid circular reference
  const connectRef = useRef<AnyFunction | null>(null);

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
    isAuthErrorRef.current = false;
    disconnect();
    if (connectRef.current) {
      connectRef.current();
    }
  }, [disconnect]);

  // Define connect function
  const connect = useCallback(() => {
    // Don't reconnect if we've hit an auth error
    if (isAuthErrorRef.current) {
      console.log('[Realtime] Skipping reconnect due to authentication error');
      return;
    }
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource(endpoint);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log(`[Realtime] Connected to ${endpoint}`);
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[Realtime] Message received:', data);
          
          // Handle error messages from server
          if (data.type === 'error') {
            console.error('[Realtime] Server error:', data.message);
            
            if (data.code === 'AUTH_REQUIRED') {
              isAuthErrorRef.current = true;
              setError(new Error(data.message || 'Authentication required'));
              // Don't retry on auth errors
              return;
            }
            
            if (data.code === 'SERVER_ERROR') {
              setError(new Error(data.message || 'Server error'));
            }
          }
          
          setLastMessage(data);
          if (onMessage) {
            onMessage(data);
          }
        } catch (parseError) {
          console.error('[Realtime] Error parsing message:', parseError);
        }
      };

      eventSource.onerror = (err) => {
        // Log more detailed error information
        console.error('[Realtime] SSE Error:', err);
        console.error('[Realtime] Ready state:', eventSource.readyState);
        console.error('[Realtime] URL:', endpoint);
        
        setIsConnected(false);
        eventSource.close();

        // Check if this is an authentication error that we should not retry
        // The server sends error messages via SSE, so we need to handle that in onmessage
        // For now, implement reconnection with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts && !isAuthErrorRef.current) {
          const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`[Realtime] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            if (connectRef.current) {
              connectRef.current();
            }
          }, delay);
        } else if (isAuthErrorRef.current) {
          setError(new Error('Please sign in to enable real-time updates'));
        } else {
          setError(new Error('Max reconnection attempts reached. Please refresh the page.'));
        }
      };
    } catch (err) {
      console.error('[Realtime] Error creating EventSource:', err);
      setError(err as Error);
    }
  }, [endpoint, onMessage, reconnectInterval]);

  // Store connect in ref for use in reconnect
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Handle enabled/disabled state changes
  useEffect(() => {
    // Use setTimeout to defer the connect/disconnect call
    // This avoids the ESLint warning about calling setState in effects
    const timer = setTimeout(() => {
      if (enabled) {
        connect();
      } else {
        disconnect();
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    error,
    reconnect,
  };
}

// Hook specifically for user-specific realtime updates (orders, cart)
export function useUserRealtime(userId?: string) {
  const [notifications, setNotifications] = useState<RealtimeMessage[]>([]);
  
  const handleMessage = useCallback((data: RealtimeMessage) => {
    if (data.type === 'update' && data.data && typeof data.data === 'object' && 'userId' in data.data && data.data.userId === userId) {
      setNotifications(prev => [data, ...prev].slice(0, 10));
    }
  }, [userId]);

  const { isConnected, lastMessage, error, reconnect } = useRealtime({
    endpoint: '/api/realtime',
    onMessage: handleMessage,
    enabled: !!userId,
  });

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    notifications,
    clearNotifications,
    reconnect,
  };
}

// Hook for admin realtime monitoring
export function useAdminRealtime() {
  const [newBookings, setNewBookings] = useState<RealtimeMessage[]>([]);
  
  const handleMessage = useCallback((data: RealtimeMessage) => {
    if (data.type === 'update' && 
        (data.collection === 'weddingbookings' || data.collection === 'orders')) {
      setNewBookings(prev => [data, ...prev].slice(0, 5));
    }
  }, []);

  const { isConnected, lastMessage, error, reconnect } = useRealtime({
    endpoint: '/api/admin/realtime',
    onMessage: handleMessage,
    enabled: true,
  });

  const clearNewBookings = useCallback(() => {
    setNewBookings([]);
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    newBookings,
    clearNewBookings,
    reconnect,
  };
}
