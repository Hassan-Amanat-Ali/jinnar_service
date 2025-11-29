import { baseApi } from "./baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new support ticket
    createSupportTicket: builder.mutation({
      query: (data) => ({
        url: "/support/tickets", // This endpoint now handles both logged-in and guest users
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SupportTickets"],
    }),
    // Get my tickets
    getMyTickets: builder.query({
      query: () => "/support/tickets",
      providesTags: ["SupportTickets"],
    }),
    // Get ticket by ID
    getTicketById: builder.query({
      query: (id) => `/support/tickets/${id}`,
      providesTags: (result, error, id) => [{ type: "SupportTickets", id }],
    }),
    // Reply to a ticket
    replyToTicket: builder.mutation({
      query: ({ id, message, attachments }) => ({
        url: `/support/tickets/${id}/reply`,
        method: "POST",
        body: { message, attachments },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SupportTickets", id },
        "SupportTickets",
      ],
    }),
  }),
});

export const {
  useCreateSupportTicketMutation,
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
  useReplyToTicketMutation,
} = supportApi;
