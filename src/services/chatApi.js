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
        const chats = Array.isArray(response) ? response : response?.chats || response?.data || [];
        return chats.map(chat => {
          const conversation = {
            _id: chat.user?._id || chat._id,
            participants: [],
            lastMessage: chat.lastMessage || null,
            lastTime: chat.lastTime,
            unreadCount: chat.unreadCount || 0,
            lastAttachment: chat.lastAttachment || null,
          };

          if (chat.user) {
            conversation.participants.push({
              _id: chat.user._id,
              name: chat.user.name || 'Unknown User',
              profilePicture: chat.user.profilePicture || null,
              role: chat.user.role || 'user',
            });
          }

          return conversation;
        });
      },
    }),

    // Get messages for a conversation
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
        const messages = Array.isArray(response) ? response : response?.messages || response?.data || [];
        return messages.map(msg => ({
          _id: msg._id,
          senderId: msg.sender?._id || msg.senderId,
          receiverId: msg.receiver?._id || msg.receiverId,
          sender: msg.sender,
          receiver: msg.receiver,
          content: msg.message || msg.content,
          message: msg.message || msg.content,
          isRead: msg.isRead,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
          attachment: msg.attachment || null,
        }));
      },
    }),

    // Send a message
    sendMessage: builder.mutation({
      query: ({ receiverId, message, messageType = 'text' }) => ({
        url: '/chat/send',
        method: 'POST',
        body: { receiverId, message, messageType },
      }),
      invalidatesTags: (result, error, { receiverId }) => [
        { type: 'Message', id: receiverId },
        'Conversation',
      ],
    }),

    // Mark messages as read
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

    // Upload media/files for chat
    uploadChatMedia: builder.mutation({
      query: (formData) => ({
        url: '/chat/send',
        method: 'POST',
        body: formData, // FormData handled automatically
      }),
      invalidatesTags: ['Conversation'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useUploadChatMediaMutation,
} = chatApi;
