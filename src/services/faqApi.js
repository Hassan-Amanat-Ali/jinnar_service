import { baseApi } from "./baseApi";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all FAQs for help section
    getHelpFaqs: builder.query({
      query: () => ({
        url: "/faq/help",
        method: "GET",
      }),
      transformResponse: (response) => {
        // Group FAQs by category
        const groupedFaqs = {};

        response.forEach((faq) => {
          const category = faq.category || "General";

          if (!groupedFaqs[category]) {
            groupedFaqs[category] = {
              id: category.toLowerCase().replace(/\s+/g, "-"),
              title: category,
              items: [],
            };
          }

          groupedFaqs[category].items.push({
            question: faq.question,
            answer: faq.answer,
            priority: faq.priority || 0,
          });
        });

        // Convert to array and sort by priority
        const categoriesArray = Object.values(groupedFaqs).map((category) => ({
          ...category,
          items: category.items.sort((a, b) => b.priority - a.priority),
        }));

        return categoriesArray;
      },
      providesTags: ["FAQ"],
    }),
  }),
});

export const { useGetHelpFaqsQuery } = faqApi;
