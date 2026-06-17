import type { Booking, CreateBookingPayload, WalkInBookingPayload } from '@/types/booking.types';
import type { DaySchedule, TimeSlot } from '@/types/court.types';
import type { Payment } from '@/types/payment.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { MOCK_VENUE_DETAIL } from './venue.service';

// Helper to interact with LocalStorage
const getStoredBookings = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('padelhub_bookings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  
  // Seed initial mock bookings if empty
  const seeded = generateSeedBookings();
  localStorage.setItem('padelhub_bookings', JSON.stringify(seeded));
  return seeded;
};

const saveStoredBookings = (bookings: Booking[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('padelhub_bookings', JSON.stringify(bookings));
  }
};

function generateSeedBookings(): Booking[] {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return [
    {
      id: 'book-1',
      courtId: 'court-1',
      court: MOCK_VENUE_DETAIL.courts[0],
      customerName: 'Budi Santoso',
      customerPhone: '081234567890',
      customerEmail: 'budi@gmail.com',
      bookingDate: yesterday,
      startTime: '08:00',
      endTime: '10:00',
      duration: 120,
      status: 'COMPLETED',
      totalAmount: 300000,
      adminFee: 5000,
      isWalkIn: false,
      createdAt: new Date(yesterday).toISOString(),
      updatedAt: new Date(yesterday).toISOString(),
    },
    {
      id: 'book-2',
      courtId: 'court-2',
      court: MOCK_VENUE_DETAIL.courts[1],
      customerName: 'Siti Rahma',
      customerPhone: '081399887766',
      customerEmail: 'siti@gmail.com',
      bookingDate: today,
      startTime: '09:00',
      endTime: '10:30',
      duration: 90,
      status: 'CONFIRMED',
      totalAmount: 225000,
      adminFee: 5000,
      isWalkIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'book-3',
      courtId: 'court-3',
      court: MOCK_VENUE_DETAIL.courts[2],
      customerName: 'Rian Wijaya',
      customerPhone: '085711223344',
      customerEmail: 'rian@gmail.com',
      bookingDate: today,
      startTime: '16:00',
      endTime: '17:00',
      duration: 60,
      status: 'PENDING_PAYMENT',
      totalAmount: 120000,
      adminFee: 5000,
      holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      isWalkIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'book-4',
      courtId: 'court-1',
      court: MOCK_VENUE_DETAIL.courts[0],
      customerName: 'Andi Walkin',
      customerPhone: '081122334455',
      bookingDate: today,
      startTime: '14:00',
      endTime: '16:00',
      duration: 120,
      status: 'CHECKED_IN',
      totalAmount: 300000,
      adminFee: 0,
      paymentMethod: 'CASH',
      isWalkIn: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'book-5',
      courtId: 'court-4',
      court: MOCK_VENUE_DETAIL.courts[3],
      customerName: 'Dewi Lestari',
      customerPhone: '087812345678',
      bookingDate: today,
      startTime: '19:00',
      endTime: '20:30',
      duration: 90,
      status: 'CANCELLED',
      totalAmount: 180000,
      adminFee: 5000,
      cancelReason: 'Ada urusan mendadak',
      cancelledAt: new Date().toISOString(),
      isWalkIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}

export const bookingService = {
  async getAvailability(venueSlug: string, date: string): Promise<ApiResponse<DaySchedule>> {
    const stored = getStoredBookings();
    
    // Operating hours: 07:00 to 23:00. Half-hourly slots.
    const startHour = 7;
    const endHour = 23;
    const slotsPerHour = 2; // 30 mins
    
    const daySchedule: DaySchedule = {
      date,
      courts: MOCK_VENUE_DETAIL.courts.map(court => {
        const slots: TimeSlot[] = [];
        
        for (let hour = startHour; hour < endHour; hour++) {
          for (let min = 0; min < 60; min += 30) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            
            // End time calculation
            let endHourVal = hour;
            let endMinVal = min + 30;
            if (endMinVal >= 60) {
              endHourVal++;
              endMinVal = 0;
            }
            const endTimeStr = `${endHourVal.toString().padStart(2, '0')}:${endMinVal.toString().padStart(2, '0')}`;

            // Check if this time slot overlaps with any existing booking for this court
            const activeBooking = stored.find(b => {
              if (b.courtId !== court.id || b.bookingDate !== date) return false;
              if (b.status === 'CANCELLED' || b.status === 'EXPIRED') return false;
              
              // Simple string comparison for time overlap
              return timeStr >= b.startTime && timeStr < b.endTime;
            });

            // Price calculation (peak hours are 16:00 - 23:00)
            const isPeak = hour >= 16;
            const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
            
            let price = 100000; // Base price per hour is 200k, so 100k per 30 mins
            if (isPeak) price += 30000;
            if (isWeekend) price += 20000;

            slots.push({
              courtId: court.id,
              courtName: court.name,
              startTime: timeStr,
              endTime: endTimeStr,
              status: activeBooking 
                ? (activeBooking.status === 'PENDING_PAYMENT' || activeBooking.status === 'HOLD' ? 'HOLD' : 'BOOKED')
                : 'AVAILABLE',
              price: price,
              bookingId: activeBooking?.id,
              customerName: activeBooking?.customerName,
            });
          }
        }
        
        return {
          court,
          slots
        };
      })
    };

    return {
      success: true,
      data: daySchedule
    };
  },

  async createBooking(payload: CreateBookingPayload): Promise<ApiResponse<Booking>> {
    const stored = getStoredBookings();
    
    // Calculate end time
    const [startH, startM] = payload.startTime.split(':').map(Number);
    const endMinutes = startH * 60 + startM + payload.duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    const court = MOCK_VENUE_DETAIL.courts.find(c => c.id === payload.courtId);
    
    // Calculate total price based on duration
    const pricePerHour = 200000;
    const totalAmount = (payload.duration / 60) * pricePerHour;
    const adminFee = 5000;

    const newBooking: Booking = {
      id: `book-${Math.random().toString(36).substr(2, 9)}`,
      courtId: payload.courtId,
      court: court || MOCK_VENUE_DETAIL.courts[0],
      customerName: payload.customerName || 'Pelanggan Demo',
      customerPhone: payload.customerPhone || '081234567890',
      bookingDate: payload.bookingDate,
      startTime: payload.startTime,
      endTime,
      duration: payload.duration,
      status: 'PENDING_PAYMENT',
      totalAmount,
      adminFee,
      holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      isWalkIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    stored.push(newBooking);
    saveStoredBookings(stored);

    return {
      success: true,
      data: newBooking
    };
  },

  async createWalkInBooking(payload: WalkInBookingPayload): Promise<ApiResponse<Booking>> {
    const stored = getStoredBookings();
    
    const [startH, startM] = payload.startTime.split(':').map(Number);
    const endMinutes = startH * 60 + startM + payload.duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    const court = MOCK_VENUE_DETAIL.courts.find(c => c.id === payload.courtId);
    
    const pricePerHour = 200000;
    const totalAmount = (payload.duration / 60) * pricePerHour;
    const bookingId = `book-${Math.random().toString(36).substr(2, 9)}`;

    const newPayment: Payment = {
      id: `pay-${Math.random().toString(36).substr(2, 9)}`,
      bookingId,
      amount: totalAmount,
      adminFee: 0,
      totalAmount,
      method: payload.paymentMethod,
      status: 'PAID',
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const newBooking: Booking = {
      id: bookingId,
      courtId: payload.courtId,
      court: court || MOCK_VENUE_DETAIL.courts[0],
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      bookingDate: payload.bookingDate,
      startTime: payload.startTime,
      endTime,
      duration: payload.duration,
      status: 'CONFIRMED',
      totalAmount,
      adminFee: 0,
      paymentMethod: payload.paymentMethod,
      isWalkIn: true,
      payment: newPayment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    stored.push(newBooking);
    saveStoredBookings(stored);

    return {
      success: true,
      data: newBooking
    };
  },

  async getMyBookings(params?: Record<string, unknown>): Promise<PaginatedResponse<Booking>> {
    const stored = getStoredBookings();
    // Filter non-walk-in or all customer bookings
    const customerBookings = stored.filter(b => !b.isWalkIn);
    
    return {
      success: true,
      data: customerBookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      meta: {
        page: 1,
        perPage: 10,
        total: customerBookings.length,
        totalPages: 1,
      }
    };
  },

  async getBookings(params?: Record<string, unknown>): Promise<PaginatedResponse<Booking>> {
    const stored = getStoredBookings();
    let filtered = [...stored];

    if (params?.date) {
      filtered = filtered.filter(b => b.bookingDate === params.date);
    }
    if (params?.status) {
      filtered = filtered.filter(b => b.status === params.status);
    }
    if (params?.search) {
      const searchStr = String(params.search).toLowerCase();
      filtered = filtered.filter(b => 
        b.customerName.toLowerCase().includes(searchStr) || 
        b.customerPhone.includes(searchStr)
      );
    }

    return {
      success: true,
      data: filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      meta: {
        page: 1,
        perPage: 20,
        total: filtered.length,
        totalPages: 1,
      }
    };
  },

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    const stored = getStoredBookings();
    const booking = stored.find(b => b.id === id);
    if (booking) {
      return {
        success: true,
        data: booking
      };
    }
    throw new Error('Booking tidak ditemukan');
  },

  async cancelBooking(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    const stored = getStoredBookings();
    const index = stored.findIndex(b => b.id === id);
    
    if (index !== -1) {
      stored[index].status = 'CANCELLED';
      stored[index].cancelReason = reason || 'Dibatalkan oleh pengguna';
      stored[index].cancelledAt = new Date().toISOString();
      stored[index].updatedAt = new Date().toISOString();
      saveStoredBookings(stored);
      return {
        success: true,
        data: stored[index]
      };
    }
    throw new Error('Booking tidak ditemukan');
  },

  async checkInBooking(id: string): Promise<ApiResponse<Booking>> {
    const stored = getStoredBookings();
    const index = stored.findIndex(b => b.id === id);
    
    if (index !== -1) {
      stored[index].status = 'CHECKED_IN';
      stored[index].checkedInAt = new Date().toISOString();
      stored[index].updatedAt = new Date().toISOString();
      saveStoredBookings(stored);
      return {
        success: true,
        data: stored[index]
      };
    }
    throw new Error('Booking tidak ditemukan');
  },

  async markNoShow(id: string): Promise<ApiResponse<Booking>> {
    const stored = getStoredBookings();
    const index = stored.findIndex(b => b.id === id);
    
    if (index !== -1) {
      stored[index].status = 'NO_SHOW';
      stored[index].updatedAt = new Date().toISOString();
      saveStoredBookings(stored);
      return {
        success: true,
        data: stored[index]
      };
    }
    throw new Error('Booking tidak ditemukan');
  },
};
