export const BOOKING_DURATIONS = [60, 90, 120] as const;

export const HOLD_DURATION_MINUTES = 15;

export const MAX_ADVANCE_DAYS = 14;

export const SLOT_INTERVAL_MINUTES = 30;

export const MAX_ACTIVE_BOOKINGS = 3;

export const CANCELLATION_DEADLINE_HOURS = 24;

export const OPERATING_HOURS = {
  START: '07:00',
  END: '23:00',
} as const;

export const PRICING_TYPES = {
  WEEKDAY: 'WEEKDAY',
  WEEKEND: 'WEEKEND',
} as const;

export const TIME_ZONES = {
  PEAK_START: '16:00',
  PEAK_END: '23:00',
  OFF_PEAK_START: '07:00',
  OFF_PEAK_END: '15:59',
} as const;
