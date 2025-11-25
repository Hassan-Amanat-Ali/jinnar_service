import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Phone,
  Video,
  CheckCheck,
  Paperclip,
  Smile,
  Send,
  ArrowLeft,
  MoreVertical,
  Circle,
  Loader2,
} from "lucide-react";
import Hero from "../../components/common/Hero";
import Avatar from "../../components/common/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useSocket, useChat } from "../../hooks/useSocket";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} from "../../services/chatApi";

// Contact Item Component
const ContactItem = ({
  conversation,
  active = false,
  onClick,
  currentUserId,
}) => {
  const otherParticipant = conversation?.participants?.find(
    (p) => p._id !== currentUserId
  );

  const lastMessage = conversation?.lastMessage;
  const lastTime = conversation?.lastTime;
  const unreadCount = conversation?.unreadCount || 0;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 md:gap-3 py-3 md:py-4 p-2 md:p-3 text-left transition-colors hover:cursor-pointer",
        active
          ? "bg-[#EAF6FF] border-l-4 border-l-[#74C7F2]"
          : "hover:bg-gray-50",
      ].join(" ")}
      aria-current={active ? "true" : undefined}
    >
      <div className="relative">
        <Avatar
          src={otherParticipant?.profilePicture}
          name={otherParticipant?.name}
          size="md"
          className="h-8 w-8 md:h-10 md:w-10"
        />
        {/* Online indicator */}
        <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-xs md:text-sm font-semibold text-gray-900">
            {otherParticipant?.name || "Unknown User"}
          </p>
          <span className="shrink-0 text-[10px] md:text-xs text-gray-500">
            {formatTime(lastTime || lastMessage?.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="truncate text-[10px] md:text-xs text-gray-600">
            {typeof lastMessage === 'string' ? lastMessage : (lastMessage?.content || "No messages yet")}
          </p>
          {unreadCount > 0 && (
            <span className="shrink-0 rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

// Message Component
const MessageBubble = ({ message, currentUserId, otherParticipant }) => {
  // Check if the message is sent by current user
  // API returns sender._id in the sender object
  const messageSenderId = message.senderId || message.sender?._id;
  const isMe = messageSenderId === currentUserId;
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get message text - API uses 'message' field, not 'content'
  const messageText = message.message || message.content || '';
  
  console.log('📩 MessageBubble:', { 
    messageText, 
    isMe, 
    messageSenderId,
    currentUserId,
    comparison: `${messageSenderId} === ${currentUserId} = ${messageSenderId === currentUserId}`,
    sender: message.sender,
    receiver: message.receiver
  });

  return (
    <div className={`flex gap-2 md:gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && (
        <Avatar
          src={otherParticipant?.profilePicture || message.sender?.profilePicture}
          name={otherParticipant?.name || message.sender?.name}
          size="default"
          className="h-6 w-6 md:h-8 md:w-8"
        />
      )}
      <div className={`flex-1 max-w-xs md:max-w-md ${isMe ? 'flex justify-end' : ''}`}>
        <div
          className={`rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
            isMe
              ? 'bg-gradient-to-r from-[#B6E0FE] to-[#74C7F2] text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-xs md:text-sm break-words whitespace-pre-wrap">{messageText}</p>
        </div>
        <p className={`mt-1 text-[10px] md:text-xs text-gray-500 ${isMe ? 'text-right' : ''}`}>
          {formatTime(message.createdAt)}
          {isMe && message.isRead && (
            <CheckCheck className="inline ml-1 w-3 h-3 text-sky-500" />
          )}
        </p>
      </div>
    </div>
  );
};

// Main Chat Component
const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Get current user from AuthContext (not Redux!)
  const { user: currentUser } = useAuth();
  
  // Try multiple ways to get user ID (handle different API response structures)
  const currentUserId = currentUser?._id || 
                        currentUser?.id || 
                        currentUser?.userId;
  
  const { isConnected } = useSocket();
  
  // Debug: Log current user info and token
  console.log('👤 Current User Debug:', {
    currentUser,
    hasUser: !!currentUser,
    _id: currentUser?._id,
    id: currentUser?.id,
    userId: currentUser?.userId,
    currentUserId,
    allKeys: currentUser ? Object.keys(currentUser) : [],
    hasToken: !!localStorage.getItem('token'),
    tokenPreview: localStorage.getItem('token')?.substring(0, 20) + '...'
  });
  
  // Get conversation or user ID from URL params
  const conversationId = searchParams.get('conversation');
  const userId = searchParams.get('user');
  
  // Get other participant ID for API calls
  const otherParticipantId = userId || selectedConversation?.participants?.find(
    (p) => p._id !== currentUserId
  )?._id;
  
  console.log('🎯 Chat IDs Debug:', {
    userId,
    conversationId,
    otherParticipantId,
    currentUserId,
    selectedConversationId: selectedConversation?._id,
    hasSelectedConversation: !!selectedConversation
  });
  
  // API Hooks
  const { data: conversationsData, isLoading: conversationsLoading, refetch: refetchConversations } = useGetConversationsQuery();
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useGetMessagesQuery(
    { userId: otherParticipantId },
    { skip: !otherParticipantId }
  );

  console.log('📡 API Status:', {
    otherParticipantId,
    hasOtherParticipant: !!otherParticipantId,
    messagesLoading,
    conversationsLoading,
    messagesDataLength: messagesData?.length || 0,
    conversationsDataLength: conversationsData?.length || 0
  });

  // Safely handle API responses with useMemo to prevent re-renders
  const conversations = useMemo(() => {
    return Array.isArray(conversationsData) ? conversationsData : [];
  }, [conversationsData]);
  
  const messages = useMemo(() => {
    return Array.isArray(messagesData) ? messagesData : [];
  }, [messagesData]);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  
  // Socket chat hook  
  const socketConversationId = conversationId || `temp-${userId}`;
  const { messages: socketMessages, setMessages: _setMessages, typingUsers, sendMessage: sendSocketMessage, startTyping, stopTyping } = useChat(socketConversationId);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, socketMessages]);

  // Update participant info from messages when available
  useEffect(() => {
    if (messages.length > 0 && selectedConversation && userId) {
      const firstMessage = messages[0];
      // Get the other participant from message data
      const otherUser = firstMessage.sender?._id === currentUserId 
        ? firstMessage.receiver 
        : firstMessage.sender;
      
      console.log('👥 Updating conversation with user data:', {
        firstMessage: {
          senderId: firstMessage.sender?._id,
          receiverId: firstMessage.receiver?._id,
          currentUserId
        },
        otherUser,
        selectedConversationId: selectedConversation._id
      });
      
      if (otherUser && selectedConversation._id.startsWith('temp-')) {
        // Update temp conversation with real user data
        setSelectedConversation(prev => ({
          ...prev,
          participants: [
            { _id: currentUserId, name: currentUser?.name, role: currentUser?.role },
            { 
              _id: otherUser._id, 
              name: otherUser.name || 'User', 
              profilePicture: otherUser.profilePicture,
              role: otherUser.role || 'user' 
            }
          ]
        }));
      }
    } else if (userId && selectedConversation && selectedConversation._id.startsWith('temp-') && !messages.length) {
      // If we have a userId but no messages yet, keep the temporary conversation ready
      console.log('📝 Keeping temporary conversation ready for user:', userId);
    }
  }, [messages, selectedConversation, userId, currentUserId, currentUser]);

  // Set selected conversation from URL params
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c._id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    } else if (userId) {
      // Find conversation with the specified user
      const existingConversation = conversations.find(c => 
        c.participants?.some(p => p._id === userId)
      );
      if (existingConversation) {
        setSelectedConversation(existingConversation);
        // Update URL to use conversation ID instead of user ID for consistency
        setSearchParams({ conversation: existingConversation._id });
      } else {
        // Create a temporary conversation object for the UI when starting new chat
        console.log('🆕 Creating temporary conversation for user:', userId);
        setSelectedConversation({
          _id: `temp-${userId}`,
          participants: [
            { _id: currentUserId, name: currentUser?.name, role: currentUser?.role },
            { _id: userId, name: 'User', role: 'user' } // We'll get the real name from messages API
          ],
          lastMessage: null,
          unreadCount: 0
        });
      }
    }
  }, [conversationId, userId, conversations, currentUser, currentUserId, setSearchParams]);

  // Handle conversation selection
  const handleConversationSelect = useCallback((conversation) => {
    setSelectedConversation(conversation);
    setSearchParams({ conversation: conversation._id });
    
    // Mark as read
    if (conversation.unreadCount > 0) {
      markAsRead(conversation._id);
    }
  }, [setSearchParams, markAsRead]);

  // Handle send message
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !otherParticipantId || isSending) return;

    try {
      console.log('📤 Sending message to:', otherParticipantId, 'message:', messageText.trim());
      
      const messageData = {
        receiverId: otherParticipantId,
        message: messageText.trim(),
        messageType: 'text'
      };

      // Send via API (this will create conversation if it doesn't exist)
      const result = await sendMessage(messageData).unwrap();
      console.log('✅ Message sent successfully:', result);
      
      // Send via socket for real-time updates
      sendSocketMessage({
        ...messageData,
        conversationId: socketConversationId,
        sender: currentUser
      });

      setMessageText("");
      
      // Refresh messages and conversations to get updated data
      refetchMessages();
      refetchConversations();
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        stopTyping(otherParticipantId);
      }
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  }, [messageText, otherParticipantId, isSending, sendMessage, sendSocketMessage, currentUser, refetchMessages, refetchConversations, socketConversationId, stopTyping]);

  // Filter conversations by search term
  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants?.find((p) => p._id !== currentUserId);
    return otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get other participant for selected conversation
  const otherParticipant = selectedConversation?.participants?.find(
    (p) => p._id !== currentUserId
  );

  // Combine API messages with socket messages and sort by timestamp
  const allMessages = [...messages, ...socketMessages].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeA - timeB;
  });
  
  console.log('💬 All Messages:', { 
    count: allMessages.length, 
    apiMessages: messages.length,
    socketMessages: socketMessages.length,
    currentUserId,
    currentUser: { _id: currentUser?._id, id: currentUser?.id, name: currentUser?.name },
    otherParticipantId,
    otherParticipant,
    firstMessage: allMessages[0] ? {
      senderId: allMessages[0].senderId || allMessages[0].sender?._id,
      text: (allMessages[0].message || allMessages[0].content || '').substring(0, 50)
    } : null
  });

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Log for debugging
  console.log('🔥 Chat Component State:', { 
    conversations, 
    messages, 
    conversationsLoading, 
    messagesLoading,
    otherParticipantId,
    conversationId,
    userId,
    isConnected,
    currentUserId
  });

  return (
    <main className="h-screen bg-white flex flex-col">
      <Hero
        place="Chat"
        title="Messages"
        subtitle="Communicate with workers and customers"
        className="h-48 md:h-64 lg:h-72"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <aside className="w-full border-r border-gray-200 bg-gray-50 sm:w-80 flex flex-col">
          {/* Search */}
          <header className="border-b border-gray-200 p-3 md:p-4 bg-white">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="search"
                placeholder="Search conversations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-neutral-100 py-3 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            
            {/* Connection Status */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Circle className={`w-2 h-2 fill-current ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {!isConnected && (
                <span className="text-xs text-red-500">
                  (Check console for details)
                </span>
              )}
            </div>
          </header>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <ContactItem
                    key={conversation._id}
                    conversation={conversation}
                    active={selectedConversation?._id === conversation._id}
                    onClick={() => handleConversationSelect(conversation)}
                    currentUserId={currentUserId}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex flex-1 flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <header className="flex items-center justify-between border-b border-gray-100 p-3 md:p-4 bg-white">
                <div className="flex items-center gap-2 md:gap-3">
                  <button className="sm:hidden" onClick={() => setSelectedConversation(null)}>
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <Avatar
                    src={otherParticipant?.profilePicture}
                    name={otherParticipant?.name}
                    size="default"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                  <div>
                    <h2 className="text-xs md:text-sm font-semibold text-gray-900">
                      {otherParticipant?.name || "Unknown User"}
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {otherParticipant?.role || "User"} • {isConnected ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                    aria-label="Voice call"
                  >
                    <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  <button
                    className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                    aria-label="Video call"
                  >
                    <Video size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  <button
                    className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                    aria-label="More options"
                  >
                    <MoreVertical size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                {messagesLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : allMessages.length > 0 ? (
                  allMessages.map((message, index) => (
                    <MessageBubble
                      key={message._id || message.id || `message-${index}`}
                      message={message}
                      currentUserId={currentUserId}
                      otherParticipant={otherParticipant}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>Start a conversation!</p>
                  </div>
                )}
                
                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <div className="text-sm text-gray-500 italic">
                    {typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <footer className="border-t border-gray-100 p-2 md:p-3">
                <form onSubmit={handleSendMessage}>
                  <div className="flex items-center gap-1 md:gap-2 rounded-full border border-gray-200 bg-white px-2 md:px-3 py-1.5 md:py-2 shadow-sm">
                    <button
                      type="button"
                      className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                      aria-label="Attach file"
                    >
                      <Paperclip size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        // Emit typing status like in working example
                        if (otherParticipantId) {
                          startTyping(otherParticipantId);
                          // Clear previous timeout
                          if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                          }
                          // Set new timeout to stop typing
                          typingTimeoutRef.current = setTimeout(() => {
                            stopTyping(otherParticipantId);
                          }, 1000);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      disabled={isSending}
                      className="flex-1 bg-transparent text-xs md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none min-w-0"
                    />
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Emoji"
                    >
                      <Smile size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                    <button
                      type="submit"
                      disabled={!messageText.trim() || isSending}
                      className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full text-white shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(180deg, #B6E0FE 0%, #74C7F2 100%)",
                      }}
                      aria-label="Send"
                    >
                      {isSending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} className="md:w-[18px] md:h-[18px]" />
                      )}
                    </button>
                  </div>
                </form>
              </footer>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Chat;
