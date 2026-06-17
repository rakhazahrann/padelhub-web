'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  CreditCard,
  Clock,
  Calendar,
  Save,
  DollarSign,
} from 'lucide-react';

import { PageTransition } from '@/components/motion/page-transition';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface PricingConfig {
  basePrice: number;
  peakSurcharge: number;
  weekendSurcharge: number;
  adminFee: number;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const DEFAULT_PRICING: PricingConfig = {
  basePrice: 200000,
  peakSurcharge: 50000,
  weekendSurcharge: 30000,
  adminFee: 5000,
};

interface PricingPreview {
  label: string;
  sublabel: string;
  price: number;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (key: keyof PricingConfig, value: string) => {
    const numValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setPricing((prev) => ({ ...prev, [key]: numValue }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Pengaturan harga berhasil disimpan!', {
        description: 'Perubahan harga akan berlaku untuk booking baru.',
      });
    }, 500);
  };

  const previewData: PricingPreview[] = [
    {
      label: 'Hari Biasa',
      sublabel: 'Non Peak (08:00-16:00)',
      price: pricing.basePrice,
    },
    {
      label: 'Hari Biasa',
      sublabel: 'Peak (16:00-23:00)',
      price: pricing.basePrice + pricing.peakSurcharge,
    },
    {
      label: 'Weekend',
      sublabel: 'Non Peak (08:00-16:00)',
      price: pricing.basePrice + pricing.weekendSurcharge,
    },
    {
      label: 'Weekend',
      sublabel: 'Peak (16:00-23:00)',
      price: pricing.basePrice + pricing.peakSurcharge + pricing.weekendSurcharge,
    },
  ];

  return (
    <PageTransition className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Harga</h1>
        <p className="text-muted-foreground">
          Atur harga sewa lapangan berdasarkan waktu dan hari
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pricing Form */}
        <ScrollReveal direction="left">
          <Card className="transition-paper">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                  <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle>Konfigurasi Harga</CardTitle>
                  <CardDescription>
                    Sesuaikan parameter harga untuk lapangan
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Base Price */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Harga Dasar per Jam
                </label>
                <Input
                  type="text"
                  value={pricing.basePrice.toLocaleString('id-ID')}
                  onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  placeholder="200.000"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Harga dasar sewa lapangan per jam
                </p>
              </div>

              {/* Peak Surcharge */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Biaya Tambahan Peak Hours (16:00-23:00)
                </label>
                <Input
                  type="text"
                  value={pricing.peakSurcharge.toLocaleString('id-ID')}
                  onChange={(e) => handleInputChange('peakSurcharge', e.target.value)}
                  placeholder="50.000"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Surcharge untuk jam sibuk sore hingga malam
                </p>
              </div>

              {/* Weekend Surcharge */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Biaya Tambahan Weekend (Sabtu-Minggu)
                </label>
                <Input
                  type="text"
                  value={pricing.weekendSurcharge.toLocaleString('id-ID')}
                  onChange={(e) => handleInputChange('weekendSurcharge', e.target.value)}
                  placeholder="30.000"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Surcharge untuk hari Sabtu dan Minggu
                </p>
              </div>

              {/* Admin Fee */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Biaya Admin
                </label>
                <Input
                  type="text"
                  value={pricing.adminFee.toLocaleString('id-ID')}
                  onChange={(e) => handleInputChange('adminFee', e.target.value)}
                  placeholder="5.000"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Biaya administrasi per booking
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setPricing(DEFAULT_PRICING)}
              >
                Reset Default
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </CardFooter>
          </Card>
        </ScrollReveal>

        {/* Pricing Preview */}
        <ScrollReveal direction="right" delay={0.1}>
          <Card className="transition-paper">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Preview Harga</CardTitle>
                  <CardDescription>
                    Simulasi harga berdasarkan konfigurasi di atas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {previewData.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-4',
                      'transition-colors hover:bg-muted/50',
                    )}
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold font-mono">
                        {formatCurrency(item.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">per jam</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Fee Note */}
              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Catatan:</span>
                  <br />
                  Biaya admin sebesar{' '}
                  <span className="font-mono font-medium">
                    {formatCurrency(pricing.adminFee)}
                  </span>{' '}
                  akan ditambahkan ke setiap booking di atas harga sewa lapangan.
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
