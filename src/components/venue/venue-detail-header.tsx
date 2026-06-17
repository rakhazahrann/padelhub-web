import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react';

import type { VenueDetail } from '@/types/venue.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VenueDetailHeaderProps {
  venue: VenueDetail;
}

export function VenueDetailHeader({ venue }: VenueDetailHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link href="/venues">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Venue
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Images section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={venue.imageUrl}
              alt={venue.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {venue.photos.slice(1, 4).map((photo, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`${venue.name} gallery ${i + 1}`}
                  className="h-full w-full object-cover transition-paper hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Sidebar card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div>
              <Badge className="bg-secondary text-secondary-foreground font-label mb-2">
                Padel Arena
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {venue.name}
              </h1>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {venue.description}
            </p>

            <div className="space-y-3 pt-2 text-sm text-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-secondary mt-0.5" />
                <span>{venue.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4.5 w-4.5 shrink-0 text-secondary" />
                <span>Buka: {venue.operatingHours.open} - {venue.operatingHours.close} WIB</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 shrink-0 text-secondary" />
                <span>{venue.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 shrink-0 text-secondary" />
                <span>{venue.email}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5 mt-6 space-y-4">
            <h4 className="font-semibold text-sm">Fasilitas Populer</h4>
            <div className="flex flex-wrap gap-1.5">
              {venue.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs bg-muted/30">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
