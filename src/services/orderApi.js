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
      invalidatesTags: ["CustomOffer"],
    }),
    
    // Accept a custom offer
    acceptOffer: builder.mutation({
      query: ({ orderId }) => ({
        url: "/orders/accept-offer",
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: ["CustomOffer", "Order"],
    }),
    
    // Reject a custom offer
    rejectOffer: builder.mutation({
      query: ({ orderId }) => ({
        url: "/orders/reject-offer",
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: ["CustomOffer"],
    }),
    

  }),
});

export const {
  useSendCustomOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
} = orderApi;