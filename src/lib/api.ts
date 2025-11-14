import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // The address of the FastAPI backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRoot = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching root endpoint:', error);
    throw error;
  }
};
