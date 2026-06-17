'use client';

import * as m from 'motion/react-m';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  UserX,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { PageTransition } from '@/components/motion/page-transition';
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/stagger-container';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { reportService } from '@/services/report.service';
import { useBookings } from '@/hooks/use-bookings';
import { queryKeys } from '@/lib/query-keys';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/booking.types';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface StatCardConfig {
  label: string;
  key: 'totalRevenue' | 'totalBookings' | 'averageOccupancy' | 'noShowCount';
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  trend: number;
  trendLabel: string;
  iconColor: string;
  iconBg: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const STAT_CARDS: StatCardConfig[] = [
  {
    label: 'Total Revenue',
    key: 'totalRevenue',
    icon: DollarSign,
    prefix: 'Rp',
    suffix: '',
    trend: 12.5,
    trendLabel: 'vs minggu lalu',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  {
    label: 'Total Booking',
    key: 'totalBookings',
    icon: Calendar,
    prefix: '',
    suffix: '',
    trend: 8.2,
    trendLabel: 'vs minggu lalu',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    label: 'Rata-rata Okupansi',
    key: 'averageOccupancy',
    icon: TrendingUp,
    prefix: '',
    suffix: '%',
    trend: -2.4,
    trendLabel: 'vs minggu lalu',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    label: 'No-Show',
    key: 'noShowCount',
    icon: UserX,
    prefix: '',
    suffix: '',
    trend: -15.0,
    trendLabel: 'vs minggu lalu',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
  },
];

const STATUS_VARIANTS: Record<
  BookingStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  HOLD: 'outline',
  PENDING_PAYMENT: 'outline',
  CONFIRMED: 'default',
  CHECKED_IN: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
  NO_SHOW: 'destructive',
  EXPIRED: 'destructive',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  HOLD: 'Ditahan',
  PENDING_PAYMENT: 'Menunggu Bayar',
  CONFIRMED: 'Dikonfirmasi',
  CHECKED_IN: 'Check-In',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  NO_SHOW: 'No-Show',
  EXPIRED: 'Kadaluarsa',
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}jt`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}rb`;
  }
  return value.toLocaleString('id-ID');
}

function TrendIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium',
        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
      )}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {Math.abs(value)}%
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminDashboardPage() {
  /* ---- Report query ---- */
  const { data: reportResponse, isLoading: reportLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getReport(),
  });

  const report = reportResponse?.data;

  /* ---- Bookings query ---- */
  const { data: bookingsResponse, isLoading: bookingsLoading } = useBookings();
  const recentBookings: Booking[] = (bookingsResponse?.data ?? []).slice(0, 5);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Ringkasan performa venue dan pemesanan hari ini.
          </p>
        </div>

        {/* Stat Cards */}
        {reportLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          report && (
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STAT_CARDS.map((card) => {
                const Icon = card.icon;
                const value = report[card.key];

                return (
                  <StaggerItem key={card.key}>
                    <m.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            {card.label}
                          </p>
                          <div className="flex items-baseline gap-1">
                            {card.key === 'totalRevenue' ? (
                              <span className="text-2xl font-bold tracking-tight">
                                Rp{' '}
                                <AnimatedCounter
                                  value={value as number}
                                  className="inline"
                                />
                              </span>
                            ) : (
                              <AnimatedCounter
                                value={value as number}
                                prefix={card.prefix}
                                suffix={card.suffix}
                                className="text-2xl font-bold tracking-tight"
                              />
                            )}
                          </div>
                        </div>
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                            card.iconBg,
                          )}
                        >
                          <Icon className={cn('h-5 w-5', card.iconColor)} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendIndicator value={card.trend} />
                        <span className="text-xs text-muted-foreground">
                          {card.trendLabel}
                        </span>
                      </div>
                    </m.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )
        )}

        {/* Revenue Chart */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Pendapatan</h3>
                <p className="text-xs text-muted-foreground">
                  Grafik pendapatan 7 hari terakhir
                </p>
              </div>
              <Badge variant="outline">7 Hari</Badge>
            </div>

            {reportLoading || !report ? (
              <div className="space-y-3">
                <LoadingSkeleton variant="title" className="h-6 w-32" />
                <div className="h-64 w-full rounded-lg bg-muted animate-pulse" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={report.revenueByDay}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1, 217 91% 60%))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1, 217 91% 60%))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(v: number) => formatCurrency(v)}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                      color: 'hsl(var(--popover-foreground))',
                      fontSize: '0.75rem',
                    }}
                    formatter={(value) => [
                      `Rp ${Number(value).toLocaleString('id-ID')}`,
                      'Pendapatan',
                    ]}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1, 217 91% 60%))"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ScrollReveal>

        {/* Recent Bookings */}
        <ScrollReveal delay={0.2}>
          <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Booking Terbaru</h3>
                <p className="text-xs text-muted-foreground">
                  5 pemesanan terakhir
                </p>
              </div>
              <Badge variant="outline">Hari Ini</Badge>
            </div>

            {bookingsLoading ? (
              <LoadingSkeleton variant="table" rows={5} />
            ) : recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Calendar className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Belum ada pemesanan hari ini.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Lapangan</TableHead>
                    <TableHead>Tanggal & Waktu</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.customerPhone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.court?.name ?? 'Lapangan'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(booking.bookingDate).toLocaleDateString(
                              'id-ID',
                              { day: 'numeric', month: 'short', year: 'numeric' },
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.startTime} – {booking.endTime}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          Rp {booking.totalAmount.toLocaleString('id-ID')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[booking.status]}>
                          {STATUS_LABELS[booking.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
