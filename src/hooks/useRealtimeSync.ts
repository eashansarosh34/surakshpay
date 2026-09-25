'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseRealtimeSyncProps {
  merchantId: string;
  onPaymentReceived: (transactionData: any) => void;
  onDashboardUpdate: (newStats: any) => void;
}

export function useRealtimeSync({ merchantId, onPaymentReceived, onDashboardUpdate }: UseRealtimeSyncProps) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!merchantId) return;

    // Connect to the NestJS WebSocket Server
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/realtime';
    socketRef.current = io(socketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // On successful connection, join the merchant's private room
    socket.on('connect', () => {
      console.log('Connected to real-time server');
      socket.emit('subscribe_merchant', merchantId);
    });

    // Listen for instant payment notifications
    socket.on('payment_received', (data) => {
      console.log('Live Payment Received!', data);
      onPaymentReceived(data);
    });

    // Listen for dashboard stat updates
    socket.on('dashboard_updated', (stats) => {
      console.log('Live Dashboard Update!', stats);
      onDashboardUpdate(stats);
    });

    // Cleanup connection when the tab is closed or component unmounts
    return () => {
      socket.disconnect();
    };
  }, [merchantId, onPaymentReceived, onDashboardUpdate]);
}
