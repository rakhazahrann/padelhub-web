import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    // Generate role based on email prefix
    let role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' = 'CUSTOMER';
    let name = 'Pelanggan Demo';
    
    if (payload.email.startsWith('admin')) {
      role = 'ADMIN';
      name = 'Admin Venue';
    } else if (payload.email.startsWith('super')) {
      role = 'SUPER_ADMIN';
      name = 'Super Admin';
    }

    const mockUser = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      email: payload.email,
      phone: '081234567890',
      role: role,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: {
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    };
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    const mockUser = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: 'CUSTOMER' as const,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: {
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    };
  },

  async logout(): Promise<void> {
    return Promise.resolve();
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const mockUser = {
      id: 'user-customer',
      name: 'Pelanggan Demo',
      email: 'customer@padelhub.id',
      phone: '081234567890',
      role: 'CUSTOMER' as const,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: {
        user: mockUser,
        accessToken: 'mock-access-token-new',
        refreshToken: 'mock-refresh-token-new',
      },
    };
  },
};
