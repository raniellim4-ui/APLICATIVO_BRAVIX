import { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';

export const useAuth = () => {
  const { user, isLoading, isLoggedIn, login, register, logout, restore } =
    useAuthStore();

  useEffect(() => {
    restore();
  }, []);

  return {
    user,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout,
  };
};
