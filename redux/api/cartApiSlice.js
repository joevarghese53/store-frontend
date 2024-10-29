// redux/api/cartApiSlice.js
import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `${CART_URL}`,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity, productType, size }) => ({
        url: `${CART_URL}`,
        method: 'POST',
        body: { productId, quantity, productType, size },
        credentials: 'include',
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity, size }) => ({
        url: `${CART_URL}`,
        method: 'PUT',
        body: { productId, quantity, size },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: ({ productId, size }) => ({
        url: `${CART_URL}/${productId}`,
        method: "DELETE",
        body: { productId, size },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeAllOfProductFromCart: builder.mutation({
      query: ({ productId }) => ({
        url: `${CART_URL}/all/${productId}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeAllOfProductFromAllofCart: builder.mutation({
      query: ({ productId }) => ({
        url: `${CART_URL}/allCart/${productId}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useRemoveAllOfProductFromCartMutation,
  useRemoveAllOfProductFromAllofCartMutation
} = cartApiSlice;
