'use client';

import { useState } from 'react';
import * as m from 'motion/react-m';
import { format, startOfDay } from 'date-fns';
import { CalendarDays, Clock, Users } from 'lucide-react';

import { PageTransition } from '@/components/motion/page-transition';
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/stagger-container';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { CalendarHeader } from '@/components/calendar/calendar-header';
import { CalendarView } from '@/components/calendar/calendar-view';
import { BookingCard } from '@/components/booking/booking-card';
import { StatCard } from '@/components/common/stat-card';
import { Badge } from '@/components/ui/badge';

import { useAvailability } from '@/hooks/use-availability';
import { useVenueBySlug } from '@/hooks/use-venues';
import { useBookings } from '@/hooks/use-bookings';

import type { BookingDuration } from '@/types/booking.types';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const VENUE_SLUG = 'padelhub-arena';

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminCalendarPage() {
  /* ---- State ---- */
  const today = startOfDay(new Date());
  const todayStr = format(today, 'yyyy-MM-dd');

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedDuration, setSelectedDuration] = useState<BookingDuration>(60);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);

  /* ---- Data ---- */
  const { data: venueResponse, isLoading: venueLoading } = useVenueBySlug(VENUE_SLUG);
  const venue = venueResponse?.data;

  const { data: availabilityResponse, isLoading: availabilityLoading } =
    useAvailability(VENUE_SLUG, selectedDate);
  const schedule = availabilityResponse?.data;

  const { data: bookingsResponse, isLoading: bookingsLoading } = useBookings({
    date: todayStr,
  });
  const todayBookings = bookingsResponse?.data ?? [];

  /* ---- Derived stats ---- */
  const totalTodayBookings = todayBookings.length;
  const confirmedCount = todayBookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN',
  ).length;
  const courtsCount = venue?.courts?.length ?? 0;

  /* ---- Handlers ---- */
  const handleSlotSelect = (courtId: string, startTime: string) => {
    if (selectedCourtId === courtId && selectedStartTime === startTime) {
      setSelectedCourtId(null);
      setSelectedStartTime(null);
    } else {
      setSelectedCourtId(courtId);
      setSelectedStartTime(startTime);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Kalender Lapangan</h2>
          <p className="text-muted-foreground">
            Pantau ketersediaan lapangan dan ringkasan pemesanan hari ini secara
            real-time.
          </p>
        </div>

        {/* Stats */}
        {venueLoading || bookingsLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-3">
            <StaggerItem>
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <StatCard
                  title="Total Lapangan"
                  value={courtsCount}
                  icon={CalendarDays}
                  description="Lapangan aktif terdaftar"
                />
              </m.div>
            </StaggerItem>
            <StaggerItem>
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <StatCard
                  title="Booking Hari Ini"
                  value={totalTodayBookings}
                  icon={Clock}
                  description="Total pemesanan hari ini"
                />
              </m.div>
            </StaggerItem>
            <StaggerItem>
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <StatCard
                  title="Aktif / Konfirmasi"
                  value={confirmedCount}
                  icon={Users}
                  description="Booking confirmed & checked-in"
                />
              </m.div>
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Calendar Header & View */}
        <ScrollReveal delay={0.1}>
          <div className="space-y-4">
            <CalendarHeader
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
            />

            {availabilityLoading ? (
              <LoadingSkeleton variant="calendar" />
            ) : schedule ? (
              <CalendarView
                schedule={schedule}
                selectedCourtId={selectedCourtId}
                selectedStartTime={selectedStartTime}
                selectedDuration={selectedDuration}
                onSlotSelect={handleSlotSelect}
              />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-12">
                <p className="text-sm text-muted-foreground">
                  Data ketersediaan belum tersedia untuk tanggal ini.
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Today's Bookings Summary */}
        <ScrollReveal delay={0.2}>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">
                  Ringkasan Booking Hari Ini
                </h3>
                <p className="text-xs text-muted-foreground">
                  {format(today, 'EEEE, d MMMM yyyy')}
                </p>
              </div>
              <Badge variant="outline">
                {totalTodayBookings} booking
              </Badge>
            </div>

            {bookingsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LoadingSkeleton key={i} variant="card" />
                ))}
              </div>
            ) : todayBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Belum Ada Booking
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Belum ada pemesanan untuk hari ini.
                </p>
              </div>
            ) : (
              <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {todayBookings.map((booking) => (
                  <StaggerItem key={booking.id}>
                    <BookingCard booking={booking} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
