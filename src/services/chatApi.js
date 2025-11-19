import { baseApi } from './baseApi';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all conversations for a user (Chat List)
    getConversations: builder.query({
      query: () => ({
        url: '/chat/list',
        method: 'GET',
      }),
      providesTags: ['Conversation'],
      transformResponse: (response) => {
        console.log('🔥 Chat list response:', response);
        const chats = Array.isArray(response) ? response : response?.chats || response?.data || [];
        
        // Transform the chats to ensure proper structure for the UI
        // API returns: { _id, lastMessage, lastAttachment, lastTime, unreadCount, user: { _id, name, profilePicture } }
        return chats.map(chat => {
          console.log('🔥 Processing chat item:', chat);
          
          const conversation = {
            _id: chat.user?._id || chat._id, // Use the user's ID as conversation ID
            participants: [],
            lastMessage: chat.lastMessage || null,
            lastTime: chat.lastTime,
            unreadCount: chat.unreadCount || 0,
            lastAttachment: chat.lastAttachment
          };
          
          // Add the other user as a participant
          if (chat.user) {
            conversation.participants.push({
              _id: chat.user._id,
              name: chat.user.name || 'Unknown User',
              profilePicture: chat.user.profilePicture || null,
              role: chat.user.role || 'user'
            });
          }
          
          console.log('🔥 Final conversation:', conversation);
          return conversation;
        });
      },
    }),

    // Get conversation with specific user
    getConversation: builder.query({
      query: (userId) => ({
        url: `/chat/with/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [
        { type: 'Conversation', id: userId },
      ],
    }),

    // Get messages for a conversation (using userId)
    getMessages: builder.query({
      query: ({ userId, page = 1, limit = 50 }) => ({
        url: `/chat/with/${userId}`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result, error, { userId }) => [
        { type: 'Message', id: userId },
      ],
      transformResponse: (response) => {
        console.log('🔥 Messages response:', response);
        const messages = Array.isArray(response) ? response : response?.messages || response?.data || [];
        
        // Transform messages to ensure consistent structure
        // API returns: { _id, sender: {_id, name, profilePicture}, receiver: {_id, name, profilePicture}, message, isRead, createdAt, attachment }
        return messages.map(msg => {
          console.log('🔥 Processing message:', msg);
          return {
            _id: msg._id,
            senderId: msg.sender?._id || msg.senderId,
            receiverId: msg.receiver?._id || msg.receiverId,
            sender: msg.sender,
            receiver: msg.receiver,
            content: msg.message || msg.content, // API uses 'message' field
            message: msg.message || msg.content,
            isRead: msg.isRead,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            attachment: msg.attachment
          };
        });
      },
    }),

    // Send a message
    sendMessage: builder.mutation({
      query: ({ receiverId, message, messageType = 'text' }) => ({
        url: '/chat/send',
        method: 'POST',
        body: { 
          receiverId, 
          message, 
          messageType 
        },
      }),
      invalidatesTags: (result, error, { receiverId }) => [
        { type: 'Message', id: receiverId },
        'Conversation',
      ],
    }),

    // Create or get conversation between two users
    createConversation: builder.mutation({
      query: ({ participantId }) => ({
        url: `/chat/with/${participantId}`,
        method: 'GET', // This will get or create conversation if it doesn't exist
      }),
      invalidatesTags: ['Conversation'],
    }),

    // Mark messages as read (if available)
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/${conversationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'Conversation', id: conversationId },
        'Conversation',
      ],
    }),

    // Delete a conversation (if available)
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversation'],
    }),

    // Upload media/files for chat
    uploadChatMedia: builder.mutation({
      query: (formData) => ({
        url: '/upload/chat',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
  useMarkAsReadMutation,
  useDeleteConversationMutation,
  useUploadChatMediaMutation,
} = chatApi;
