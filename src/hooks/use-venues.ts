'use client';

import { useQuery } from '@tanstack/react-query';

import { venueService } from '@/services/venue.service';
import { queryKeys } from '@/lib/query-keys';

export function useVenues() {
  return useQuery({
    queryKey: queryKeys.venues.list(),
    queryFn: () => venueService.getVenues(),
  });
}

export function useVenueBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.venues.detail(slug),
    queryFn: () => venueService.getVenueBySlug(slug),
    enabled: !!slug,
  });
}
