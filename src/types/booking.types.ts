import type { Court } from './court.types';
import type { Payment } from './payment.types';

export type BookingStatus =
  | 'HOLD'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'EXPIRED';

export type BookingDuration = 60 | 90 | 120;

export type Booking = {
  id: string;
  courtId: string;
  court?: Court;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: BookingDuration;
  status: BookingStatus;
  totalAmount: number;
  adminFee: number;
  holdExpiresAt?: string;
  checkedInAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  isWalkIn: boolean;
  paymentMethod?: 'CASH' | 'DEBIT' | 'TRANSFER';
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingPayload = {
  courtId: string;
  bookingDate: string;
  startTime: string;
  duration: BookingDuration;
  customerName?: string;
  customerPhone?: string;
};

export type WalkInBookingPayload = {
  courtId: string;
  bookingDate: string;
  startTime: string;
  duration: BookingDuration;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'CASH' | 'DEBIT' | 'TRANSFER';
};
