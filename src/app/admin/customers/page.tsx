'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  CreditCard,
} from 'lucide-react';

import { PageTransition } from '@/components/motion/page-transition';
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/stagger-container';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatShortDate } from '@/lib/utils';

import type { Booking } from '@/types/booking.types';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface CustomerProfile {
  key: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('padelhub_bookings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function buildCustomerProfiles(bookings: Booking[]): CustomerProfile[] {
  const map = new Map<string, CustomerProfile>();

  bookings.forEach((booking) => {
    const key = booking.customerEmail || booking.customerPhone || booking.customerName;

    if (!map.has(key)) {
      map.set(key, {
        key,
        name: booking.customerName,
        email: booking.customerEmail || '-',
        phone: booking.customerPhone || '-',
        totalBookings: 0,
        totalSpent: 0,
        lastBookingDate: booking.bookingDate,
      });
    }

    const profile = map.get(key)!;
    profile.totalBookings += 1;
    profile.totalSpent += booking.totalAmount + booking.adminFee;

    if (new Date(booking.bookingDate) > new Date(profile.lastBookingDate)) {
      profile.lastBookingDate = booking.bookingDate;
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastBookingDate).getTime() - new Date(a.lastBookingDate).getTime(),
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const bookings = getStoredBookings();
      const profiles = buildCustomerProfiles(bookings);
      setCustomers(profiles);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [customers, searchQuery]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const activeThisMonth = customers.filter((c) => {
      const d = new Date(c.lastBookingDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return {
      total: customers.length,
      activeThisMonth,
      totalRevenue,
    };
  }, [customers]);

  return (
    <PageTransition className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Pelanggan</h1>
        <p className="text-muted-foreground">Kelola data pelanggan PadelHub</p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
          <LoadingSkeleton variant="title" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <StaggerContainer className="grid gap-4 md:grid-cols-3">
            <StaggerItem>
              <StatCard
                title="Total Pelanggan"
                value={stats.total}
                icon={Users}
                description="Pelanggan terdaftar"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Aktif Bulan Ini"
                value={stats.activeThisMonth}
                icon={Calendar}
                description="Pelanggan dengan booking bulan ini"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={CreditCard}
                description="Dari seluruh pelanggan"
              />
            </StaggerItem>
          </StaggerContainer>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, email, atau telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Customer Grid */}
          {filteredCustomers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Tidak ada pelanggan ditemukan"
              description={
                searchQuery
                  ? `Tidak ada pelanggan dengan kata kunci "${searchQuery}"`
                  : 'Belum ada pelanggan yang terdaftar dalam sistem'
              }
            />
          ) : (
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCustomers.map((customer) => (
                <StaggerItem key={customer.key}>
                  <CustomerCard customer={customer} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </>
      )}
    </PageTransition>
  );
}

/* -------------------------------------------------------------------------- */
/*  Customer Card                                                             */
/* -------------------------------------------------------------------------- */

function CustomerCard({ customer }: { customer: CustomerProfile }) {
  return (
    <Card className="transition-paper hover:paper-shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{customer.name}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">
              {customer.email !== '-' ? customer.email : customer.phone}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Total Booking</p>
            <p className="text-lg font-bold">{customer.totalBookings}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Total Spent</p>
            <p className="text-lg font-bold">{formatCurrency(customer.totalSpent)}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {customer.email !== '-' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.phone !== '-' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{customer.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Booking terakhir: {formatShortDate(customer.lastBookingDate)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
}
