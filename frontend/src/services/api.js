import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response handler
const handleResponse = (response) => {
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'API request failed');
};

// API error handler
const handleError = (error) => {
  console.error('API Error:', error);
  throw error.response?.data || error.message || 'Network error';
};

// API service functions
export const apiService = {
  // Get profile data
  async getProfile() {
    try {
      const response = await apiClient.get('/profile');
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get skills data
  async getSkills() {
    try {
      const response = await apiClient.get('/skills');
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get certifications data
  async getCertifications() {
    try {
      const response = await apiClient.get('/certifications');
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get experience data
  async getExperience() {
    try {
      const response = await apiClient.get('/experience');
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get projects data
  async getProjects() {
    try {
      const response = await apiClient.get('/projects');
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get education data
  async getEducation() {
    try {
      const response = await apiClient.get('/education');
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Submit contact form
  async submitContactForm(formData) {
    try {
      const response = await apiClient.post('/contact', formData);
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get contact messages (admin functionality)
  async getContactMessages() {
    try {
      const response = await apiClient.get('/contact/messages');
      return handleResponse(response);
    } catch (error) {
      throw handleError(error);
    }
  }
};

export default apiService;