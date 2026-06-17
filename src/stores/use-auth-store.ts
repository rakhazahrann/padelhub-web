import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User, UserRole } from '@/types/auth.types';

const AUTH_COOKIE_NAME = 'padelhub-auth';

function setAuthCookie(user: User) {
  if (typeof document === 'undefined') return;
  const payload = JSON.stringify({
    isAuthenticated: true,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(payload)}; path=/; max-age=86400; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  hasRole: (role: UserRole) => boolean;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        setAuthCookie(user);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        clearAuthCookie();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      hasRole: (role) => get().user?.role === role,
    }),
    {
      name: 'padelhub-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
