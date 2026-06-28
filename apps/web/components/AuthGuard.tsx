import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';

const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  useEffect(() => {
    if (isLoading) return;
    if (!user && !isPublic) {
      router.replace('/login');
    } else if (user && isPublic) {
      router.replace('/');
    }
  }, [user, isLoading, isPublic, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if ((!user && !isPublic) || (user && isPublic)) {
    return null;
  }

  return <>{children}</>;
}
