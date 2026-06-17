'use client';

import { useState } from 'react';
import * as m from 'motion/react-m';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  UserX,
  Download,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { PageTransition } from '@/components/motion/page-transition';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { Button } from '@/components/ui/button';
import { reportService } from '@/services/report.service';
import { formatCurrency } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface StatCardConfig {
  label: string;
  key: 'totalRevenue' | 'totalBookings' | 'averageOccupancy' | 'noShowCount';
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
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
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  {
    label: 'Total Booking',
    key: 'totalBookings',
    icon: Calendar,
    prefix: '',
    suffix: '',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    label: 'Rata-rata Okupansi',
    key: 'averageOccupancy',
    icon: TrendingUp,
    prefix: '',
    suffix: '%',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    label: 'No-Show',
    key: 'noShowCount',
    icon: UserX,
    prefix: '',
    suffix: '',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatAxisCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}jt`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}rb`;
  }
  return value.toLocaleString('id-ID');
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminReportsPage() {
  const [range, setRange] = useState<'7' | '30'>('7');

  /* ---- Report query ---- */
  const { data: reportResponse, isLoading } = useQuery({
    queryKey: ['reports', range],
    queryFn: () => reportService.getReport({ range }),
  });

  const report = reportResponse?.data;

  /* ---- Export CSV handler ---- */
  const handleExportCsv = async () => {
    try {
      const blob = await reportService.exportCsv({ range });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-${range}-hari.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Laporan & Analitik
          </h2>
          <p className="text-muted-foreground">
            Pantau performa bisnis venue Anda
          </p>
        </div>

        {/* Date Range Selector & Export */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-lg border border-border bg-card p-1 ring-1 ring-foreground/5">
            <button
              onClick={() => setRange('7')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                range === '7'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setRange('30')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                range === '30'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              30 Hari
            </button>
          </div>

          <Button onClick={handleExportCsv} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stat Cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : (
          report && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STAT_CARDS.map((card) => {
                const Icon = card.icon;
                const value = report[card.key];

                return (
                  <m.div
                    key={card.key}
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
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}
                      >
                        <Icon className={`h-5 w-5 ${card.iconColor}`} />
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          )
        )}

        {/* Revenue Chart */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-base font-semibold">Pendapatan</h3>
              <p className="text-xs text-muted-foreground">
                Grafik pendapatan {range === '7' ? '7' : '30'} hari terakhir
              </p>
            </div>

            {isLoading || !report ? (
              <div className="space-y-3">
                <LoadingSkeleton variant="title" className="h-6 w-32" />
                <div className="h-64 w-full rounded-lg bg-muted animate-pulse" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={report.revenueByDay}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradientBlue"
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
                    tickFormatter={formatAxisCurrency}
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
                      formatCurrency(Number(value)),
                      'Pendapatan',
                    ]}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    fill="url(#revenueGradientBlue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ScrollReveal>

        {/* Occupancy Chart */}
        <ScrollReveal delay={0.2}>
          <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-base font-semibold">Okupansi</h3>
              <p className="text-xs text-muted-foreground">
                Tingkat okupansi {range === '7' ? '7' : '30'} hari terakhir
              </p>
            </div>

            {isLoading || !report ? (
              <div className="space-y-3">
                <LoadingSkeleton variant="title" className="h-6 w-32" />
                <div className="h-64 w-full rounded-lg bg-muted animate-pulse" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={report.occupancyByDay}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
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
                    tickFormatter={(value) => `${value}%`}
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
                    formatter={(value) => [`${value}%`, 'Okupansi']}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                  />
                  <Bar
                    dataKey="occupancyRate"
                    fill="hsl(142, 71%, 45%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
