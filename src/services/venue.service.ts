import type { Venue, VenueDetail } from '@/types/venue.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const MOCK_VENUES: Venue[] = [
  {
    id: 'venue-1',
    name: 'PadelHub Arena',
    slug: 'padelhub-arena',
    address: 'Jl. Olahraga No. 1, Jakarta Selatan',
    phone: '+62 812-3456-7890',
    email: 'info@padelhub.id',
    description: 'PadelHub Arena adalah pusat olahraga padel modern pertama di Jakarta Selatan.',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    amenities: ['Indoor & Outdoor Courts', 'Shower Room', 'Locker Room', 'Pro Shop', 'Cafe', 'Free Wi-Fi', 'Parking Area'],
    operatingHours: { open: '07:00', close: '23:00' },
    courtCount: 4,
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_VENUE_DETAIL: VenueDetail = {
  ...MOCK_VENUES[0],
  courts: [
    { id: 'court-1', venueId: 'venue-1', name: 'Lapangan A (Indoor)', type: 'INDOOR', isActive: true, description: 'Lapangan indoor dengan atap tinggi, bebas cuaca.' },
    { id: 'court-2', venueId: 'venue-1', name: 'Lapangan B (Indoor)', type: 'INDOOR', isActive: true, description: 'Lapangan indoor dengan atap tinggi, bebas cuaca.' },
    { id: 'court-3', venueId: 'venue-1', name: 'Lapangan C (Outdoor)', type: 'OUTDOOR', isActive: true, description: 'Lapangan outdoor panorama, angin segar.' },
    { id: 'court-4', venueId: 'venue-1', name: 'Lapangan D (Outdoor)', type: 'OUTDOOR', isActive: true, description: 'Lapangan outdoor panorama, angin segar.' },
  ],
  photos: [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'
  ]
};

export const venueService = {
  async getVenues(): Promise<PaginatedResponse<Venue>> {
    return {
      success: true,
      data: MOCK_VENUES,
      meta: {
        page: 1,
        perPage: 10,
        total: MOCK_VENUES.length,
        totalPages: 1,
      }
    };
  },

  async getVenueBySlug(slug: string): Promise<ApiResponse<VenueDetail>> {
    if (slug === 'padelhub-arena') {
      return {
        success: true,
        data: MOCK_VENUE_DETAIL,
      };
    }
    throw new Error('Venue tidak ditemukan');
  },
};
