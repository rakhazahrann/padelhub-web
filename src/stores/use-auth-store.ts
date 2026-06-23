import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User, UserRole } from '@/types/auth.types';
import { setAuthCookie, clearAuthCookie } from '@/lib/cookie';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  _hydrated: boolean;
};

type AuthActions = {
  setUser: (user: User) => void;
  clearAuth: () => void;
  hasRole: (role: UserRole) => boolean;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      _hydrated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
        setAuthCookie({ isAuthenticated: true, role: user.role, email: user.email, name: user.name });
      },

      clearAuth: () => {
        set({ user: null, isAuthenticated: false });
        clearAuthCookie();
        // Explicitly remove from localStorage to prevent rehydrate issues
        if (typeof window !== 'undefined') {
          localStorage.removeItem('padelhub-auth');
        }
      },

      hasRole: (role) => get().user?.role === role,

      setHydrated: () => {
        set({ _hydrated: true });
      },
    }),
    {
      name: 'padelhub-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isAuthenticated && state.user) {
          setAuthCookie({ isAuthenticated: true, role: state.user.role, email: state.user.email, name: state.user.name });
        }
        useAuthStore.getState().setHydrated();
      },
    },
  ),
);
