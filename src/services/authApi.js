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
      query: (data) => ({ url: "/auth/login", method: "POST", body: data }),
    }),
    workerLogin: builder.mutation({
      query: (data) => ({ url: "/auth/login", method: "POST", body: data }),
    }),
    verifyCode: builder.mutation({
      query: (data) => ({ url: "/auth/verify", method: "POST", body: data }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    resendVerificationCode: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-code",
        method: "POST",
        body: data,
      }),
    }),
    switchRole: builder.mutation({
      query: (data) => ({
        url: "/auth/switch-role",
        method: "POST",
        body: data,
      }),
    }),
    initiateContactChange: builder.mutation({
      query: (data) => ({
        url: "/auth/change-contact/initiate",
        method: "POST",
        body: data,
      }),
    }),
    verifyContactChange: builder.mutation({
      query: (data) => ({
        url: "/auth/change-contact/verify",
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
  useVerifyCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendVerificationCodeMutation,
  useSwitchRoleMutation,
  useInitiateContactChangeMutation,
  useVerifyContactChangeMutation,
} = authApi;
