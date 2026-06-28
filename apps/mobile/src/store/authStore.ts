import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'driver' | 'mechanic';
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isLoggedIn: false,

  login: async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      set({ user: response.user, isLoggedIn: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const response = await apiService.register(email, password, name);
      set({ user: response.user, isLoggedIn: true });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await apiService.logout();
    await AsyncStorage.removeItem('auth_token');
    set({ user: null, isLoggedIn: false });
  },

  restore: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        await apiService.setToken(token);
        const profile = await apiService.getProfile();
        const payload = profile.user ?? {};
        const user: User = {
          id: payload.id ?? payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        };
        set({ user, isLoggedIn: true });
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      await apiService.logout();
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },
}));
