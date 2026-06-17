'use client';

import { useState } from 'react';
import * as m from 'motion/react-m';
import {
  Settings,
  CreditCard,
  Bell,
  Calendar,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageTransition } from '@/components/motion/page-transition';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface PaymentConfig {
  serverKey: string;
  clientKey: string;
  methods: {
    bankTransfer: boolean;
    creditCard: boolean;
    eWallet: boolean;
    qris: boolean;
  };
}

interface NotificationConfig {
  email: {
    bookingConfirmed: boolean;
    bookingCancelled: boolean;
    paymentReceived: boolean;
    reminder: boolean;
  };
  whatsapp: {
    bookingConfirmed: boolean;
    bookingCancelled: boolean;
    paymentReceived: boolean;
    reminder: boolean;
  };
}

interface BookingConfig {
  maxAdvanceDays: number;
  holdDuration: number;
  minDuration: number;
  maxDuration: number;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SuperAdminConfigPage() {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    serverKey: 'SB-Mid-server-xxxxx',
    clientKey: 'SB-Mid-client-xxxxx',
    methods: {
      bankTransfer: true,
      creditCard: true,
      eWallet: true,
      qris: true,
    },
  });

  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    email: {
      bookingConfirmed: true,
      bookingCancelled: true,
      paymentReceived: true,
      reminder: false,
    },
    whatsapp: {
      bookingConfirmed: true,
      bookingCancelled: false,
      paymentReceived: true,
      reminder: true,
    },
  });

  const [bookingConfig, setBookingConfig] = useState<BookingConfig>({
    maxAdvanceDays: 14,
    holdDuration: 15,
    minDuration: 60,
    maxDuration: 120,
  });

  const [isSaving, setIsSaving] = useState(false);

  /* ---- Save handler ---- */
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Konfigurasi berhasil disimpan');
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Konfigurasi Sistem</h2>
          <p className="text-muted-foreground">
            Kelola pengaturan pembayaran, notifikasi, dan booking untuk seluruh sistem
          </p>
        </div>

        {/* Payment Configuration */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Konfigurasi Pembayaran</h3>
                <p className="text-xs text-muted-foreground">
                  Pengaturan gateway pembayaran Midtrans
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="serverKey">Server Key</Label>
                  <Input
                    id="serverKey"
                    type="password"
                    value={paymentConfig.serverKey}
                    onChange={(e) =>
                      setPaymentConfig((prev) => ({
                        ...prev,
                        serverKey: e.target.value,
                      }))
                    }
                    placeholder="Masukkan Server Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientKey">Client Key</Label>
                  <Input
                    id="clientKey"
                    type="password"
                    value={paymentConfig.clientKey}
                    onChange={(e) =>
                      setPaymentConfig((prev) => ({
                        ...prev,
                        clientKey: e.target.value,
                      }))
                    }
                    placeholder="Masukkan Client Key"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Metode Pembayaran</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(paymentConfig.methods).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          setPaymentConfig((prev) => ({
                            ...prev,
                            methods: {
                              ...prev.methods,
                              [key]: !!checked,
                            },
                          }))
                        }
                      />
                      <span className="text-sm font-medium capitalize">
                        {key === 'bankTransfer'
                          ? 'Transfer Bank'
                          : key === 'creditCard'
                          ? 'Kartu Kredit'
                          : key === 'eWallet'
                          ? 'E-Wallet'
                          : 'QRIS'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Notification Configuration */}
        <ScrollReveal delay={0.2}>
          <div className="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Konfigurasi Notifikasi</h3>
                <p className="text-xs text-muted-foreground">
                  Pengaturan notifikasi email dan WhatsApp
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Email Notifikasi</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(notificationConfig.email).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotificationConfig((prev) => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              [key]: !!checked,
                            },
                          }))
                        }
                      />
                      <span className="text-sm">
                        {key === 'bookingConfirmed'
                          ? 'Booking Dikonfirmasi'
                          : key === 'bookingCancelled'
                          ? 'Booking Dibatalkan'
                          : key === 'paymentReceived'
                          ? 'Pembayaran Diterima'
                          : 'Pengingat Booking'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              {/* WhatsApp Notifications */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">WhatsApp Notifikasi</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(notificationConfig.whatsapp).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotificationConfig((prev) => ({
                            ...prev,
                            whatsapp: {
                              ...prev.whatsapp,
                              [key]: !!checked,
                            },
                          }))
                        }
                      />
                      <span className="text-sm">
                        {key === 'bookingConfirmed'
                          ? 'Booking Dikonfirmasi'
                          : key === 'bookingCancelled'
                          ? 'Booking Dibatalkan'
                          : key === 'paymentReceived'
                          ? 'Pembayaran Diterima'
                          : 'Pengingat Booking'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Booking Configuration */}
        <ScrollReveal delay={0.3}>
          <div className="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Konfigurasi Booking</h3>
                <p className="text-xs text-muted-foreground">
                  Pengaturan aturan pemesanan lapangan
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="maxAdvanceDays">
                  Max Hari ke Depan
                  <span className="ml-1 text-xs text-muted-foreground">(hari)</span>
                </Label>
                <Input
                  id="maxAdvanceDays"
                  type="number"
                  min="1"
                  value={bookingConfig.maxAdvanceDays}
                  onChange={(e) =>
                    setBookingConfig((prev) => ({
                      ...prev,
                      maxAdvanceDays: parseInt(e.target.value) || 14,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="holdDuration">
                  Durasi Hold
                  <span className="ml-1 text-xs text-muted-foreground">(menit)</span>
                </Label>
                <Input
                  id="holdDuration"
                  type="number"
                  min="5"
                  value={bookingConfig.holdDuration}
                  onChange={(e) =>
                    setBookingConfig((prev) => ({
                      ...prev,
                      holdDuration: parseInt(e.target.value) || 15,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minDuration">
                  Durasi Minimum
                  <span className="ml-1 text-xs text-muted-foreground">(menit)</span>
                </Label>
                <Input
                  id="minDuration"
                  type="number"
                  min="30"
                  value={bookingConfig.minDuration}
                  onChange={(e) =>
                    setBookingConfig((prev) => ({
                      ...prev,
                      minDuration: parseInt(e.target.value) || 60,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDuration">
                  Durasi Maximum
                  <span className="ml-1 text-xs text-muted-foreground">(menit)</span>
                </Label>
                <Input
                  id="maxDuration"
                  type="number"
                  min="60"
                  value={bookingConfig.maxDuration}
                  onChange={(e) =>
                    setBookingConfig((prev) => ({
                      ...prev,
                      maxDuration: parseInt(e.target.value) || 120,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
