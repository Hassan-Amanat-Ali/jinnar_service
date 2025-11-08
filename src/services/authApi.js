import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    customerSignup: builder.mutation({
      query: (data) => ({ url: "/auth/register", method: "POST", body: data }),
    }),
    workerSignup: builder.mutation({
      query: (data) => ({ url: "/auth/register", method: "POST", body: data }),
    }),
    customerLogin: builder.mutation({
      query: (data) => ({ url: "/auth/signin", method: "POST", body: data }),
    }),
    workerLogin: builder.mutation({
      query: (data) => ({ url: "/auth/signin", method: "POST", body: data }),
    }),
    verifySignup: builder.mutation({
      query: (data) => ({ url: "/auth/verify", method: "POST", body: data }),
    }),
    verifySignin: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-signin",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCustomerLoginMutation,
  useCustomerSignupMutation,
  useWorkerLoginMutation,
  useWorkerSignupMutation,
  useVerifySignupMutation,
  useVerifySigninMutation,
} = authApi;
