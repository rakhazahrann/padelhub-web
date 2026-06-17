import { Calendar, Clock, MapPin, Hash } from 'lucide-react';

import type { Court } from '@/types/court.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface BookingSummaryProps {
  court: Court;
  date: string;
  startTime: string;
  duration: number;
  pricePer30Min: number;
}

export function BookingSummary({
  court,
  date,
  startTime,
  duration,
  pricePer30Min,
}: BookingSummaryProps) {
  // Calculate end time
  const [startH, startM] = startTime.split(':').map(Number);
  const endMinutes = startH * 60 + startM + duration;
  const endH = Math.floor(endMinutes / 60);
  const endM = endMinutes % 60;
  const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

  const courtPrice = (duration / 30) * pricePer30Min;
  const adminFee = 5000;
  const totalAmount = courtPrice + adminFee;

  return (
    <Card className="border border-border bg-card shadow-sm overflow-hidden font-sans">
      <CardHeader className="bg-muted/30 p-5 border-b border-border">
        <CardTitle className="text-base font-bold">Ringkasan Pemesanan</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5 space-y-4">
        {/* Venue Info */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-foreground">{siteConfig.venueName}</h4>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
            <span>{siteConfig.venueAddress}</span>
          </div>
        </div>

        <Separator className="border-dashed" />

        {/* Schedule & Court Info */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Hash className="h-4 w-4" />
              <span>Lapangan</span>
            </div>
            <span className="font-semibold text-xs bg-accent text-secondary px-2.5 py-0.5 rounded-full uppercase tracking-wider font-label">
              {court.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Calendar className="h-4 w-4" />
              <span>Tanggal</span>
            </div>
            <span className="font-semibold">{formatDate(date)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="h-4 w-4" />
              <span>Waktu Bermain</span>
            </div>
            <span className="font-semibold">
              {formatTime(startTime)} - {formatTime(endTimeStr)} ({duration} Menit)
            </span>
          </div>
        </div>

        <Separator className="border-dashed" />

        {/* Price Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Biaya Sewa Lapangan</span>
            <span className="font-mono">{formatCurrency(courtPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Biaya Admin Platform</span>
            <span className="font-mono">{formatCurrency(adminFee)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-foreground">Total Pembayaran</span>
            <span className="font-bold font-mono text-secondary text-base">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
