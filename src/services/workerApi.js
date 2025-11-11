import { baseApi } from "./baseApi";

export const workerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["Profile"],
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
    }),
    uploadPortfolioImages: builder.mutation({
      query: (formData) => ({
        url: "/upload/portfolio",
        method: "POST",
        body: formData,
      }),
    }),
    uploadVideos: builder.mutation({
      query: (formData) => ({
        url: "/upload/videos",
        method: "POST",
        body: formData,
      }),
    }),
    uploadCertificates: builder.mutation({
      query: (formData) => ({
        url: "/upload/certificates",
        method: "POST",
        body: formData,
      }),
    }),
    getMyGigs: builder.query({
      query: () => "/gigs/my-gigs",
      providesTags: ["Gigs"],
    }),
    createGig: builder.mutation({
      query: (data) => ({ url: "/gigs/create", method: "POST", body: data }),
      invalidatesTags: ["Gigs"],
    }),
    updateGig: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/gigs/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Gigs"],
    }),
    deleteGig: builder.mutation({
      query: (id) => ({ url: `/gigs/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Gigs"],
    }),
    getAvailableJobs: builder.query({
      query: () => "/orders/available",
      providesTags: ["Jobs"],
    }),
    getNewJobRequests: builder.query({
      query: () => "/orders/new",
      providesTags: ["Jobs"],
    }),
    getActiveJobs: builder.query({
      query: () => "/orders/active-jobs",
      providesTags: ["Jobs"],
    }),
    getDeclinedJobs: builder.query({
      query: () => "/orders/declined",
      providesTags: ["Jobs"],
    }),
    acceptJob: builder.mutation({
      query: (data) => ({ url: "/orders/accept", method: "POST", body: data }),
      invalidatesTags: ["Jobs"],
    }),
    declineJob: builder.mutation({
      query: (data) => ({ url: "/orders/decline", method: "POST", body: data }),
      invalidatesTags: ["Jobs"],
    }),
    uploadDeliverable: builder.mutation({
      query: (data) => ({ url: "/orders/deliver", method: "POST", body: data }),
      invalidatesTags: ["Jobs"],
    }),
    getWallet: builder.query({
      query: () => "/wallet",
      providesTags: ["Wallet"],
    }),
    withdrawWallet: builder.mutation({
      query: (data) => ({
        url: "/wallet/withdraw",
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
    sendOrderMessage: builder.mutation({
      query: (data) => ({ url: "/orders/message", method: "POST", body: data }),
    }),
    markOrderMessagesRead: builder.mutation({
      query: (data) => ({ url: "/orders/read", method: "POST", body: data }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
  useUploadPortfolioImagesMutation,
  useUploadVideosMutation,
  useUploadCertificatesMutation,
  useGetMyGigsQuery,
  useCreateGigMutation,
  useUpdateGigMutation,
  useDeleteGigMutation,
  useGetAvailableJobsQuery,
  useGetNewJobRequestsQuery,
  useGetActiveJobsQuery,
  useGetDeclinedJobsQuery,
  useAcceptJobMutation,
  useDeclineJobMutation,
  useUploadDeliverableMutation,
  useGetWalletQuery,
  useWithdrawWalletMutation,
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  useSendOrderMessageMutation,
  useMarkOrderMessagesReadMutation,
} = workerApi;
