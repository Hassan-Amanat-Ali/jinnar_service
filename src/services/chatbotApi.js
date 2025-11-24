import { baseApi } from "./baseApi";

export const chatbotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send a message to the chatbot
    sendChatbotMessage: builder.mutation({
      query: (query) => ({
        url: "/chatbot/chat",
        method: "POST",
        body: { query },
      }),
      transformResponse: (response) => {
        // Backend returns: { success: true, response: { type, message, options, ...data } }
        return response;
      },
    }),

    // Create a guest support ticket
    createGuestTicket: builder.mutation({
      query: ({ email, message, name, phone }) => ({
        url: "/chatbot/chat/ticket",
        method: "POST",
        body: { email, message, name, phone },
      }),
    }),

    // Debug bot health (optional, for development)
    debugBot: builder.query({
      query: () => ({
        url: "/chatbot/debug",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSendChatbotMessageMutation,
  useCreateGuestTicketMutation,
  useDebugBotQuery,
} = chatbotApi;
