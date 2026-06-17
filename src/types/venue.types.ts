import type { Court } from './court.types';

export type Venue = {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  imageUrl: string;
  amenities: string[];
  operatingHours: OperatingHours;
  courtCount: number;
  priceMin?: number;
  rating?: number;
  createdAt: string;
};

export type OperatingHours = {
  open: string;
  close: string;
};

export type VenueDetail = Venue & {
  courts: Court[];
  photos: string[];
};
