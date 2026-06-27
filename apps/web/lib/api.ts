import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// Vehicles API
export const vehiclesApi = {
  getAll: () => api.get('/vehicles'),
  getOne: (id: string) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles', data),
  update: (id: string, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
};

// Drivers API
export const driversApi = {
  getAll: () => api.get('/drivers'),
  getOne: (id: string) => api.get(`/drivers/${id}`),
  getDashboard: (id: string) => api.get(`/drivers/${id}/dashboard`),
  create: (data: any) => api.post('/drivers', data),
  update: (id: string, data: any) => api.put(`/drivers/${id}`, data),
  delete: (id: string) => api.delete(`/drivers/${id}`),
};

// Inspections API
export const inspectionsApi = {
  getAll: () => api.get('/inspections'),
  getOne: (id: string) => api.get(`/inspections/${id}`),
  create: (data: any) => api.post('/inspections', data),
  addPhotos: (id: string, photos: any) =>
    api.post(`/inspections/${id}/photos`, photos),
  submit: (id: string) => api.post(`/inspections/${id}/submit`),
};

// Analytics API
export const analyticsApi = {
  getFleet: () => api.get('/analytics/fleet'),
  getDriver: (id: string) => api.get(`/analytics/driver/${id}`),
  getVehicle: (id: string) => api.get(`/analytics/vehicle/${id}`),
};
