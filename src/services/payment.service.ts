import type { Payment, PaymentMethod } from '@/types/payment.types';
import type { ApiResponse } from '@/types/api.types';
import type { Booking } from '@/types/booking.types';

// Helper to access bookings from localStorage to update their status upon payment
const getStoredBookings = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('padelhub_bookings');
  return stored ? JSON.parse(stored) : [];
};

const saveStoredBookings = (bookings: Booking[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('padelhub_bookings', JSON.stringify(bookings));
  }
};

export const paymentService = {
  async createPayment(bookingId: string, method: PaymentMethod): Promise<ApiResponse<Payment>> {
    const bookings = getStoredBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      throw new Error('Booking tidak ditemukan');
    }

    const booking = bookings[bookingIndex];
    const amount = booking.totalAmount;
    const adminFee = booking.adminFee;
    const totalAmount = amount + adminFee;

    // Simulate payment response
    const mockPayment: Payment = {
      id: `pay-${Math.random().toString(36).substr(2, 9)}`,
      bookingId,
      amount,
      adminFee,
      totalAmount,
      method,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // If virtual account, add account number
    if (method === 'VIRTUAL_ACCOUNT') {
      mockPayment.virtualAccountNumber = '880608' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    } else if (method === 'QRIS') {
      // QR image placeholder
      mockPayment.qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=padelhub-booking-' + bookingId;
    }

    // Auto-confirm booking after a short delay, or mock it instantly for the frontend review
    // For instant preview, we immediately update the booking status to CONFIRMED!
    bookings[bookingIndex].status = 'CONFIRMED';
    bookings[bookingIndex].payment = mockPayment;
    saveStoredBookings(bookings);

    mockPayment.status = 'PAID';
    mockPayment.paidAt = new Date().toISOString();

    return {
      success: true,
      data: mockPayment,
    };
  },

  async getPaymentStatus(paymentId: string): Promise<ApiResponse<Payment>> {
    // Just return a mock PAID status
    return {
      success: true,
      data: {
        id: paymentId,
        bookingId: 'mock-booking-id',
        amount: 200000,
        adminFee: 5000,
        totalAmount: 205000,
        method: 'QRIS',
        status: 'PAID',
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    };
  },
};
