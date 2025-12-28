//usersApiSlice.js
import { apiSlice } from "./apiSlice";
import { PAYMENT_URL } from "../constants";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkPaymentStatus: builder.mutation({
      query: (merchantOrderId) => ({
        url: `${PAYMENT_URL}/status?id=${merchantOrderId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCheckPaymentStatusMutation,
} = paymentApiSlice;
