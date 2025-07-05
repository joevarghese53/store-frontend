import { apiSlice } from "./apiSlice";
import { TRIES_URL } from "../constants";

export const triesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTries: builder.query({
      query: () => `${TRIES_URL}`,
      providesTags: ["Tries"],
    }),
    purchaseTries: builder.mutation({
      query: (data) => ({
        url: `${TRIES_URL}/purchase-tries`,
        method: 'POST',
        body: data,
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
