import { apiSlice } from "./apiSlice";
import { GENERATE_IMAGE_URL } from "../constants";

export const generateImageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateImage: builder.mutation({
            query: (payload) => ({
                url: GENERATE_IMAGE_URL,
                method: "POST",
                body: payload,
            }),
        }),
        checkImageGenerationStatus: builder.query({
            query: (jobId) => ({
                url: `${GENERATE_IMAGE_URL}/status/${jobId}`,
                method: "GET",
            }),
        })
    }),
}); 

export const { useGenerateImageMutation, useCheckImageGenerationStatusQuery } = generateImageApiSlice;