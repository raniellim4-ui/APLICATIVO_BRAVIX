import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { authApi } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'driver' | 'mechanic';
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

function normalizeUser(raw: any): AuthUser {
  return {
    id: raw?.id ?? raw?.sub,
    email: raw?.email,
    name: raw?.name,
    role: raw?.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
        if (token) {
          const { data } = await authApi.getProfile();
          setUser(normalizeUser(data.user));
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(normalizeUser(data.user));
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { data } = await authApi.register(email, password, name);
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setUser(normalizeUser(data.user));
    },
    [],
  );

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
