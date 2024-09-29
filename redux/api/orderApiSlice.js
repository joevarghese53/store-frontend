import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: ['Order'],
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
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
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),
    getTotalProductsSold: builder.query({
      query: () => `${ORDERS_URL}/total-products-sold`,
    }),
    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
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
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliveredOrderMutation,
  useConfirmOrderMutation,
  useShippedOrderMutation,
  useOutForDeliveryOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
