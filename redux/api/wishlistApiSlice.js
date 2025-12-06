// redux/api/wishlistApiSlice.js
import { apiSlice } from "./apiSlice";
import { WISHLIST_URL } from "../constants";

export const wishlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWishlist: builder.query({
            query: () => `${WISHLIST_URL}`,
            providesTags: ['Wishlist'],
        }),
        addToWishlist: builder.mutation({
            query: ({ productId }) => ({
                url: `${WISHLIST_URL}`,
                method: 'POST',
                body: { productId },
                credentials: 'include',
            }),
            invalidatesTags: ['Wishlist'],
        }),
        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `${WISHLIST_URL}/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Wishlist'],
        }),
        checkItemInWishlist: builder.query({
            query: (productId) => ({
                url: `${WISHLIST_URL}/${productId}`,
            }),
            providesTags: ['Wishlist'],
        }),
        removeFromAllWishList: builder.mutation({
            query: (productId) => ({
                url: `${WISHLIST_URL}/all/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Wishlist'],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useCheckItemInWishlistQuery,
    useRemoveFromAllWishListMutation
} = wishlistApiSlice;
