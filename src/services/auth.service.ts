import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

import { authClient } from '@/lib/auth-client';

export const authService = {
  async login(payload: LoginPayload) {
    const { data, error } = await authClient.signIn.email({
      email: payload.email,
      password: payload.password,
    });

    if (error) throw new Error(error.message || 'Email atau password salah');
    return data;
  },

  async register(payload: RegisterPayload) {
    const { data, error } = await authClient.signUp.email({
      email: payload.email,
      password: payload.password,
      name: payload.name,
    });

    if (error) throw new Error(error.message || 'Pendaftaran gagal');
    return data;
  },

  async logout(): Promise<void> {
    await authClient.signOut();
  },
};
