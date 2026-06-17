'use client';

import * as React from 'react';
import Link from 'next/link';
import { format, addDays, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import * as m from 'motion/react-m';

import { useVenueBySlug } from '@/hooks/use-venues';
import { useAvailability } from '@/hooks/use-availability';
import { VenueDetailHeader } from '@/components/venue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { PageTransition, ScrollReveal } from '@/components/motion';
import { cn, formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function VenueDetailPage({ params }: PageProps) {
  const { slug } = React.use(params);

  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = React.useState(() => format(today, 'yyyy-MM-dd'));
  const [activeCourt, setActiveCourt] = React.useState<string | null>(null);

  const { data: venueResp, isLoading: isVenueLoading } = useVenueBySlug(slug);
  const { data: scheduleResp, isLoading: isSchedLoading } = useAvailability(slug, selectedDate);

  const venue = venueResp?.data;
  const schedule = scheduleResp?.data;
  const courts = venue?.courts || [];

  const currentActiveCourt = activeCourt || courts[0]?.id || null;

  const activeCourtSchedule = schedule?.courts.find((c) => c.court.id === currentActiveCourt);
  const days = Array.from({ length: 14 }).map((_, i) => addDays(today, i));

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    if (startOfDay(current) > today) {
      setSelectedDate(format(addDays(current, -1), 'yyyy-MM-dd'));
    }
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    if (startOfDay(current) < addDays(today, 13)) {
      setSelectedDate(format(addDays(current, 1), 'yyyy-MM-dd'));
    }
  };

  if (isVenueLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <LoadingSkeleton variant="title" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LoadingSkeleton variant="card" />
          </div>
          <div>
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold">Venue tidak ditemukan</h2>
        <p className="text-muted-foreground mt-2">
          Maaf, venue yang Anda cari tidak dapat ditemukan atau tidak aktif.
        </p>
        <Link href="/venues" className="mt-6 inline-block">
          <Button>Kembali ke Daftar Venue</Button>
        </Link>
      </div>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Venue Header */}
      <m.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <VenueDetailHeader venue={venue} />
      </m.div>

      {/* Schedule Preview Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold">Jadwal Tersedia</h2>
          </div>
          <Link href={`/venues/${venue.slug}/booking`}>
            <Button size="sm" className="rounded-xl gap-1.5 cursor-pointer">
              <Calendar className="h-4 w-4" />
              Pesan Langsung
            </Button>
          </Link>
        </div>

        <Card className="border border-border/60 bg-card overflow-hidden rounded-2xl">
          {/* Date Slider */}
          <div className="flex items-center gap-2 p-4 border-b border-border/40 bg-muted/10">
            <button
              onClick={handlePrevDay}
              disabled={format(today, 'yyyy-MM-dd') === selectedDate}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-1 gap-1.5 overflow-x-auto scrollbar-none">
              {days.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isActive = dateStr === selectedDate;
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      'flex flex-col items-center rounded-xl px-3 py-1.5 border transition-paper min-w-[56px] cursor-pointer',
                      isActive
                        ? 'border-secondary bg-secondary text-secondary-foreground'
                        : 'border-border/60 bg-card text-foreground hover:bg-muted',
                    )}
                  >
                    <span className={cn('text-[9px] font-label uppercase', isActive ? 'text-secondary-foreground/70' : 'text-muted-foreground')}>
                      {format(day, 'EEE', { locale: id })}
                    </span>
                    <span className="text-sm font-bold">{format(day, 'd')}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleNextDay}
              disabled={format(addDays(today, 13), 'yyyy-MM-dd') === selectedDate}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Court Tabs */}
          {courts.length > 1 && (
            <div className="flex gap-2 px-4 pt-3 pb-0 overflow-x-auto scrollbar-none">
              {courts.map((court) => (
                <button
                  key={court.id}
                  onClick={() => setActiveCourt(court.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-paper whitespace-nowrap cursor-pointer',
                    currentActiveCourt === court.id
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-border/60 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {court.name}
                </button>
              ))}
            </div>
          )}

          {/* Slot Grid */}
          <div className="p-4">
            {isSchedLoading ? (
              <LoadingSkeleton variant="calendar" />
            ) : activeCourtSchedule ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                {activeCourtSchedule.slots.map((slot, idx) => {
                  if (!slot.startTime.endsWith(':00')) return null;

                  const nextSlot = activeCourtSchedule.slots[idx + 1];
                  const isAvail = slot.status === 'AVAILABLE' && (!nextSlot || nextSlot.status === 'AVAILABLE');
                  const totalPrice = slot.price + (nextSlot?.price || 0);

                  return (
                    <Link
                      key={slot.startTime}
                      href={`/venues/${venue.slug}/booking`}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-lg py-2 px-1 border text-center transition-paper h-12',
                        isAvail
                          ? 'border-success/30 bg-success/5 text-success hover:bg-success/10'
                          : 'border-border/40 bg-muted/20 text-muted-foreground/40 cursor-default',
                      )}
                      onClick={(e) => {
                        if (!isAvail) e.preventDefault();
                      }}
                    >
                      <span className={cn('text-[11px] font-bold font-mono', !isAvail && 'line-through')}>
                        {slot.startTime}
                      </span>
                      <span className={cn('text-[8px] mt-0.5', isAvail ? 'text-success/70' : 'text-muted-foreground/30')}>
                        {isAvail ? formatCurrency(totalPrice) : 'Terisi'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Tidak ada jadwal untuk tanggal ini</p>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-success/20 border border-success/40" />
                Tersedia
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-muted/40 border border-border/30" />
                Terisi
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Venue Info + CTA */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal direction="up">
            <Card className="border border-border/60 bg-card rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold">Tentang Venue Ini</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {venue.name} menyediakan lapangan padel berstandar internasional yang dirancang untuk kenyamanan bermain Anda. Lapangan indoor dilengkapi dengan pendingin udara alami dari atap tinggi, sementara lapangan outdoor memberikan pengalaman bermain di bawah langit biru yang menawan.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Setiap penyewaan lapangan sudah termasuk akses ke fasilitas shower room, ruang ganti ber-AC, dan area parkir gratis. Anda juga dapat menyewa raket padel premium dan membeli bola baru langsung di Pro Shop kami.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <Card className="border border-border/60 bg-card rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold">Kebijakan Venue</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-success mt-0.5" />
                    <span><strong>Pembatalan:</strong> Gratis hingga 24 jam sebelum jadwal. Lewat batas tidak dapat dikembalikan.</span>
                  </li>
                  <li className="flex gap-2">
                    <Clock className="h-4.5 w-4.5 shrink-0 text-secondary mt-0.5" />
                    <span><strong>Durasi:</strong> 60, 90, atau 120 menit per sesi. Hadir 10 menit sebelum jadwal.</span>
                  </li>
                  <li className="flex gap-2">
                    <CreditCard className="h-4.5 w-4.5 shrink-0 text-secondary mt-0.5" />
                    <span><strong>Pembayaran:</strong> QRIS, E-Wallet, atau Virtual Account.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Booking CTA Sidebar */}
        <ScrollReveal direction="right" className="h-fit">
          <Card className="border-2 border-primary/20 bg-card sticky top-24 rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">Ingin Bermain?</h3>
                <p className="text-sm text-muted-foreground">
                  Lihat jadwal ketersediaan lapangan secara langsung dan pesan waktu bermain Anda sekarang.
                </p>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lokasi</span>
                  <span className="font-medium text-right">{siteConfig.venueName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-semibold text-secondary">Mulai Rp200.000/jam</span>
                </div>
              </div>

              <Link href={`/venues/${venue.slug}/booking`} className="block w-full">
                <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full gap-2 py-5 text-base font-semibold rounded-xl" size="lg">
                    <Calendar className="h-5 w-5" />
                    Pesan Sekarang
                  </Button>
                </m.div>
              </Link>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
