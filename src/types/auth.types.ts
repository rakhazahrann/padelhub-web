export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  session?: Record<string, unknown>;
};
