import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socketService';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  const connect = useCallback(() => {
    const userId = user?._id || user?.id;
    const userRole = user?.role;
    const token = localStorage.getItem('token');
    
    console.log('🔌 Socket connect attempt:', { 
      userId, 
      userRole, 
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });
    
    if (!userId || !userRole) {
      console.warn('🚨 Cannot connect socket: No user data', { 
        user,
        hasUserId: !!userId,
        hasUserRole: !!userRole
      });
      return;
    }

    if (!token) {
      console.error('🚨 Cannot connect socket: No authentication token found');
      return;
    }

    if (socketService.isSocketConnected()) {
      console.log('🔌 Socket already connected');
      setIsConnected(true);
      return;
    }

    const socket = socketService.connect(userId, userRole);
    
    if (socket) {
      socket.on('connect', () => {
        console.log('✅ Socket connected in hook');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected in hook');
        setIsConnected(false);
        setOnlineUsers([]);
      });

      // Handle online users - match working example
      socketService.onOnlineUsers((users) => {
        console.log('👥 Initial online users:', users);
        setOnlineUsers(Array.isArray(users) ? users : []);
      });

      socketService.onUserStatusChange(({ userId, isOnline }) => {
        console.log('👥 User status change:', { userId, isOnline });
        setOnlineUsers(prev => {
          if (isOnline) {
            return [...new Set([...prev, userId])];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      });
    }
  }, [user]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
    setOnlineUsers([]);
  }, []);

  // Auto-connect when user is available
  useEffect(() => {
    const userId = user?._id || user?.id;
    const userRole = user?.role;
    
    if (userId && userRole) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      socketService.removeAllListeners();
    };
  }, [user, connect, disconnect]);

  return {
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    socket: socketService.getSocket(),
  };
};

export const useChat = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { isConnected } = useSocket();

  // Join conversation when connected
  useEffect(() => {
    if (isConnected && conversationId) {
      console.log('📨 Joining conversation:', conversationId);
      socketService.joinChat(conversationId);

      return () => {
        console.log('📨 Leaving conversation:', conversationId);
        socketService.leaveChat(conversationId);
      };
    }
  }, [isConnected, conversationId]);

  // Listen for new messages
  useEffect(() => {
    if (!isConnected) return;

    const handleNewMessage = (message) => {
      console.log('📨 New message received:', message);
      // Only add message if it's for this conversation
      const otherId = message.sender._id === conversationId ? message.receiver._id : message.sender._id;
      if (otherId === conversationId || message.sender._id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleTyping = ({ senderId, isTyping }) => {
      console.log('⌨️ Typing event:', { senderId, isTyping, conversationId });
      if (senderId === conversationId) {
        if (isTyping) {
          setTypingUsers((prev) => {
            if (!prev.find(u => u.userId === senderId)) {
              return [...prev, { userId: senderId, userName: 'User' }];
            }
            return prev;
          });
        } else {
          setTypingUsers((prev) => prev.filter(u => u.userId !== senderId));
        }
      }
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onTyping(handleTyping);
    socketService.onStopTyping(handleTyping); // Same handler, different isTyping value

    return () => {
      socketService.removeAllListeners();
    };
  }, [isConnected, conversationId]);

  // Typing functionality - match working example
  const startTyping = useCallback((receiverId) => {
    if (!isConnected || !receiverId) return;
    socketService.emitTyping(receiverId, true);
    setIsTyping(true);
  }, [isConnected]);

  const stopTyping = useCallback((receiverId) => {
    if (!isConnected || !receiverId) return;
    socketService.emitStopTyping(receiverId);
    setIsTyping(false);
  }, [isConnected]);

  const sendMessage = useCallback(() => {
    if (!isConnected) return;
    console.log('🚨 Note: In working example, messages are sent via API, not socket');
    // Socket is only for real-time updates, not sending
  }, [isConnected]);

  return {
    messages,
    setMessages,
    typingUsers,
    isTyping,
    startTyping,
    stopTyping,
    sendMessage,
  };
};
