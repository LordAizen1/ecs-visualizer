import axios from "axios";

// 1. Create the apiClient with the correct backend URL
const apiClient = axios.create({
  baseURL: "", // Proxy through Next.js
});

// 2. Your getRoot function now uses the configured client
export const getRoot = async () => {
  try {
    // This will now call "/api/v1/graph" (proxied to backend)
    const response = await apiClient.get("/api/v1/graph");
    return response.data;
  } catch (error) {
    console.error("Error fetching root endpoint:", error);
    throw error;
  }
};