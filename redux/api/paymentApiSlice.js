//usersApiSlice.js
import { apiSlice } from "./apiSlice";
import { PAYMENT_URL } from "../constants";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/initiate-payment`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useInitiatePaymentMutation
} = paymentApiSlice;
