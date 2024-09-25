import { apiSlice } from "./apiSlice";
import { CPRODUCT_URL } from "../constants";

export const cProductApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({  
        getCProducts: builder.query({
            query: () => `${CPRODUCT_URL}`,
            providesTags: ["CProduct"],
        }),
        createCProduct: builder.mutation({
            query: (productData) => ({
                url: `${CPRODUCT_URL}`,
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["CProduct"],
        }),
        deleteCProduct: builder.mutation({
            query: (productId) => ({
                url: `${CPRODUCT_URL}/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CProduct"],
        }),
        getCProductDetails: builder.query({
            query: (productId) => `${CPRODUCT_URL}/${productId}`,
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetCProductsQuery,
    useCreateCProductMutation,
    useDeleteCProductMutation,
    useGetCProductDetailsQuery,
} = cProductApiSlice;