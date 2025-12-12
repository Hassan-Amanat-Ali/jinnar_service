import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base query with automatic token injection
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.has("Content-Type") && !endpoint?.includes("upload")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// Base query with error handling
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors globally - but NOT for login/signup/verify endpoints
  if (result.error && result.error.status === 401) {
    const endpoint = typeof args === 'string' ? args : args.url;

    // Exclude auth endpoints from global 401 handling (they handle their own errors)
    const authEndpoints = ['/auth/login', '/auth/signup', '/auth/verify', '/auth/resend-verification'];
    const isAuthEndpoint = authEndpoints.some(authEndpoint => endpoint?.includes(authEndpoint));

    if (!isAuthEndpoint) {
      // Only redirect to login for protected endpoints (not auth endpoints)
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  return result;
};

// Create the base API service
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "Profile",
    "Orders",
    "Jobs",
    "Gigs",
    "Wallet",
    "Providers",
    "Notifications",
    "Conversation",
    "Message",
    "Chatbot",
    "FAQ",
    "SupportTickets",
  ],
  endpoints: () => ({}), // Endpoints will be injected in separate files
});
