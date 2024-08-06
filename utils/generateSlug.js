// utils/generateSlug.js

// This function generates a simple slug based on the current timestamp
export const generateSlug = () => {
    const timestamp = new Date().getTime();
    return `product-${timestamp}`;
  };