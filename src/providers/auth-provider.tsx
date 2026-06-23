'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/use-auth-store';
import { useAuth } from '@/hooks/use-auth';

const PUBLIC_PATHS = ['/', '/login', '/register', '/venues'];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, user, _hydrated } = useAuthStore();
  const { checkSession, isCheckingSession } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isCheckingSession || !_hydrated) return;

    const isPublicPath = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith('/venues/'),
    );

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
      if (pathname.startsWith('/admin') && user.role === 'CUSTOMER') {
        router.push('/venues');
        return;
      }
      if (pathname.startsWith('/super-admin') && user.role !== 'SUPER_ADMIN') {
        router.push('/venues');
        return;
      }
    }
  }, [isAuthenticated, user, pathname, router, isCheckingSession, _hydrated]);

  return <>{children}</>;
}
