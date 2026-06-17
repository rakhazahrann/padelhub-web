'use client';

import * as m from 'motion/react-m';
import {
  MapPin,
  Shield,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { PageTransition } from '@/components/motion/page-transition';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { reportService } from '@/services/report.service';

import type { LucideIcon } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface StatCardConfig {
  label: string;
  value: number | string;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  iconColor: string;
  iconBg: string;
}

interface RecentActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const STAT_CARDS: StatCardConfig[] = [
  {
    label: 'Total Venue',
    value: 12,
    icon: MapPin,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    label: 'Total Admin',
    value: 8,
    icon: Shield,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  {
    label: 'Total Revenue',
    value: 15000000,
    icon: DollarSign,
    prefix: 'Rp',
    suffix: '',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    label: 'Total Booking',
    value: 156,
    icon: Calendar,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
  },
];

const RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: '1',
    action: 'Venue baru ditambahkan',
    user: 'Admin PadelHub Central',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'success',
  },
  {
    id: '2',
    action: 'Admin baru dibuat',
    user: 'Super Admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: 'info',
  },
  {
    id: '3',
    action: 'Pengaturan konfigurasi diperbarui',
    user: 'Super Admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    type: 'warning',
  },
  {
    id: '4',
    action: 'Admin di-nonaktifkan',
    user: 'Super Admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: 'error',
  },
  {
    id: '5',
    action: 'Laporan bulanan di-generate',
    user: 'Admin Venue A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    type: 'info',
  },
];

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

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  return `${Math.floor(seconds / 86400)} hari lalu`;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SuperAdminDashboardPage() {
  /* ---- Report query ---- */
  const { data: reportResponse, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getReport(),
  });

  const report = reportResponse?.data;

  /* ---- Mock revenue data for chart ---- */
  const revenueData = [
    { date: 'Sen', revenue: 1200000 },
    { date: 'Sel', revenue: 1500000 },
    { date: 'Rab', revenue: 1100000 },
    { date: 'Kam', revenue: 1800000 },
    { date: 'Jum', revenue: 2200000 },
    { date: 'Sab', revenue: 3500000 },
    { date: 'Min', revenue: 3800000 },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Super Admin</h2>
          <p className="text-muted-foreground">
            Ringkasan global untuk semua venue dan admin di sistem PadelHub
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
            {STAT_CARDS.map((card) => {
              const Icon = card.icon;
              
              return (
                <StaggerItem key={card.label}>
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
                          {typeof card.value === 'number' && card.prefix ? (
                            <span className="text-2xl font-bold tracking-tight">
                              {card.prefix}{card.value.toLocaleString('id-ID')}
                            </span>
                          ) : (
                            <AnimatedCounter
                              value={card.value as number}
                              prefix={card.prefix}
                              suffix={card.suffix}
                              className="text-2xl font-bold tracking-tight"
                            />
                          )}
                        </div>
                      </div>
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      >
                        <Icon className={`h-5 w-5 ${card.iconColor}`} />
                      </div>
                    </div>
                  </m.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* Revenue Chart */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Pendapatan Global</h3>
              <p className="text-xs text-muted-foreground">
                Grafik pendapatan semua venue dalam seminggu terakhir
              </p>
            </div>
            <Badge variant="outline">7 Hari</Badge>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={revenueData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradientGlobal"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(217, 91%, 60%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(217, 91%, 60%)"
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
                labelFormatter={(label) => `Hari: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                fill="url(#revenueGradientGlobal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </m.div>

        {/* Recent Activity */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Aktivitas Terbaru</h3>
              <p className="text-xs text-muted-foreground">
                Log aktivitas sistem dari semua venue
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITY.map((activity, index) => (
              <StaggerItem key={activity.id}>
                <m.div
                  className="flex items-start gap-4 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index + 0.1, duration: 0.3 }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      activity.type === 'info' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                      activity.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                      'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {activity.type === 'info' ? (
                      <Shield className="h-5 w-5" />
                    ) : activity.type === 'success' ? (
                      <Calendar className="h-5 w-5" />
                    ) : activity.type === 'warning' ? (
                      <DollarSign className="h-5 w-5" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      oleh {activity.user} • {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </m.div>
              </StaggerItem>
            ))}
          </div>
        </m.div>
      </div>
    </PageTransition>
  );
}
