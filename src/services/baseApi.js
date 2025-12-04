import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base query with automatic token injection
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  //  baseUrl: "https://api.srv1144519.hstgr.cloud/api",
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

  // Handle 401 errors globally
  if (result.error && result.error.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
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
