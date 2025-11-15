import axios from "axios";

// 1. Create the apiClient with the correct backend URL
const apiClient = axios.create({
  baseURL: "http://localhost:8000", // <-- This tells the frontend where the backend is
});

// 2. Your getRoot function now uses the configured client
export const getRoot = async () => {
  try {
    // This will now call "http://localhost:8000/api/v1/graph"
    const response = await apiClient.get("/api/v1/graph");
    return response.data;
  } catch (error) {
    console.error("Error fetching root endpoint:", error);
    throw error;
  }
};