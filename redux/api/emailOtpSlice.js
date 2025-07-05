import { apiSlice } from "./apiSlice";
import { EMAIL_OTP_URL } from "../constants";

export const emailOtpSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendEmailOtp: builder.mutation({
            query: (userData) => ({
                url: `${EMAIL_OTP_URL}/send`,
                method: 'POST',
                body: userData,
            }),
        }),
        verifyEmailOtp: builder.mutation({
            query: ({email, otp}) => ({
                url: `${EMAIL_OTP_URL}/verify`,
                method: 'POST',
                body: { email, otp },
            }),
        }),
    }),
});

export const {
    useSendEmailOtpMutation,
    useVerifyEmailOtpMutation,
} = emailOtpSlice;