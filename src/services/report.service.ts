import type { ApiResponse } from '@/types/api.types';

import { apiClient } from '@/services/api-client';

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

export const reportService = {
  async getReport(params?: Record<string, unknown>): Promise<ApiResponse<ReportSummary>> {
    const { data } = await apiClient.get<ApiResponse<ReportSummary>>('/reports/summary', { params });
    return data;
  },

  async exportCsv(params?: Record<string, unknown>): Promise<Blob> {
    void params;
    const { data } = await apiClient.get('/reports/summary');
    const report = data.data;
    const headers = 'Date,Revenue,BookingCount,OccupancyRate\n';
    const rows = (report.revenueByDay ?? []).map(
      (item: { date: string; revenue: number; bookingCount: number }) =>
        `"${item.date}",${item.revenue},${item.bookingCount},""`,
    ).join('\n');
    return new Blob([headers + rows], { type: 'text/csv' });
  },
};
