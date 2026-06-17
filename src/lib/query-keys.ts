export const queryKeys = {
  venues: {
    all: ['venues'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.venues.all, 'list', filters] as const,
    detail: (slug: string) => [...queryKeys.venues.all, 'detail', slug] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.bookings.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.bookings.all, 'detail', id] as const,
    my: (filters?: Record<string, unknown>) => [...queryKeys.bookings.all, 'my', filters] as const,
  },
  availability: {
    all: ['availability'] as const,
    slots: (venueSlug: string, date: string) =>
      [...queryKeys.availability.all, 'slots', venueSlug, date] as const,
  },
  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.users.all, 'list', filters] as const,
  },
  reports: {
    all: ['reports'] as const,
    revenue: (filters?: Record<string, unknown>) => [...queryKeys.reports.all, 'revenue', filters] as const,
    occupancy: (filters?: Record<string, unknown>) => [...queryKeys.reports.all, 'occupancy', filters] as const,
  },
  auditLogs: {
    all: ['audit-logs'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.auditLogs.all, 'list', filters] as const,
  },
} as const;
