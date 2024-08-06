// redux/api/shippingAdressApiSlice.js
import { apiSlice } from './apiSlice';
import { SHIPPING_ADDRESS_URL } from "../constants";

export const shippingAddressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserShippingAddresses: builder.query({
      query: () => ({
        url: SHIPPING_ADDRESS_URL,
        method: 'GET',
      }),
      providesTags: ['ShippingAddress'],
    }),
    createShippingAddress: builder.mutation({
      query: (newAddress) => ({
        url: SHIPPING_ADDRESS_URL,
        method: 'POST',
        body: newAddress,
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    updateShippingAddress: builder.mutation({
      query: ({ id, updatedAddress }) => ({
        url: `${SHIPPING_ADDRESS_URL}/${id}`,
        method: 'PUT',
        body: updatedAddress,
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `${SHIPPING_ADDRESS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
  }),
});

export const {
  useGetUserShippingAddressesQuery,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
} = shippingAddressApiSlice;
