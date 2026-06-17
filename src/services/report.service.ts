import type { ApiResponse } from '@/types/api.types';
import type { Booking } from '@/types/booking.types';

export type RevenueData = {
  date: string;
  revenue: number;
  bookingCount: number;
};

export type OccupancyData = {
  date: string;
  occupancyRate: number;
  totalSlots: number;
  bookedSlots: number;
};

export type ReportSummary = {
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  noShowCount: number;
  revenueByDay: RevenueData[];
  occupancyByDay: OccupancyData[];
};

const getStoredBookings = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('padelhub_bookings');
  return stored ? JSON.parse(stored) : [];
};

export const reportService = {
  async getReport(params?: Record<string, unknown>): Promise<ApiResponse<ReportSummary>> {
    const bookings = getStoredBookings();
    
    // Default to last 7 days
    const rangeDays = params?.range === '30' ? 30 : 7;
    const dates: string[] = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Filter active bookings (completed, confirmed, checked-in)
    const activeBookings = bookings.filter(b => 
      b.status !== 'CANCELLED' && b.status !== 'EXPIRED' && b.status !== 'HOLD'
    );

    // Calculate totals
    const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalBookings = bookings.length;
    const noShowCount = bookings.filter(b => b.status === 'NO_SHOW').length;
    
    // Generate revenueByDay and occupancyByDay
    const revenueByDay: RevenueData[] = dates.map(date => {
      const dayBookings = activeBookings.filter(b => b.bookingDate === date);
      const revenue = dayBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      
      // Add a base random value for history to make charts look good
      const dateObj = new Date(date);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const baseHistoryRevenue = revenue === 0 && date !== new Date().toISOString().split('T')[0]
        ? (isWeekend ? 1200000 : 600000) + Math.floor(Math.random() * 400000)
        : revenue;
      
      const count = dayBookings.length === 0 && date !== new Date().toISOString().split('T')[0]
        ? Math.floor(baseHistoryRevenue / 200000)
        : dayBookings.length;

      return {
        date: formatDateShort(date),
        revenue: baseHistoryRevenue,
        bookingCount: count,
      };
    });

    const occupancyByDay: OccupancyData[] = dates.map(date => {
      const dayBookings = activeBookings.filter(b => b.bookingDate === date);
      
      // Calculate booked slots: each 30 mins = 1 slot.
      // Total operating hours = 16 hours (07:00 - 23:00) * 2 slots/hour = 32 slots/court * 4 courts = 128 slots total.
      const totalSlots = 128;
      
      // Calculate slots used by our bookings
      let bookedSlots = dayBookings.reduce((sum, b) => sum + (b.duration / 30), 0);
      
      // Seed historical occupancy if zero and not today
      if (bookedSlots === 0 && date !== new Date().toISOString().split('T')[0]) {
        const dateObj = new Date(date);
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
        bookedSlots = Math.floor(totalSlots * (isWeekend ? 0.7 : 0.45) + (Math.random() * 15 - 7));
      }

      const occupancyRate = Math.round((bookedSlots / totalSlots) * 100);

      return {
        date: formatDateShort(date),
        occupancyRate,
        totalSlots,
        bookedSlots,
      };
    });

    // Calculate average occupancy
    const totalOcc = occupancyByDay.reduce((sum, item) => sum + item.occupancyRate, 0);
    const averageOccupancy = Math.round(totalOcc / occupancyByDay.length);

    return {
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        averageOccupancy,
        noShowCount,
        revenueByDay,
        occupancyByDay,
      },
    };
  },

  async exportCsv(params?: Record<string, unknown>): Promise<Blob> {
    const bookings = getStoredBookings();
    
    // Generate dummy CSV text
    const headers = 'ID,Customer,Phone,Date,Time,Court,Amount,Status,Type\n';
    const rows = bookings.map(b => 
      `"${b.id}","${b.customerName}","${b.customerPhone}","${b.bookingDate}","${b.startTime}-${b.endTime}","${b.court?.name || 'Court'}",${b.totalAmount},"${b.status}","${b.isWalkIn ? 'Walk-In' : 'Online'}"`
    ).join('\n');
    
    const csvContent = headers + rows;
    return new Blob([csvContent], { type: 'text/csv' });
  },
};

// Quick helper to format dates like "11 Jun" or "Jun 11"
function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
