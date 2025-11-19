// redux/api/apiSlice.js
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, USERS_URL } from "../constants.js";
import { logout, setAccessToken } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // Send refreshToken cookie
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If access token expired (unauthorized)
  if (result?.error?.status === 401) {
    // Attempt refresh token
    const refreshResult = await baseQuery(
      {
        url: `${USERS_URL}/refresh-token`,
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.accessToken) {
      // Store new access token in Redux
      api.dispatch(setAccessToken(refreshResult.data.accessToken));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — logout user
      await baseQuery({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }, api, extraOptions);
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Products", "Order", "User", "Category", "Cart", "Wishlist", "CProduct", "Tries"
  ],
  endpoints: () => ({}),
});
