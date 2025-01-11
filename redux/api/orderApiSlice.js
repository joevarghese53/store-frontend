import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: ['Order'],
    }),
    
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'],
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: ['Order'],
    }),

    deliveredOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/delivered`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    confirmOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    shippedOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/shipped`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    outForDeliveryOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/out-for-delivery`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    getTotalOrdersByDate: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
      providesTags: ['Order'],
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
      providesTags: ['Order'],
    }),
    getTotalProductsSold: builder.query({
      query: () => `${ORDERS_URL}/total-products-sold`,
      providesTags: ['Order'],
    }),
    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetTotalOrdersByDateQuery,
  useGetTotalSalesQuery,
  useGetTotalProductsSoldQuery,
  useGetTotalSalesByDateQuery,
  // ------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetMyOrdersQuery,
  useDeliveredOrderMutation,
  useConfirmOrderMutation,
  useShippedOrderMutation,
  useOutForDeliveryOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
