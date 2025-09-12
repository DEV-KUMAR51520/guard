import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an API service with common methods
const apiService = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      const response = await axios.post('/auth/login', credentials);
      return response.data;
    },
    register: async (userData) => {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    },
    verify: async () => {
      const response = await axios.get('/auth/verify');
      return response.data;
    },
    profile: async () => {
      const response = await axios.get('/auth/profile');
      return response.data;
    },
    panic: async (location) => {
      const response = await axios.post('/auth/panic', location);
      return response.data;
    }
  }
};

export default apiService;