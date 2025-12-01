import { baseApi } from "./baseApi";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),
    getPublicProfile: builder.query({
      query: (id) => `/user/public/${id}`,
      providesTags: (result, error, id) => [{ type: "Profile", id }],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: "/user/update", method: "POST", body: data }),
      invalidatesTags: ["Profile"],
    }),
    uploadProfilePicture: builder.mutation({
      query: (formData) => ({
        url: "/upload/profile-picture",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    getMyOrders: builder.query({
      query: () => "/orders/my-orders",
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    getActiveJobs: builder.query({
      query: () => "/orders/active-jobs",
      providesTags: ["Orders"],
    }),
    getCompletedOrders: builder.query({
      query: () => "/orders/completed",
      providesTags: ["Orders"],
    }),
    getCancelledOrders: builder.query({
      query: () => "/orders/cancelled",
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({ url: "/orders/create", method: "POST", body: data }),
      invalidatesTags: ["Orders"],
    }),
    cancelOrder: builder.mutation({
      query: (data) => ({ url: "/orders/cancel", method: "PATCH", body: data }),
      invalidatesTags: ["Orders"],
    }),
    completeOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/complete",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    rateAndReviewOrder: builder.mutation({
      query: (data) => ({ url: "/orders/review", method: "POST", body: data }),
      invalidatesTags: ["Orders"],
    }),
    getGigs: builder.query({
      query: (params) => ({ url: "/gigs", params }),
      providesTags: ["Gigs"],
    }),
    searchGigs: builder.query({
      query: (params) => ({ url: "/gigs/search", params }),
      providesTags: ["Gigs"],
    }),
    findWorkers: builder.query({
      query: (params) => ({ url: "/workers/find", params }),
      providesTags: ["Workers"],
    }),
    getWallet: builder.query({
      query: () => "/wallet/balance",
      providesTags: ["Wallet"],
    }),
    getDepositProviders: builder.query({
      query: () => "/payment/providers",
      providesTags: ["Providers"],
    }),
    getWithdrawalProviders: builder.query({
      query: () => "/payout/providers",
      providesTags: ["Providers"],
    }),
    predictCorrespondentBank: builder.mutation({
      query: (data) => ({
        url: "/wallet/predict-correspondent",
        method: "POST",
        body: data,
      }),
    }),
    depositMoney: builder.mutation({
      query: (data) => ({ url: "/wallet/deposit", method: "POST", body: data }),
      invalidatesTags: ["Wallet"],
    }),
    checkTransactionStatus: builder.query({
      query: (transactionId) => `/wallet/status/${transactionId}`,
    }),
    topupWallet: builder.mutation({
      query: (data) => ({ url: "/wallet/topup", method: "POST", body: data }),
      invalidatesTags: ["Wallet"],
    }),
    validateChargeOtp: builder.mutation({
      query: (data) => ({
        url: "/wallet/validateCharge-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet"],
    }),
    withdrawWallet: builder.mutation({
      query: (data) => ({
        url: "/wallet/payout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet"],
    }),
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationsAsRead: builder.mutation({
      query: (data) => ({
        url: "/notifications/read",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),
    startConversation: builder.mutation({
      query: (data) => ({ url: "/conversations", method: "POST", body: data }),
      invalidatesTags: ["Conversations"],
    }),
    sendOrderMessage: builder.mutation({
      query: (data) => ({ url: "/orders/message", method: "POST", body: data }),
    }),
    markOrderMessagesRead: builder.mutation({
      query: (data) => ({ url: "/orders/read", method: "POST", body: data }),
    }),
    updateFcmToken: builder.mutation({
      query: (data) => ({ url: "/user/fcm-token", method: "POST", body: data }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyProfileQuery,
  useGetPublicProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetActiveJobsQuery,
  useGetCompletedOrdersQuery,
  useGetCancelledOrdersQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useRateAndReviewOrderMutation,
  useGetGigsQuery,
  useSearchGigsQuery,
  useFindWorkersQuery,
  useGetWalletQuery,
  useGetDepositProvidersQuery,
  useGetWithdrawalProvidersQuery,
  usePredictCorrespondentBankMutation,
  useDepositMoneyMutation,
  useCheckTransactionStatusQuery,
  useTopupWalletMutation,
  useValidateChargeOtpMutation,
  useWithdrawWalletMutation,
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  useStartConversationMutation,
  useSendOrderMessageMutation,
  useMarkOrderMessagesReadMutation,
  useUpdateFcmTokenMutation,
} = customerApi;
