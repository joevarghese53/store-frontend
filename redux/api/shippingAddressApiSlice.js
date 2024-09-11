// redux/api/shippingAdressApiSlice.js
import { apiSlice } from './apiSlice';
import { SHIPPING_ADDRESS_URL } from "../constants";

export const shippingAddressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserShippingAddresses: builder.query({
      query: () => ({
        url: SHIPPING_ADDRESS_URL,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['ShippingAddress'],
    }),
    createShippingAddress: builder.mutation({
      query: (newAddress) => ({
        url: SHIPPING_ADDRESS_URL,
        method: 'POST',
        body: newAddress,
        credentials: 'include',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    updateShippingAddress: builder.mutation({
      query: ({ id, updatedAddress }) => ({
        url: `${SHIPPING_ADDRESS_URL}/${id}`,
        method: 'PUT',
        body: updatedAddress,
        credentials: 'include',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `${SHIPPING_ADDRESS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
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
