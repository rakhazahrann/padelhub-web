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

  async updateProfile(data: { name?: string; phone?: string }) {
    const { data: result, error } = await authClient.updateUser({
      name: data.name,
      phone: data.phone,
    } as Record<string, string | undefined>);

    if (error) throw new Error(error.message || 'Gagal memperbarui profil');
    return result;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const { data: result, error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: true,
    });

    if (error) throw new Error(error.message || 'Gagal mengubah password');
    return result;
  },
};
