'use client';

import { useState } from 'react';
import * as m from 'motion/react-m';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  X, 
  Calendar,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';

import { PageTransition } from '@/components/motion/page-transition';
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/stagger-container';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { StatCard } from '@/components/common/stat-card';
import { BookingStatusBadge } from '@/components/booking/booking-status-badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

import { 
  useBookings,
  useCheckInBooking,
  useMarkNoShow,
  useCancelBooking 
} from '@/hooks/use-bookings';

import type { Booking, BookingStatus } from '@/types/booking.types';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const STATUS_FILTERS = [
  { value: '', label: 'Semua Status' },
  { value: 'PENDING_PAYMENT', label: 'Menunggu Bayar' },
  { value: 'HOLD', label: 'Hold Sesi' },
  { value: 'CONFIRMED', label: 'Dikonfirmasi' },
  { value: 'CHECKED_IN', label: 'Sudah Hadir' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
  { value: 'NO_SHOW', label: 'Tidak Hadir' },
  { value: 'EXPIRED', label: 'Kadaluarsa' },
] as const;

/* ---- Date helpers (lazy-evaluated once at module load) ---- */
const TODAY = format(new Date(), 'yyyy-MM-dd');
const DATE_MIN = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
const DATE_MAX = format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

interface StatusStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
}

function getStatusStats(bookings: Booking[]): StatusStats {
  return {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING_PAYMENT').length,
    confirmed: bookings.filter(
      b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
    ).length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
  };
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminBookingsPage() {
  /* ---- State ---- */
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | BookingStatus>('');
  const [dateFilter, setDateFilter] = useState(TODAY);

  /* ---- Query ---- */
  const filters = {
    search: search || undefined,
    status: statusFilter || undefined,
    date: dateFilter,
  };

  const { data: bookingsResponse, isLoading } = useBookings(filters);
  const bookings = bookingsResponse?.data ?? [];

  /* ---- Mutations ---- */
  const checkInMutation = useCheckInBooking();
  const markNoShowMutation = useMarkNoShow();
  const cancelMutation = useCancelBooking();

  /* ---- Stats ---- */
  const stats = getStatusStats(bookings);

  /* ---- Handlers ---- */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCheckIn = async (bookingId: string) => {
    await checkInMutation.mutateAsync(bookingId);
    toast.success('Booking berhasil di-check-in.');
  };

  const handleMarkNoShow = async (bookingId: string) => {
    await markNoShowMutation.mutateAsync(bookingId);
    toast.success('Booking ditandai sebagai No-Show.');
  };

  const handleCancel = async (bookingId: string, confirm: boolean) => {
    if (confirm && !cancelMutation.isPending) {
      await cancelMutation.mutateAsync({ id: bookingId });
      toast.success('Booking berhasil dibatalkan.');
    }
  };

  /* ---- Render ---- */

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Booking</h2>
          <p className="text-muted-foreground">
            Kelola semua pemesanan lapangan dengan pencarian dan filter yang komprehensif.
          </p>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <StatCard
                  title="Total"
                  value={stats.total}
                  icon={Calendar}
                  description="Total booking hari ini"
                />
              </m.div>
            </StaggerItem>
            <StaggerItem>
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <StatCard
                  title="Menunggu"
                  value={stats.pending}
                  icon={Clock}
                  description="Belum dibayar / konfirmasi"
                />
              </m.div>
            </StaggerItem>
            <StaggerItem>
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <StatCard
                  title="Aktif"
                  value={stats.confirmed}
                  icon={Users}
                  description="Confirmed & checked-in"
                />
              </m.div>
            </StaggerItem>
            <StaggerItem>
              <m.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <StatCard
                  title="Selesai"
                  value={stats.completed}
                  icon={DollarSign}
                  description="Booking selesai"
                />
              </m.div>
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Filters */}
        <ScrollReveal delay={0.1}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari berdasarkan nama atau nomor telepon..."
                    value={search}
                    onChange={handleSearch}
                    className="pl-9 h-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as '' | BookingStatus)}>
                  <SelectTrigger className="w-full md:w-[180px] h-10">
                    <Filter className="mr-2 h-4 w-4 opacity-50" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_FILTERS.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    min={DATE_MIN}
                    max={DATE_MAX}
                    className="h-10 w-[160px]"
                  />
                </div>

                {/* Clear Filters Button */}
                {(search || statusFilter || dateFilter !== TODAY) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('');
                      setDateFilter(TODAY);
                    }}
                    className="h-10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Bookings List */}
        <ScrollReveal delay={0.1}>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} variant="card" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Tidak Ada Hasil"
              description="Tidak ada booking yang cocok dengan filter yang Anda pilih."
            />
          ) : (
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <StaggerItem key={booking.id}>
                  <BookingCardItem
                    booking={booking}
                    onCheckIn={handleCheckIn}
                    onMarkNoShow={handleMarkNoShow}
                    onCancel={handleCancel}
                    isCheckingIn={checkInMutation.isPending}
                    isMarkingNoShow={markNoShowMutation.isPending}
                    isCancelling={cancelMutation.isPending}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subcomponents                                                             */
/* -------------------------------------------------------------------------- */

interface BookingCardItemProps {
  booking: Booking;
  onCheckIn: (id: string) => void;
  onMarkNoShow: (id: string) => void;
  onCancel: (id: string, confirm: boolean) => void;
  isCheckingIn: boolean;
  isMarkingNoShow: boolean;
  isCancelling: boolean;
}

function BookingCardItem({
  booking,
  onCheckIn,
  onMarkNoShow,
  onCancel,
  isCheckingIn,
  isMarkingNoShow,
  isCancelling,
}: BookingCardItemProps) {
  const canCheckIn = booking.status === 'CONFIRMED';
  const canMarkNoShow = booking.status === 'CONFIRMED';

  // Get court name or fallback
  const courtName = booking.court?.name ?? 'Lapangan Padel';

  return (
    <Card className="overflow-hidden border border-border bg-card">
      {/* Header with ID and status */}
      <CardHeader className="pb-3 px-5 pt-5 border-b border-border bg-muted/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
              #{booking.id.slice(-6).toUpperCase()}
            </span>
            <CardTitle className="mt-1 text-base font-semibold line-clamp-1">
              {courtName}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              • {booking.startTime} - {booking.endTime} ({booking.duration} Min)
            </CardDescription>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
      </CardHeader>

      {/* Customer Info */}
      <CardContent className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{booking.customerName}</p>
            <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-label">Total Biaya</p>
            <p className="font-semibold text-secondary font-mono">
              Rp {booking.totalAmount.toLocaleString('id-ID')}
            </p>
          </div>
          {booking.adminFee > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-label">Admin Fee</p>
              <p className="font-semibold text-foreground font-mono">
                Rp {booking.adminFee.toLocaleString('id-ID')}
              </p>
            </div>
          )}
        </div>

        {/* Is Walk-In Badge */}
        {booking.isWalkIn && (
          <Badge variant="secondary" className="text-[10px]">
            Walk-In
          </Badge>
        )}
      </CardContent>

      {/* Footer with Actions */}
      <CardFooter className="px-5 py-4 pt-3 border-t border-border bg-muted/5 flex items-center justify-end gap-2">
        {/* Check-In Button */}
        {canCheckIn && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onCheckIn(booking.id)}
            disabled={isCheckingIn}
            className="gap-1.5 cursor-pointer"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Check-In
          </Button>
        )}

        {/* Mark No-Show Button */}
        {canMarkNoShow && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onMarkNoShow(booking.id)}
            disabled={isMarkingNoShow}
            className="gap-1.5 cursor-pointer"
          >
            <UserX className="h-3.5 w-3.5" />
            No-Show
          </Button>
        )}

        {/* Cancel Button (for applicable statuses) */}
        {(booking.status === 'PENDING_PAYMENT' ||
          booking.status === 'CONFIRMED' ||
          booking.status === 'HOLD') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(booking.id, true)}
            disabled={isCancelling}
            className="gap-1.5 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
          >
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
