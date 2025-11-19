import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId, userRole) {
    if (this.socket?.connected) {
      console.log('🔌 Socket already connected');
      return this.socket;
    }

    console.log('🔌 Connecting to socket server...', { userId, userRole });
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('⚠️ No token found in localStorage. Socket connection may fail.');
    } else {
      console.log('✅ Token found for socket connection:', token.substring(0, 20) + '...');
    }
    
    // Create socket connection with token
    this.socket = io('https://jinnar-marketplace.onrender.com', {
      transports: ['websocket', 'polling'],
      auth: {
        token: token || '' // Send token without Bearer prefix (backend adds it)
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 Socket connection error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        type: error.type,
        description: error.description,
        context: error.context
      });
      
      // If token is invalid, provide helpful debug info
      if (error.message?.includes('Invalid token') || error.message?.includes('jwt') || error.message?.includes('auth')) {
        console.warn('⚠️ Authentication error detected!');
        const currentToken = localStorage.getItem('token');
        console.log('📋 Token debug info:', {
          hasToken: !!currentToken,
          tokenLength: currentToken?.length || 0,
          tokenStart: currentToken?.substring(0, 30) || 'none',
          isJWT: currentToken?.split('.').length === 3
        });
        
        if (!currentToken) {
          console.error('❌ No token available. User needs to log in.');
          console.error('💡 Tip: Make sure user is logged in before connecting to socket.');
        } else {
          console.error('❌ Token exists but is invalid or expired.');
          console.error('💡 Tip: User may need to log in again.');
        }
        
        this.isConnected = false;
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Chat related methods - Updated to match working example
  joinChat(conversationId) {
    if (!this.socket) return;
    console.log('📨 Joining chat:', conversationId);
    // No need for join/leave in this implementation
  }

  leaveChat(conversationId) {
    if (!this.socket) return;
    console.log('📨 Leaving chat:', conversationId);
    // No need for join/leave in this implementation
  }

  sendMessage(messageData) {
    if (!this.socket) return;
    console.log('📨 Sending message via socket:', messageData);
    // In the working example, messages are sent via API, not socket
    // Socket is only for real-time updates
  }

  onNewMessage(callback) {
    if (!this.socket) return;
    this.socket.on('newMessage', callback); // Match working example event name
  }

  onMessageStatus(callback) {
    if (!this.socket) return;
    this.socket.on('message_status', callback);
  }

  onConversationUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('conversation_update', callback);
  }

  onTyping(callback) {
    if (!this.socket) return;
    this.socket.on('userTyping', callback); // Match working example event name
  }

  onStopTyping(callback) {
    if (!this.socket) return;
    this.socket.on('userTyping', callback); // Same event, different isTyping value
  }

  // Online users handling - from working example
  onOnlineUsers(callback) {
    if (!this.socket) return;
    this.socket.on('getOnlineUsers', callback);
  }

  onUserStatusChange(callback) {
    if (!this.socket) return;
    this.socket.on('userOnlineStatus', callback);
  }

  emitTyping(receiverId, isTyping = true) {
    if (!this.socket) return;
    console.log('⌨️ Emitting typing:', { receiverId, isTyping });
    this.socket.emit('typing', { receiverId, isTyping }); // Match working example format
  }

  emitStopTyping(receiverId) {
    if (!this.socket) return;
    console.log('⌨️ Emitting stop typing:', { receiverId });
    this.socket.emit('typing', { receiverId, isTyping: false }); // Same event, isTyping: false
  }

  // Remove listeners
  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners('newMessage');
    this.socket.removeAllListeners('userTyping');
    this.socket.removeAllListeners('getOnlineUsers');
    this.socket.removeAllListeners('userOnlineStatus');
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
