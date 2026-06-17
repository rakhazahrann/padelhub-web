import type { Venue } from '@/types/venue.types';
import { VenueCard } from './venue-card';
import { EmptyState } from '@/components/common/empty-state';
import { Map } from 'lucide-react';

interface VenueListProps {
  venues: Venue[];
}

export function VenueList({ venues }: VenueListProps) {
  if (venues.length === 0) {
    return (
      <EmptyState
        icon={Map}
        title="Tidak ada venue"
        description="Saat ini tidak ada venue olahraga padel yang terdaftar di sistem."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
