export type CourtType = 'INDOOR' | 'OUTDOOR';

export type Court = {
  id: string;
  venueId: string;
  name: string;
  type: CourtType;
  isActive: boolean;
  description?: string;
};

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'HOLD' | 'MAINTENANCE';

export type TimeSlot = {
  courtId: string;
  courtName: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  price: number;
  bookingId?: string;
  customerName?: string;
  blockId?: string;
  blockIndex?: number;
  isPartOfBlock?: boolean;
};

export type DaySchedule = {
  date: string;
  courts: {
    court: Court;
    slots: TimeSlot[];
  }[];
};
