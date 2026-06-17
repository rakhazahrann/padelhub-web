'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { CreateBookingPayload, WalkInBookingPayload } from '@/types/booking.types';

import { bookingService } from '@/services/booking.service';
import { queryKeys } from '@/lib/query-keys';

export function useMyBookings(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.bookings.my(filters),
    queryFn: () => bookingService.getMyBookings(filters),
  });
}

export function useBookings(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: () => bookingService.getBookings(filters),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingService.createBooking(payload),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat pemesanan.');
    },
  });
}

export function useCreateWalkInBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WalkInBookingPayload) => bookingService.createWalkInBooking(payload),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
        toast.success('Pemesanan Walk-In berhasil dibuat.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat pemesanan walk-in.');
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingService.cancelBooking(id, reason),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
        toast.success('Pemesanan berhasil dibatalkan.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membatalkan pemesanan.');
    },
  });
}

export function useCheckInBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingService.checkInBooking(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
        toast.success('Pemain berhasil check-in.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal melakukan check-in.');
    },
  });
}

export function useMarkNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingService.markNoShow(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
        toast.success('Booking ditandai No-Show.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menandai No-Show.');
    },
  });
}
