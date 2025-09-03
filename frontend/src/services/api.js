import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Incident API endpoints
export const incidentAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/incidents/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/incidents/${id}`),
  create: (data) => api.post('/incidents/', data),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`),
};

// Training API endpoints
export const trainingAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/training/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/training/${id}`),
  create: (data) => api.post('/training/', data),
  update: (id, data) => api.put(`/training/${id}`, data),
  delete: (id) => api.delete(`/training/${id}`),
};

// Inspection API endpoints
export const inspectionAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/inspections/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/inspections/${id}`),
  create: (data) => api.post('/inspections/', data),
  update: (id, data) => api.put(`/inspections/${id}`, data),
  delete: (id) => api.delete(`/inspections/${id}`),
};

// PPE Compliance API endpoints
export const ppeComplianceAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/ppe-compliance/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/ppe-compliance/${id}`),
  create: (data) => api.post('/ppe-compliance/', data),
  update: (id, data) => api.put(`/ppe-compliance/${id}`, data),
  delete: (id) => api.delete(`/ppe-compliance/${id}`),
};

// Location API endpoints
export const locationAPI = {
  getAll: () => api.get('/locations/'),
  getById: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post('/locations/', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

// Employee API endpoints
export const employeeAPI = {
  getAll: () => api.get('/employees/'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees/', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export default api;
