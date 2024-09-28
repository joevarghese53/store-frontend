// redux/api/cartApiSlice.js
import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `${CART_URL}`,
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity, productType, size }) => ({
        url: `${CART_URL}`,
        method: 'POST',
        body: { productId, quantity, productType, size },
        credentials: 'include',
      }),
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity, size }) => ({
        url: `${CART_URL}/${productId}`,
        method: 'PUT',
        body: { productId, quantity, size },
      }),
    }),
    removeFromCart: builder.mutation({
      query: ({ productId, size }) => ({
        url: `${CART_URL}/${productId}`,
        method: "DELETE",
        body: { productId, size },
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
