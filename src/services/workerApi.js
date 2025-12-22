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
    uploadGigImage: builder.mutation({
      query: ({ gigId, formData }) => ({
        url: `/upload/gig-image/${gigId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { gigId }) => [{ type: "Gigs", id: gigId }, "Gigs"],
    }),
    uploadOtherImages: builder.mutation({
      query: (formData) => ({
        url: "/upload/other-images",
        method: "POST",
        body: formData,
      }),
    }),
    getMyGigs: builder.query({
      query: () => "/gigs/my-gigs",
      providesTags: ["Gigs"],
    }),
    getAllGigs: builder.query({
      query: () => "/gigs",
      providesTags: ["Gigs"],
    }),
    getGigById: builder.query({
      query: (id) => `/gigs/${id}`,
      providesTags: (result, error, id) => [{ type: "Gigs", id }],
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
    deleteGigImage: builder.mutation({
      query: ({ gigId, imageUrl }) => ({
        url: `/gigs/delete-image/${gigId}`,
        method: "DELETE",
        body: { imageUrl },
      }),
      invalidatesTags: (result, error, { gigId }) => [{ type: "Gigs", id: gigId }, "Gigs"],
    }),
    deleteGig: builder.mutation({
      query: (id) => ({ url: `/gigs/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Gigs"],
    }),
    getAvailableJobs: builder.query({
      query: () => "/orders/available",
      providesTags: ["Jobs"],
    }),
    getMyOrders: builder.query({
      query: () => "/orders/my-orders",
      // Normalize various backend response shapes into a plain array of orders
      transformResponse: (response) => {
        // If backend returned the array directly
        if (Array.isArray(response)) return response;
        console.log("..........resposnsse in rtk",response);

        // Common server wrappers
        if (response?.orders && Array.isArray(response.orders)) return response.orders;
        if (response?.jobs && Array.isArray(response.jobs)) return response.jobs;
        if (response?.data && Array.isArray(response.data)) return response.data;

        // Sometimes the API returns { success: true, data: [...] }
        if (response?.success && Array.isArray(response.data)) return response.data;

        // Fallback: if response itself contains list-like fields, try to find first array
        const firstArray = Object.values(response || {}).find((v) => Array.isArray(v));
        if (firstArray) return firstArray;

        // If nothing found, return empty array to avoid null in UI
        return [];
      },
      providesTags: ["Orders"],
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
    getSellerStats: builder.query({
      query: () => "/orders/seller-stats",
      providesTags: ["Stats"],
    }),
    acceptJob: builder.mutation({
      query: (data) => ({
        url: "/orders/accept",
        method: "POST",
        body: { id: data.id },
      }),
      invalidatesTags: ["Jobs", "Orders"],
    }),
    declineJob: builder.mutation({
      query: (data) => ({
        url: "/orders/decline",
        method: "POST",
        body: { id: data.id },
      }),
      invalidatesTags: ["Jobs", "Orders"],
    }),
    uploadDeliverable: builder.mutation({
      query: (data) => ({ url: "/orders/deliver", method: "POST", body: data }),
      invalidatesTags: ["Jobs", "Orders"],
    }),
    getOrderById: builder.query({
      query: (id) => {

        return `/orders/${id}`;
      },
      transformResponse: (response) => {


        // Handle different response structures
        let order;
        if (response?.order) {
          order = response.order;
          console.log("📦 Extracted from response.order");
        } else if (response?.data) {
          order = response.data;
          console.log("📦 Extracted from response.data");
        } else {
          order = response;
          console.log("📦 Using direct response");
        }

        return order;
      },
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    completeOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/complete",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Jobs", "Orders"],
    }),
    cancelOrder: builder.mutation({
      query: (data) => ({ url: "/orders/cancel", method: "PATCH", body: data }),
      invalidatesTags: ["Jobs", "Orders"],
    }),
    reviewOrder: builder.mutation({
      query: (data) => ({ url: "/orders/review", method: "POST", body: data }),
      invalidatesTags: ["Jobs", "Orders"],
    }),
    getWallet: builder.query({
      query: () => "/wallet/balance",
      providesTags: ["Wallet"],
    }),
    depositMoney: builder.mutation({
      query: (data) => ({
        url: "/payment/deposit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet"],
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
    getPublicProfile: builder.query({
      query: (id) => `/user/public/${id}`,
      providesTags: (result, error, id) => [{ type: "PublicProfile", id }],
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
    findWorkers: builder.query({
      query: (params) => ({
        url: "/workers/find",
        params: params || {},
      }),
      providesTags: ["Workers"],
    }),
    searchGigs: builder.query({
      query: (params) => ({
        url: "/gigs/search",
        params: params || {},
      }),
      providesTags: ["Gigs"],
    }),
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getSubcategories: builder.query({
      query: (categoryId) => ({
        url: "/categories/subcategories",
        params: categoryId ? { categoryId } : {},
      }),
      providesTags: ["Subcategories"],
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
  useUploadGigImageMutation,
  useUploadOtherImagesMutation,
  useGetMyGigsQuery,
  useGetAllGigsQuery,
  useGetGigByIdQuery,
  useCreateGigMutation,
  useUpdateGigMutation,
  useDeleteGigImageMutation,
  useDeleteGigMutation,
  useGetAvailableJobsQuery,
  useGetMyOrdersQuery,
  useGetNewJobRequestsQuery,
  useGetActiveJobsQuery,
  useGetDeclinedJobsQuery,
  useGetSellerStatsQuery,
  useAcceptJobMutation,
  useDeclineJobMutation,
  useUploadDeliverableMutation,
  useGetOrderByIdQuery,
  useCompleteOrderMutation,
  useCancelOrderMutation,
  useReviewOrderMutation,
  useGetWalletQuery,
  useDepositMoneyMutation,
  useWithdrawWalletMutation,
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  useGetPublicProfileQuery,
  useSendOrderMessageMutation,
  useMarkOrderMessagesReadMutation,
  useUpdateFcmTokenMutation,
  useFindWorkersQuery,
  useSearchGigsQuery,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} = workerApi;
