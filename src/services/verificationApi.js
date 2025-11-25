import { baseApi } from "./baseApi";

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadIdentityDocument: builder.mutation({
      query: ({ file, documentType }) => {
        const formData = new FormData();
        formData.append("identityDocument", file);
        formData.append("documentType", documentType);
        return {
          url: "/upload/identity-document",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),
    submitForVerification: builder.mutation({
      query: () => ({
        url: "/users/submit-verification",
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useUploadIdentityDocumentMutation,
  useSubmitForVerificationMutation,
} = verificationApi;
