import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send a custom offer
    sendCustomOffer: builder.mutation({
      query: (offerData) => ({
        url: "/chat/custom-offer",
        method: "POST",
        body: offerData,
      }),
      invalidatesTags: (result, error, { messageId }) =>
        messageId ? [{ type: "CustomOffer", id: messageId }] : ["CustomOffer"],
    }),

    // Accept a custom offer
    acceptOffer: builder.mutation({
      query: ({ orderId, messageId }) => ({
        url: "/orders/accept-offer",
        method: "POST",
        body: { orderId, messageId },
      }),
      invalidatesTags: (result, error, { messageId }) => [
        { type: "CustomOffer", id: messageId },
      ],
    }),

    // Reject a custom offer
    rejectOffer: builder.mutation({
      query: ({ orderId, messageId }) => ({
        url: "/orders/reject-offer",
        method: "POST",
        body: { orderId, messageId },
      }),
      invalidatesTags: (result, error, { messageId }) => [
        { type: "CustomOffer", id: messageId },
      ],
    }),
  }),
});

export const {
  useSendCustomOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
} = orderApi;
