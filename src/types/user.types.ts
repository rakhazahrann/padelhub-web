import type { UserRole } from './auth.types';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  venueId?: string;
  venueName?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
};

export type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingAt?: string;
  createdAt: string;
};
