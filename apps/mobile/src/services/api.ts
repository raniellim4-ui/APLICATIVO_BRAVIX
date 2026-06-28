import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.api.interceptors.request.use(async (config) => {
      const token = await this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.logout();
        }
        return Promise.reject(error);
      },
    );
  }

  private async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async logout(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    await this.setToken(response.data.access_token);
    return response.data;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.api.post('/auth/register', {
      email,
      password,
      name,
    });
    await this.setToken(response.data.access_token);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Vehicle endpoints
  async getVehicles() {
    const response = await this.api.get('/vehicles');
    return response.data;
  }

  async getVehicle(id: string) {
    const response = await this.api.get(`/vehicles/${id}`);
    return response.data;
  }

  async getMaintenanceAlerts(vehicleId: string) {
    const response = await this.api.get(`/maintenance/vehicle/${vehicleId}/alerts`);
    return response.data;
  }

  // Inspection endpoints
  async getInspections() {
    const response = await this.api.get('/inspections');
    return response.data;
  }

  async createInspection(data: any) {
    const response = await this.api.post('/inspections', data);
    return response.data;
  }

  async addInspectionPhotos(inspectionId: string, photoUrls: string[]) {
    const response = await this.api.post(`/inspections/${inspectionId}/photos`, {
      photoUrls,
    });
    return response.data;
  }

  async submitInspection(inspectionId: string) {
    const response = await this.api.post(`/inspections/${inspectionId}/submit`);
    return response.data;
  }

  async addInspectionSignature(inspectionId: string, signature: string) {
    const response = await this.api.post(`/inspections/${inspectionId}/signature`, {
      signature,
    });
    return response.data;
  }

  // Faz upload de uma foto local (uri do device) e retorna a URL no servidor
  async uploadPhoto(uri: string): Promise<string> {
    const name = uri.split('/').pop() || `photo-${Date.now()}.jpg`;
    const extMatch = /\.(\w+)$/.exec(name);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
    const type = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const form = new FormData();
    form.append('file', { uri, name, type } as any);
    const response = await this.api.post('/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return response.data.url as string;
  }

  // Dashboard endpoints
  async getDriverDashboard() {
    const response = await this.api.get('/drivers/:id/dashboard');
    return response.data;
  }
}

export const apiService = new ApiService();
