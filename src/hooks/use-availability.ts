'use client';

import { useQuery } from '@tanstack/react-query';

import { bookingService } from '@/services/booking.service';
import { queryKeys } from '@/lib/query-keys';

export function useAvailability(venueSlug: string, date: string) {
  return useQuery({
    queryKey: queryKeys.availability.slots(venueSlug, date),
    queryFn: () => bookingService.getAvailability(venueSlug, date),
    enabled: !!venueSlug && !!date,
    refetchInterval: 15000, // Refresh availability every 15s
  });
}
