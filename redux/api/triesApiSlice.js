import { apiSlice } from "./apiSlice";
import { TRIES_URL } from "../constants";

export const triesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTries: builder.query({
      query: () => `${TRIES_URL}`,
      providesTags: ["Tries"],
    }),
    purchaseTries: builder.mutation({
      query: ({ quantity }) => ({
        url: `${TRIES_URL}/purchase`,
        method: 'POST',
        body: { quantity },
        credentials: 'include',
      }),
      invalidatesTags: ["Tries"],
    }),
    useTries: builder.mutation({
      query: () => ({
        url: `${TRIES_URL}/use`,
        method: 'PUT',
      }),
      invalidatesTags: ["Tries"],
    }),
  }),
});

export const {
    useGetTriesQuery,
    usePurchaseTriesMutation,
    useUseTriesMutation,
} = triesApiSlice;
