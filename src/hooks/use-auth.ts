'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/use-auth-store';
import { apiClient } from '@/services/api-client';
import { clearAuthCookie } from '@/lib/cookie';
import { isAxiosError } from 'axios';

function mapBetterAuthUser(betterUser: Record<string, unknown>) {
  return {
    id: String(betterUser.id),
    name: String(betterUser.name ?? ''),
    email: String(betterUser.email ?? ''),
    phone: String(betterUser.phone ?? ''),
    role: (betterUser.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN') || 'CUSTOMER',
    createdAt: String(betterUser.createdAt ?? new Date().toISOString()),
  };
}

export function useAuth(redirectTo?: string | null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, clearAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await authService.login(payload);
      return data;
    },
    onSuccess: (data) => {
      const mappedUser = mapBetterAuthUser(data.user as Record<string, unknown>);
      setUser(mappedUser);
      toast.success(`Selamat datang kembali, ${mappedUser.name}!`);
      
      if (redirectTo && !redirectTo.startsWith('/login') && !redirectTo.startsWith('/register')) {
        router.push(redirectTo);
      } else if (mappedUser.role === 'SUPER_ADMIN') {
        router.push('/super-admin/dashboard');
      } else if (mappedUser.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/venues');
      }
      
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Email atau password salah.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const data = await authService.register(payload);
      return data;
    },
    onSuccess: (data) => {
      const mappedUser = mapBetterAuthUser(data.user as Record<string, unknown>);
      setUser(mappedUser);
      toast.success('Pendaftaran berhasil! Selamat datang.');
      router.push('/venues');
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout API error', error);
      }
    },
    onSuccess: () => {
      clearAuth();
      clearAuthCookie();
      queryClient.clear();
      toast.success('Berhasil keluar.');
      router.push('/login');
    },
    onError: () => {
      clearAuth();
      clearAuthCookie();
      queryClient.clear();
      router.push('/login');
    },
  });

  const checkSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.get('/me');
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone ?? '',
          role: data.role,
          createdAt: data.createdAt,
        });
      }
    },
    onError: (error: Error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearAuth();
        clearAuthCookie();
      }
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    checkSession: checkSessionMutation.mutate,
    isCheckingSession: checkSessionMutation.isPending,
  };
}
