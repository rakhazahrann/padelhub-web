import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Booking, CreateBookingPayload, WalkInBookingPayload } from '@/types/booking.types';
import type { DaySchedule } from '@/types/court.types';

import { apiClient } from '@/services/api-client';

export const bookingService = {
  async getAvailability(venueSlug: string, date: string): Promise<ApiResponse<DaySchedule>> {
    const { data } = await apiClient.get<ApiResponse<DaySchedule>>(`/availability/${venueSlug}`, { params: { date } });
    return data;
  },

  async createBooking(payload: CreateBookingPayload): Promise<ApiResponse<Booking>> {
    const { data } = await apiClient.post<ApiResponse<Booking>>('/bookings', payload);
    return data;
  },

  async createWalkInBooking(payload: WalkInBookingPayload): Promise<ApiResponse<Booking>> {
    const { data } = await apiClient.post<ApiResponse<Booking>>('/bookings/walk-in', payload);
    return data;
  },

  async getMyBookings(params?: Record<string, unknown>): Promise<PaginatedResponse<Booking>> {
    const { data } = await apiClient.get<PaginatedResponse<Booking>>('/bookings/my', { params });
    return data;
  },

  async getBookings(params?: Record<string, unknown>): Promise<PaginatedResponse<Booking>> {
    const { data } = await apiClient.get<PaginatedResponse<Booking>>('/bookings', { params });
    return data;
  },

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    const { data } = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return data;
  },

  async cancelBooking(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    const { data } = await apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason });
    return data;
  },

  async checkInBooking(id: string): Promise<ApiResponse<Booking>> {
    const { data } = await apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/check-in`);
    return data;
  },

  async markNoShow(id: string): Promise<ApiResponse<Booking>> {
    const { data } = await apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/no-show`);
    return data;
  },
};
