import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await apiClient.post('/auth/reset-password', resetData);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  create: async (categoryData) => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  update: async (categoryId, categoryData) => {
    const response = await apiClient.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  delete: async (categoryId) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.completed !== undefined) params.append('completed', filters.completed);
    if (filters.overdue) params.append('overdue', filters.overdue);
    if (filters.search) params.append('search', filters.search);

    const response = await apiClient.get(`/tasks?${params}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await apiClient.post('/tasks', {
      ...taskData,
      due_date: taskData.dueDate, // Convert frontend field name to backend
    });
    return {
      ...response.data,
      dueDate: response.data.due_date, // Convert back for frontend
      categoryId: response.data.category_id,
      createdAt: response.data.created_at,
    };
  },

  update: async (taskId, taskData) => {
    const backendData = {
      ...taskData,
    };
    
    // Convert frontend field names to backend
    if (taskData.dueDate) {
      backendData.due_date = taskData.dueDate;
      delete backendData.dueDate;
    }
    if (taskData.categoryId) {
      backendData.category_id = taskData.categoryId;
      delete backendData.categoryId;
    }

    const response = await apiClient.put(`/tasks/${taskId}`, backendData);
    return {
      ...response.data,
      dueDate: response.data.due_date, // Convert back for frontend
      categoryId: response.data.category_id,
      createdAt: response.data.created_at,
    };
  },

  toggleComplete: async (taskId) => {
    const response = await apiClient.patch(`/tasks/${taskId}/toggle`);
    return {
      ...response.data,
      dueDate: response.data.due_date, // Convert back for frontend
      categoryId: response.data.category_id,
      createdAt: response.data.created_at,
    };
  },

  delete: async (taskId) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

// Utility functions
export const tokenUtils = {
  setToken: (token) => {
    localStorage.setItem('taskflow_token', token);
  },

  getToken: () => {
    return localStorage.getItem('taskflow_token');
  },

  removeToken: () => {
    localStorage.removeItem('taskflow_token');
  },

  setUser: (user) => {
    localStorage.setItem('taskflow_user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('taskflow_user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('taskflow_user');
  },

  clearAll: () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  },
};

export default apiClient;