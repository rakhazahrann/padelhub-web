'use client';

import Link from 'next/link';
import { MapPin, Calendar, Star, ChevronRight } from 'lucide-react';
import * as m from 'motion/react-m';

import type { Venue } from '@/types/venue.types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VenueCardProps {
  venue: Venue;
  index?: number;
}

export function VenueCard({ venue, index = 0 }: VenueCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link href={`/venues/${venue.slug}`} className="block h-full">
        <Card className="overflow-hidden transition-paper hover:paper-shadow-lg flex flex-col h-full border border-border bg-card group cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <m.img
              src={venue.imageUrl}
              alt={venue.name}
              className="h-full w-full object-cover transition-paper duration-500"
              whileHover={{ scale: 1.08 }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              <Badge className="bg-white/90 text-foreground hover:bg-white/90 shadow-sm font-medium">
                <Star className="h-3 w-3 text-amber-500 mr-1" />
                4.8
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground shadow-sm font-medium">
                {venue.courtCount} Lapangan
              </Badge>
            </div>

            {/* Price tag */}
            <div className="absolute bottom-3 left-3">
              <div className="rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
                <span className="text-xs text-muted-foreground">Mulai</span>
                <span className="ml-1 font-bold text-foreground">Rp200k</span>
                <span className="text-xs text-muted-foreground">/jam</span>
              </div>
            </div>
          </div>

          <CardContent className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-paper">
              {venue.name}
            </h3>
            <p className="flex items-start gap-1.5 text-sm text-muted-foreground mt-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-secondary mt-0.5" />
              <span className="line-clamp-1">{venue.address}</span>
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
              {venue.amenities.slice(0, 3).map((amenity) => (
                <Badge
                  key={amenity}
                  variant="outline"
                  className="text-[10px] bg-muted/30 border-border text-muted-foreground font-normal"
                >
                  {amenity}
                </Badge>
              ))}
              {venue.amenities.length > 3 && (
                <span className="text-[10px] text-muted-foreground self-center pl-1">
                  +{venue.amenities.length - 3}
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="px-5 py-4 border-t border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex -space-x-1">
                {['bg-green-400', 'bg-blue-400', 'bg-yellow-400'].map((color, i) => (
                  <div key={i} className={`h-5 w-5 rounded-full border-2 border-background ${color}`} />
                ))}
              </div>
              <span>Tersedia hari ini</span>
            </div>
            <m.span
              className="inline-flex items-center gap-1 text-sm font-medium text-secondary group-hover:gap-2 transition-all"
            >
              Pesan
              <ChevronRight className="h-4 w-4" />
            </m.span>
          </CardFooter>
        </Card>
      </Link>
    </m.div>
  );
}
