import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { MessageWithUser, User } from '@shared/schema';

interface UseSocketProps {
  onNewMessage?: (message: MessageWithUser) => void;
  onUserTyping?: (data: { username: string; isTyping: boolean }) => void;
  onUserStatusUpdate?: (user: User) => void;
  onError?: (error: string) => void;
}

export function useSocket({
  onNewMessage,
  onUserTyping,
  onUserStatusUpdate,
  onError
}: UseSocketProps = {}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection - works for both development and production
    const serverUrl = window.location.origin;
    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    const socket = socketRef.current;

    // Set up event listeners
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('new-message', (message: MessageWithUser) => {
      onNewMessage?.(message);
    });

    socket.on('user-typing', (data: { username: string; isTyping: boolean }) => {
      onUserTyping?.(data);
    });

    socket.on('user-status-update', (user: User) => {
      onUserStatusUpdate?.(user);
    });

    socket.on('message-error', (data: { error: string }) => {
      onError?.(data.error);
    });

    socket.on('status-error', (data: { error: string }) => {
      onError?.(data.error);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [onNewMessage, onUserTyping, onUserStatusUpdate, onError]);

  const joinChannel = (channelId: number) => {
    socketRef.current?.emit('join-channel', channelId);
  };

  const leaveChannel = (channelId: number) => {
    socketRef.current?.emit('leave-channel', channelId);
  };

  const sendMessage = (content: string, channelId: number, userId: number) => {
    socketRef.current?.emit('send-message', { content, channelId, userId });
  };

  const startTyping = (channelId: number, username: string) => {
    socketRef.current?.emit('typing-start', { channelId, username });
  };

  const stopTyping = (channelId: number, username: string) => {
    socketRef.current?.emit('typing-stop', { channelId, username });
  };

  const updateStatus = (userId: number, status: string) => {
    socketRef.current?.emit('update-status', { userId, status });
  };

  return {
    joinChannel,
    leaveChannel,
    sendMessage,
    startTyping,
    stopTyping,
    updateStatus,
    socket: socketRef.current
  };
}