import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Venue, VenueDetail } from '@/types/venue.types';

import { apiClient } from '@/services/api-client';

export const venueService = {
  async getVenues(): Promise<PaginatedResponse<Venue>> {
    const { data } = await apiClient.get<PaginatedResponse<Venue>>('/venues');
    return data;
  },

  async getVenueBySlug(slug: string): Promise<ApiResponse<VenueDetail>> {
    const { data } = await apiClient.get<ApiResponse<VenueDetail>>(`/venues/${slug}`);
    return data;
  },
};
