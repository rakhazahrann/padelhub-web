'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { Calendar, CalendarCheck, CalendarX, Clock, Filter } from 'lucide-react';

import type { BookingStatus } from '@/types/booking.types';

import { useMyBookings, useCancelBooking } from '@/hooks/use-bookings';
import { BookingCard } from '@/components/booking/booking-card';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { PageTransition } from '@/components/motion/page-transition';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type FilterStatus = 'ALL' | BookingStatus;

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'HOLD', label: 'Hold Sesi' },
  { value: 'PENDING_PAYMENT', label: 'Menunggu Bayar' },
  { value: 'CONFIRMED', label: 'Dikonfirmasi' },
  { value: 'CHECKED_IN', label: 'Sudah Hadir' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
  { value: 'NO_SHOW', label: 'Tidak Hadir' },
  { value: 'EXPIRED', label: 'Kedaluwarsa' },
];

const ACTIVE_STATUSES: BookingStatus[] = ['HOLD', 'PENDING_PAYMENT', 'CONFIRMED', 'CHECKED_IN'];
const COMPLETED_STATUSES: BookingStatus[] = ['COMPLETED'];
const CANCELLED_STATUSES: BookingStatus[] = ['CANCELLED', 'NO_SHOW', 'EXPIRED'];

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  accentClass: string;
  iconBgClass: string;
}

function StatCard({ icon: Icon, label, value, accentClass, iconBgClass }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-paper hover:paper-shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}>
          <Icon className={`h-5 w-5 ${accentClass}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const { data: response, isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  const bookings = response?.data || [];

  // Stats
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length;
  const completedBookings = bookings.filter((b) => COMPLETED_STATUSES.includes(b.status)).length;
  const cancelledBookings = bookings.filter((b) => CANCELLED_STATUSES.includes(b.status)).length;

  // Filtered list
  const filteredBookings =
    statusFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const handleCancelBooking = (id: string) => {
    cancelBooking.mutate({ id, reason: 'Dibatalkan oleh pelanggan' });
  };

  const handleFilterChange = (value: FilterStatus | null) => {
    if (value) setStatusFilter(value);
  };

  return (
    <PageTransition className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="font-label text-secondary">Riwayat Pemesanan</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pemesanan Saya
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Pantau semua pemesanan lapangan Anda, mulai dari yang sedang aktif hingga riwayat yang telah selesai.
          </p>
        </div>

        {/* Stat Cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <StatCard
                icon={Calendar}
                label="Total Booking"
                value={totalBookings}
                accentClass="text-secondary"
                iconBgClass="bg-secondary/10"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={Clock}
                label="Aktif"
                value={activeBookings}
                accentClass="text-amber-500"
                iconBgClass="bg-amber-500/10"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={CalendarCheck}
                label="Selesai"
                value={completedBookings}
                accentClass="text-emerald-500"
                iconBgClass="bg-emerald-500/10"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                icon={CalendarX}
                label="Dibatalkan"
                value={cancelledBookings}
                accentClass="text-destructive"
                iconBgClass="bg-destructive/10"
              />
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Filter Bar */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {statusFilter !== 'ALL' && (
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter('ALL')}
                className="text-muted-foreground cursor-pointer"
              >
                Reset
              </Button>
            </m.div>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {filteredBookings.length} pemesanan
          </span>
        </div>

        {/* Booking List */}
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={statusFilter === 'ALL' ? 'Belum Ada Pemesanan' : 'Tidak Ada Pemesanan'}
            description={
              statusFilter === 'ALL'
                ? 'Anda belum membuat pemesanan apa pun. Mulai jelajahi venue dan pesan lapangan pertama Anda!'
                : `Tidak ada pemesanan dengan status "${STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}". Coba pilih filter lain.`
            }
            action={
              statusFilter === 'ALL' ? (
                <Button className="cursor-pointer">Jelajahi Venue</Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter('ALL')}
                  className="cursor-pointer"
                >
                  Lihat Semua Pemesanan
                </Button>
              )
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <m.div
              layout
              className="grid gap-5 md:grid-cols-2"
            >
              {filteredBookings.map((booking) => (
                <m.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <BookingCard
                    booking={booking}
                    onCancel={handleCancelBooking}
                    isCancelling={cancelBooking.isPending}
                  />
                </m.div>
              ))}
            </m.div>
          </AnimatePresence>
        )}
      </div>
    </PageTransition>
  );
}
