import { baseApi } from "./baseApi";

export const recommendationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get recommended workers based on job request
    getRecommendedWorkers: builder.mutation({
      query: (jobRequest) => ({
        url: "/r",
        method: "POST",
        body: jobRequest,
      }),
    }),
  }),
});

export const { useGetRecommendedWorkersMutation } = recommendationApi;
