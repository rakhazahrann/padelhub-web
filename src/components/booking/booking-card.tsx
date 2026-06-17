import Link from 'next/link';
import { Calendar, Clock, MapPin, ExternalLink, RefreshCw } from 'lucide-react';

import type { Booking } from '@/types/booking.types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge } from './booking-status-badge';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
}

export function BookingCard({ booking, onCancel, isCancelling = false }: BookingCardProps) {
  const isCancellable = booking.status === 'PENDING_PAYMENT' || booking.status === 'CONFIRMED';
  
  return (
    <Card className="border border-border bg-card transition-paper hover:paper-shadow-md">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between border-b border-border bg-muted/10">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
            ID: #{booking.id.slice(-6).toUpperCase()}
          </span>
          <h4 className="font-bold text-sm text-foreground">
            {booking.court?.name || 'Lapangan Padel'}
          </h4>
        </div>
        <BookingStatusBadge status={booking.status} />
      </CardHeader>
      
      <CardContent className="p-5 space-y-4">
        {/* Venue Info */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">{siteConfig.venueName}</p>
            <p>{siteConfig.venueAddress}</p>
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs text-foreground">
          <div className="space-y-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-secondary" />
              Tanggal
            </span>
            <p className="font-semibold">{formatDate(booking.bookingDate)}</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-secondary" />
              Waktu
            </span>
            <p className="font-semibold">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)} ({booking.duration} Min)
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-border flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground uppercase font-label">Total Biaya</span>
          <span className="text-sm font-bold text-secondary font-mono">
            {formatCurrency(booking.totalAmount + booking.adminFee)}
          </span>
        </div>

        <div className="flex gap-2">
          {isCancellable && onCancel && (
            <Button
              variant="outline"
              size="sm"
              disabled={isCancelling}
              onClick={() => onCancel(booking.id)}
              className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            >
              {isCancelling ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                'Batalkan'
              )}
            </Button>
          )}
          <Link href={`/bookings/${booking.id}`}>
            <Button size="sm" variant="outline" className="gap-1.5 cursor-pointer">
              Detail
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
