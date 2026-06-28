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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--amber)] border-t-transparent" />
          <span className="label-eyebrow">Carregando</span>
        </div>
      </div>
    );
  }

  if ((!user && !isPublic) || (user && isPublic)) {
    return null;
  }

  return <>{children}</>;
}
