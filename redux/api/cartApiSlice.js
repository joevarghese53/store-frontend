// redux/api/cartApiSlice.js
import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `${CART_URL}`,
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}`,
        method: 'POST',
        body: { productId, quantity },
      }),
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `${CART_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApiSlice;
