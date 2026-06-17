'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  MapPin,
  QrCode,
  RefreshCw,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react';
import * as m from 'motion/react-m';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';

import { useBooking, useCancelBooking } from '@/hooks/use-bookings';
import { useAuthStore } from '@/stores/use-auth-store';
import { BookingStatusBadge } from '@/components/booking/booking-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion';
import { cn, formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: response, isLoading, error } = useBooking(slug);
  const cancelBooking = useCancelBooking();

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const booking = response?.data;

  const isCancellable =
    booking &&
    (booking.status === 'PENDING_PAYMENT' || booking.status === 'CONFIRMED') &&
    !booking.isWalkIn;

  const isOwner =
    booking &&
    user &&
    (user.email === booking.customerEmail ||
      user.phone === booking.customerPhone ||
      user.name === booking.customerName);

  const handleCancel = () => {
    if (!booking) return;
    cancelBooking.mutate(
      { id: booking.id, reason: 'Dibatalkan oleh pelanggan' },
      {
        onSuccess: () => {
          setShowCancelDialog(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <PageTransition className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </PageTransition>
    );
  }

  if (error || !booking) {
    return (
      <PageTransition className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldCheck className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Booking Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Pemesanan yang Anda cari tidak dapat ditemukan. Mungkin telah dihapus atau tautan tidak valid.
          </p>
          <Link href="/bookings">
            <Button className="mt-4">Kembali ke Daftar Pemesanan</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-3xl px-6 py-10">
      <StaggerContainer className="space-y-6">
        {/* Back button */}
        <StaggerItem>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 text-muted-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </StaggerItem>

        {/* Header Card */}
        <StaggerItem>
          <Card className="border border-border bg-card overflow-hidden">
            <div className="bg-gradient-to-r from-secondary/5 to-primary/5 p-6 pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                      ID: #{booking.id.slice(-6).toUpperCase()}
                    </span>
                    <BookingStatusBadge status={booking.status} />
                    {booking.isWalkIn && (
                      <span className="text-[9px] font-label uppercase tracking-wider text-success bg-success/10 px-1.5 py-0.5 rounded-full border border-success/20">
                        Walk-in
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {booking.court?.name || 'Lapangan Padel'}
                  </h1>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Venue Info */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <MapPin className="h-4.5 w-4.5 text-secondary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground font-label uppercase tracking-wider">Venue</p>
                  <p className="font-semibold">{siteConfig.venueName}</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.venueAddress}</p>
                </div>
              </div>

              <Separator />

              {/* Date & Time */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <Calendar className="h-4.5 w-4.5 text-secondary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground font-label uppercase tracking-wider">Tanggal</p>
                    <p className="font-semibold">
                      {format(new Date(booking.bookingDate), 'EEEE, dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <Clock className="h-4.5 w-4.5 text-secondary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground font-label uppercase tracking-wider">Waktu</p>
                    <p className="font-semibold">
                      {booking.startTime} - {booking.endTime} ({booking.duration} Menit)
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <User className="h-4.5 w-4.5 text-secondary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground font-label uppercase tracking-wider">Pelanggan</p>
                  <p className="font-semibold">{booking.customerName}</p>
                  <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                  {booking.customerEmail && (
                    <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                  )}
                </div>
              </div>

              {booking.cancelReason && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <ShieldCheck className="h-4.5 w-4.5 text-destructive" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground font-label uppercase tracking-wider">Alasan Pembatalan</p>
                      <p className="text-sm text-muted-foreground">{booking.cancelReason}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Payment Card */}
        <StaggerItem>
          <Card className="border border-border bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-secondary" />
                <h3 className="font-bold">Informasi Pembayaran</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Sewa</span>
                  <span className="font-mono font-medium">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Admin</span>
                  <span className="font-mono font-medium">{formatCurrency(booking.adminFee)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total Pembayaran</span>
                  <span className="font-mono font-bold text-secondary text-lg">
                    {formatCurrency(booking.totalAmount + booking.adminFee)}
                  </span>
                </div>
              </div>

              {booking.payment?.paymentUrl && (
                <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a href={booking.payment.paymentUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Lanjutkan Pembayaran
                    </Button>
                  </a>
                </m.div>
              )}

              {booking.payment?.qrCodeUrl && (
                <div className="flex justify-center py-2">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={booking.payment.qrCodeUrl}
                      alt="QR Code Pembayaran"
                      className="h-40 w-40 rounded-lg border border-border"
                    />
                    <span className="text-xs text-muted-foreground font-label">Scan QR untuk bayar</span>
                  </div>
                </div>
              )}

              {booking.payment?.virtualAccountNumber && (
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground font-label uppercase tracking-wider mb-1">
                    Nomor Virtual Account
                  </p>
                  <p className="font-mono text-lg font-bold tracking-widest">
                    {booking.payment.virtualAccountNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Actions */}
        <StaggerItem>
          <div className={cn('flex gap-3', isOwner ? 'justify-between' : 'justify-start')}>
            <Link href="/bookings">
              <Button variant="outline" className="gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Semua Pemesanan
              </Button>
            </Link>

            {isCancellable && isOwner && (
              <Button
                variant="outline"
                className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                onClick={() => setShowCancelDialog(true)}
                disabled={cancelBooking.isPending}
              >
                {cancelBooking.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Batalkan Pemesanan'
                )}
              </Button>
            )}
          </div>
        </StaggerItem>
      </StaggerContainer>

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Batalkan Pemesanan?"
        description="Pemesanan yang dibatalkan tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan?"
        confirmLabel="Ya, Batalkan"
        cancelLabel="Tidak, Kembali"
        variant="destructive"
        isLoading={cancelBooking.isPending}
      />
    </PageTransition>
  );
}
