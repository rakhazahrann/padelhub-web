'use client';

import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

import { PageTransition } from '@/components/motion/page-transition';
import { WalkInWizard } from '@/components/admin/walkin-wizard';
import { Button } from '@/components/ui/button';

export default function AdminWalkInPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Kasir</span>
              <span>›</span>
              <span>Walk-In Booking</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Booking Langsung (Walk-In)</h2>
            <p className="text-muted-foreground">
              Buat pemesanan untuk pelanggan yang datang langsung ke venue.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/admin/bookings')}
            className="gap-2 rounded-xl cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Lihat Booking
          </Button>
        </div>

        {/* Wizard */}
        <WalkInWizard onComplete={() => router.push('/admin/dashboard')} />
      </div>
    </PageTransition>
  );
}
