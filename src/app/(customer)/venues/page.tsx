'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, ChevronDown } from 'lucide-react';
import * as m from 'motion/react-m';

import { useVenues } from '@/hooks/use-venues';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { PageTransition } from '@/components/motion';
import { cn, formatCurrency } from '@/lib/utils';
import type { Venue } from '@/types/venue.types';

const SPORTS = ['Padel', 'Tennis', 'Badminton', 'Futsal', 'Basket'] as const;

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularitas' },
  { value: 'cheapest', label: 'Harga Terendah' },
  { value: 'expensive', label: 'Harga Tertinggi' },
];

export default function VenuesPage() {
  const { data: response, isLoading } = useVenues();
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  const venues = response?.data || [];

  const filteredVenues = venues
    .filter((venue) => {
      const matchSearch = venue.name.toLowerCase().includes(search.toLowerCase()) ||
        venue.address.toLowerCase().includes(search.toLowerCase());
      const matchSport = sportFilter
        ? venue.name.toLowerCase().includes(sportFilter.toLowerCase())
        : true;
      return matchSearch && matchSport;
    })
    .sort((a, b) => {
      if (sortBy === 'cheapest') return (a.priceMin ?? 0) - (b.priceMin ?? 0);
      if (sortBy === 'expensive') return (b.priceMin ?? 0) - (a.priceMin ?? 0);
      return (b.rating ?? 0) - (a.rating ?? 0);
    });

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Cari Venue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Temukan lapangan padel terdekat dan booking langsung
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-5 space-y-5">
        {/* Search + Sort bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari venue..."
              className="pl-9 h-10 bg-background border-border/60 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Urutkan:</span>
            <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
              <SelectTrigger className="h-9 w-[140px] rounded-xl text-sm border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSportFilter(null)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-paper whitespace-nowrap cursor-pointer',
              sportFilter === null
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground',
            )}
          >
            Semua
          </button>
          {SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => setSportFilter(sportFilter === sport ? null : sport)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium border transition-paper whitespace-nowrap cursor-pointer',
                sportFilter === sport
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground',
              )}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-xs text-muted-foreground">
          Menampilkan <span className="font-medium text-foreground">{filteredVenues.length}</span> venue tersedia
        </p>

        {/* Loading */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-border/60 overflow-hidden">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-4 space-y-3">
                  <LoadingSkeleton variant="card" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="py-20 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">Venue tidak ditemukan</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Coba ubah pencarian atau filter</p>
            <Button variant="outline" size="sm" className="mt-4 rounded-xl" onClick={() => { setSearch(''); setSportFilter(null); }}>
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue, i) => (
              <VenueCard key={venue.id} venue={venue} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/venues/${venue.slug}`} className="block group">
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-paper hover:shadow-md hover:border-border/80">
          {/* Image */}
          <div className="aspect-[16/10] bg-muted relative overflow-hidden">
            {!imgError ? (
              <img
                src={venue.imageUrl}
                alt={venue.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-secondary/5 to-primary/5">
                <MapPin className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
            {/* Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-foreground shadow-xs backdrop-blur-sm">
              Padel
            </div>
            {/* Rating */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-xs font-bold text-foreground shadow-xs backdrop-blur-sm">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              {venue.rating || '4.8'}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-bold text-sm group-hover:text-secondary transition-colors">
              {venue.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              {venue.address}
            </p>
            <p className="text-xs text-muted-foreground">
              {venue.courtCount} lapangan tersedia
            </p>
            <div className="pt-1">
              <span className="text-xs text-muted-foreground">Mulai </span>
              <span className="text-sm font-bold text-secondary font-mono">
                {formatCurrency(venue.priceMin || 100000)}
              </span>
              <span className="text-xs text-muted-foreground"> /sesi</span>
            </div>
          </div>
        </div>
      </Link>
    </m.div>
  );
}
