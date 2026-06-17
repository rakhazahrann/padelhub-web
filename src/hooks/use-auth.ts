'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/use-auth-store';

export function useAuth(redirectTo?: string | null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await authService.login(payload);
      if (!response.success) {
        throw new Error(response.message || 'Gagal masuk');
      }
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(`Selamat datang kembali, ${data.user.name}!`);
      
      if (redirectTo && !redirectTo.startsWith('/login') && !redirectTo.startsWith('/register')) {
        router.push(redirectTo);
      } else if (data.user.role === 'SUPER_ADMIN') {
        router.push('/super-admin/dashboard');
      } else if (data.user.role === 'ADMIN') {
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
      const response = await authService.register(payload);
      if (!response.success) {
        throw new Error(response.message || 'Gagal mendaftar');
      }
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
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
      // call service, but clear store anyway in case API fails
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout API error', error);
      }
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Berhasil keluar.');
      router.push('/login');
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
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
  };
}
