'use client';

import * as React from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  Info,
  Loader2,
  Phone,
  User,
} from 'lucide-react';
import * as m from 'motion/react-m';
import { toast } from 'sonner';

import { useVenueBySlug } from '@/hooks/use-venues';
import { useAvailability } from '@/hooks/use-availability';
import { useCreateWalkInBooking } from '@/hooks/use-bookings';
import { TimeSlotGrid } from '@/components/booking/time-slot-grid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { cn, formatCurrency } from '@/lib/utils';
import { PaymentMethodSelector, type WalkInPaymentMethod, formatPaymentMethod } from './payment-method-selector';

const MOCK_SLUG = 'padelhub-arena';
const DURATIONS = [60, 120] as const;

type Step = 1 | 2 | 3;

interface BookingFormData {
  customerName: string;
  customerPhone: string;
  paymentMethod: WalkInPaymentMethod;
}

const initialFormData: BookingFormData = {
  customerName: '',
  customerPhone: '',
  paymentMethod: 'CASH',
};

interface WalkInWizardProps {
  onComplete?: () => void;
}

export function WalkInWizard({ onComplete }: WalkInWizardProps) {
  const [step, setStep] = React.useState<Step>(1);
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = React.useState(() => format(today, 'yyyy-MM-dd'));
  const [selectedDuration, setSelectedDuration] = React.useState<60 | 90 | 120>(60);
  const [selectedCourtId, setSelectedCourtId] = React.useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = React.useState<string | null>(null);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [formData, setFormData] = React.useState<BookingFormData>(initialFormData);
  const [createdBookingId, setCreatedBookingId] = React.useState<string | null>(null);

  const { data: venueResp, isLoading: isVenueLoading } = useVenueBySlug(MOCK_SLUG);
  const { data: scheduleResp, isLoading: isSchedLoading } = useAvailability(MOCK_SLUG, selectedDate);
  const createBooking = useCreateWalkInBooking();

  const venue = venueResp?.data;
  const schedule = scheduleResp?.data;
  const courts = venue?.courts || [];

  const selectedCourt = courts.find((c) => c.id === selectedCourtId);

  function resetAll() {
    setSelectedDate(format(today, 'yyyy-MM-dd'));
    setSelectedDuration(60);
    setSelectedCourtId(null);
    setSelectedStartTime(null);
    setTotalPrice(0);
    setFormData(initialFormData);
    setCreatedBookingId(null);
    setStep(1);
  }

  function handleSlotSelect(courtId: string, startTime: string, price: number) {
    setSelectedCourtId(courtId);
    setSelectedStartTime(startTime);
    setTotalPrice(price);
  }

  function handleDateChange(date: Date | undefined) {
    if (date) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
      setSelectedCourtId(null);
      setSelectedStartTime(null);
      setTotalPrice(0);
    }
  }

  function handleFormField(field: keyof BookingFormData, value: string | WalkInPaymentMethod) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!selectedCourtId || !selectedStartTime) return;

    createBooking.mutate(
      {
        courtId: selectedCourtId,
        bookingDate: selectedDate,
        startTime: selectedStartTime,
        duration: selectedDuration,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        paymentMethod: formData.paymentMethod,
      },
      {
        onSuccess: (resp) => {
          if (resp.success) {
            setCreatedBookingId(resp.data.id);
            setStep(3);
            toast.success('Booking walk-in berhasil!');
          }
        },
      },
    );
  }

  function canProceedToStep2(): boolean {
    return !!selectedStartTime && !!selectedCourtId;
  }

  function canProceedToStep3(): boolean {
    return formData.customerName.trim().length >= 2 && formData.customerPhone.trim().length >= 8;
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as Step[]).map((s) => {
          const isActive = step === s;
          const isDone = step > s;
          const labels: Record<Step, string> = { 1: 'Pilih Waktu', 2: 'Data Pelanggan', 3: 'Selesai' };

          return (
            <React.Fragment key={s}>
              {s > 1 && <div className={cn('h-px flex-1', isDone ? 'bg-secondary' : 'bg-border/60')} />}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-paper',
                    isDone && 'border-secondary bg-secondary text-secondary-foreground',
                    isActive && 'border-secondary text-secondary',
                    !isActive && !isDone && 'border-border/60 text-muted-foreground',
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : s}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium hidden sm:inline',
                    isActive && 'text-foreground',
                    !isActive && 'text-muted-foreground',
                  )}
                >
                  {labels[s]}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Schedule Selection */}
      {step === 1 && (
        <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <p className="text-sm text-muted-foreground">Pilih tanggal, durasi, court, dan waktu mulai untuk booking.</p>

          {/* Date + Duration */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 bg-card border border-border/60 rounded-2xl px-4 py-3 shadow-sm">
              <CalendarDays className="h-5 w-5 text-secondary shrink-0" />
              <Popover>
                <PopoverTrigger className="text-sm font-medium text-left outline-none cursor-pointer">
                  {format(new Date(selectedDate), 'EEEE, d MMM yyyy', { locale: id })}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedDate)}
                    onSelect={handleDateChange}
                    disabled={(date) => startOfDay(date) < today || date > addDays(today, 13)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-1.5 bg-card border border-border/60 rounded-2xl p-1.5 shadow-sm">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(d);
                    setSelectedCourtId(null);
                    setSelectedStartTime(null);
                    setTotalPrice(0);
                  }}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-sm font-medium transition-paper cursor-pointer',
                    selectedDuration === d
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {d} mnt
                </button>
              ))}
            </div>
          </div>

          {/* Court tabs */}
          {courts.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {courts.map((court) => (
                <button
                  key={court.id}
                  type="button"
                  onClick={() => { setSelectedCourtId(court.id); setSelectedStartTime(null); setTotalPrice(0); }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-paper whitespace-nowrap cursor-pointer',
                    selectedCourtId === court.id
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-border/60 bg-card text-muted-foreground hover:border-border hover:text-foreground',
                  )}
                >
                  {court.name}
                </button>
              ))}
            </div>
          )}

          {/* Slot Grid */}
          <div className="min-h-[200px]">
            {isSchedLoading ? (
              <LoadingSkeleton variant="calendar" />
            ) : schedule ? (
              <TimeSlotGrid
                daySchedule={schedule}
                selectedCourtId={selectedCourtId}
                selectedDuration={selectedDuration}
                selectedStartTime={selectedStartTime}
                onSelectSlot={handleSlotSelect}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
                <Clock className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="font-medium text-muted-foreground">Pilih tanggal terlebih dahulu</p>
              </div>
            )}
          </div>

          {/* Selected slot summary + Next button */}
          {canProceedToStep2() && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-secondary/5 border border-secondary/20 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                <div className="text-sm">
                  <span className="font-medium">
                    {selectedCourt?.name} — {selectedStartTime}
                  </span>
                  <span className="text-muted-foreground"> ({selectedDuration} menit)</span>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="gap-2 rounded-xl cursor-pointer"
              >
                Lanjut
                <ArrowRight className="h-4 w-4" />
              </Button>
            </m.div>
          )}

          {!canProceedToStep2() && (
            <div className="rounded-2xl border border-dashed border-border/40 bg-card/30 p-5 text-center">
              <Clock className="h-6 w-6 text-muted-foreground/30 mx-auto mb-1" />
              <p className="text-xs font-medium text-muted-foreground">
                Pilih waktu mulai untuk booking
              </p>
            </div>
          )}
        </m.div>
      )}

      {/* Step 2: Customer Info + Payment */}
      {step === 2 && (
        <m.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid gap-6 lg:grid-cols-5"
        >
          {/* Form Column */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-secondary/[0.04] to-primary/[0.02] px-5 py-4 border-b border-border/40">
                <h3 className="font-bold text-sm">Data Pemesan</h3>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nama Lengkap Pemain</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Nama pemain utama"
                      value={formData.customerName}
                      onChange={(e) => handleFormField('customerName', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Nomor Telepon WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={formData.customerPhone}
                      onChange={(e) => handleFormField('customerPhone', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-secondary/[0.04] to-primary/[0.02] px-5 py-4 border-b border-border/40">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-secondary" />
                  Metode Pembayaran
                </h3>
              </div>
              <CardContent className="p-5">
                <PaymentMethodSelector
                  value={formData.paymentMethod}
                  onChange={(m) => handleFormField('paymentMethod', m)}
                  disabled={createBooking.isPending}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary + Confirm Column */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-secondary/[0.04] to-primary/[0.02] px-5 py-4 border-b border-border/40">
                  <h3 className="font-bold text-sm">Ringkasan</h3>
                </div>
                <CardContent className="p-5 space-y-3">
                  <SummaryRow label="Tanggal" value={format(new Date(selectedDate), 'dd MMM yyyy', { locale: id })} />
                  <SummaryRow label="Durasi" value={`${selectedDuration} Menit`} />
                  <SummaryRow label="Lapangan" value={selectedCourt?.name || '-'} />
                  <SummaryRow label="Jam" value={selectedStartTime || '-'} />
                  {formData.customerName && <SummaryRow label="Nama" value={formData.customerName} />}
                  <div className="border-t border-border/40 pt-3 mt-3 space-y-1">
                    <SummaryRow
                      label="Metode Bayar"
                      value={formatPaymentMethod(formData.paymentMethod)}
                    />
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-lg font-bold text-secondary font-mono">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Walk-in, bebas biaya admin
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={createBooking.isPending}
                  className="gap-1.5 rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Kembali
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceedToStep3() || createBooking.isPending}
                  className="flex-1 gap-2 rounded-xl cursor-pointer"
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Konfirmasi Booking
                    </>
                  )}
                </Button>
              </div>

              {!canProceedToStep3() && (
                <div className="rounded-xl bg-accent/40 p-3 flex gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-secondary" />
                  <span>Lengkapi nama dan nomor telepon untuk melanjutkan.</span>
                </div>
              )}
            </div>
          </div>
        </m.div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Booking Berhasil!</h2>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Booking walk-in telah dikonfirmasi. Pelanggan dapat langsung bermain.
          </p>

          <Card className="max-w-sm mx-auto mt-6 border border-border/60 shadow-sm rounded-2xl text-left">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                  <Check className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-label">ID Booking</p>
                  <p className="font-bold font-mono text-sm">#{createdBookingId?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <SummaryRow label="Lapangan" value={selectedCourt?.name || '-'} />
              <SummaryRow label="Tanggal" value={format(new Date(selectedDate), 'dd MMM yyyy', { locale: id })} />
              <SummaryRow label="Jam" value={selectedStartTime || '-'} />
              <SummaryRow label="Durasi" value={`${selectedDuration} Menit`} />
              <SummaryRow label="Pemain" value={formData.customerName} />
              <SummaryRow
                label="Pembayaran"
                value={`${formatPaymentMethod(formData.paymentMethod)} — Lunas`}
              />
              <SummaryRow
                label="Total"
                value={formatCurrency(totalPrice)}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onComplete?.()}
              className="gap-2 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              type="button"
              onClick={resetAll}
              className="gap-2 rounded-xl cursor-pointer"
            >
              <Clock className="h-4 w-4" />
              Booking Lagi
            </Button>
          </div>
        </m.div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
