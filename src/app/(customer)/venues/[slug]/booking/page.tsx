'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, addDays, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, Clock, Info, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import * as m from 'motion/react-m';

import { useVenueBySlug } from '@/hooks/use-venues';
import { useAvailability } from '@/hooks/use-availability';
import { useCreateBooking } from '@/hooks/use-bookings';
import { useAuthStore } from '@/stores/use-auth-store';

import { BookingForm, TimeSlotGrid, type BookingFormValues } from '@/components/booking';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { PageTransition } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const DURATIONS = [60, 120] as const;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BookingFlowPage({ params }: PageProps) {
  const { slug } = React.use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = React.useState(() => format(today, 'yyyy-MM-dd'));
  const [selectedDuration, setSelectedDuration] = React.useState<60 | 90 | 120>(60);
  const [selectedCourtId, setSelectedCourtId] = React.useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const { data: venueResp, isLoading: isVenueLoading } = useVenueBySlug(slug);
  const { data: scheduleResp, isLoading: isSchedLoading } = useAvailability(slug, selectedDate);
  const createBookingMutation = useCreateBooking();

  const venue = venueResp?.data;
  const schedule = scheduleResp?.data;
  const courts = venue?.courts || [];

  const activeCourtId = selectedCourtId || courts[0]?.id || null;
  const selectedCourt = courts.find((c) => c.id === activeCourtId);

  // Load state from URL parameters on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    const courtParam = params.get('courtId');
    const timeParam = params.get('time');
    const durationParam = params.get('duration');

    /* eslint-disable react-hooks/set-state-in-effect */
    if (dateParam) {
      setSelectedDate(dateParam);
    }
    if (courtParam) {
      setSelectedCourtId(courtParam);
    }
    if (timeParam) {
      setSelectedStartTime(timeParam);
    }
    if (durationParam) {
      const dur = parseInt(durationParam, 10);
      if (dur === 60 || dur === 90 || dur === 120) {
        setSelectedDuration(dur as 60 | 90 | 120);
      }
    }
    if (courtParam && timeParam) {
      setShowForm(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Recalculate total price when schedule loads or selection changes
  const selectedTotalPrice = React.useMemo(() => {
    if (!schedule || !selectedCourtId || !selectedStartTime) return 0;
    const courtEntry = schedule.courts.find((c) => c.court.id === selectedCourtId);
    if (!courtEntry) return 0;

    const slots = courtEntry.slots;
    const selectedIdx = slots.findIndex((s) => s.startTime === selectedStartTime);
    if (selectedIdx === -1) return 0;

    const slotsNeeded = selectedDuration / 30;
    let total = 0;
    for (let i = 0; i < slotsNeeded; i++) {
      const slot = slots[selectedIdx + i];
      if (slot) {
        total += slot.price;
      }
    }
    return total;
  }, [schedule, selectedCourtId, selectedStartTime, selectedDuration]);

  const handleSlotSelect = (courtId: string, startTime: string) => {
    setSelectedCourtId(courtId);
    setSelectedStartTime(startTime);
    setShowForm(true);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
      setSelectedCourtId(null);
      setSelectedStartTime(null);
      setShowForm(false);
    }
  };

  const handleCheckoutSubmit = (formValues: BookingFormValues) => {
    if (!activeCourtId || !selectedStartTime) return;

    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu untuk melanjutkan pembayaran.');
      const redirectUrl = `/venues/${slug}/booking?date=${selectedDate}&courtId=${activeCourtId}&time=${selectedStartTime}&duration=${selectedDuration}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    createBookingMutation.mutate(
      {
        courtId: activeCourtId,
        bookingDate: selectedDate,
        startTime: selectedStartTime,
        duration: selectedDuration,
        customerName: formValues.customerName,
        customerPhone: formValues.customerPhone,
      },
      {
        onSuccess: (resp) => {
          if (resp.success) {
            toast.success('Booking berhasil!');
            router.push(`/bookings/${resp.data.id}`);
          }
        },
      },
    );
  };

  if (isVenueLoading) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-6 py-10 space-y-6">
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="card" />
      </PageTransition>
    );
  }

  if (!venue) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-xl font-bold">Venue tidak ditemukan</h2>
        <p className="text-muted-foreground mt-2">Silakan kembali ke daftar venue.</p>
        <Link href="/venues"><Button className="mt-4 rounded-xl">Kembali</Button></Link>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Header Back */}
      <div className="border-b border-border/40 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>
          <div className="h-4 w-px bg-border/60" />
          <div>
            <h1 className="font-bold text-sm">{venue.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {siteConfig.venueAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Date + Duration Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                onClick={() => { setSelectedDuration(d); setSelectedCourtId(null); setSelectedStartTime(null); setShowForm(false); }}
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

        {/* Two columns: courts grid (left) + form (right) */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Court slots */}
          <div className="lg:col-span-3 space-y-4">
            {isSchedLoading ? (
              <LoadingSkeleton variant="calendar" />
            ) : (
              <>
                {courts.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {courts.map((court) => (
                      <button
                        key={court.id}
                        onClick={() => { setSelectedCourtId(court.id); setSelectedStartTime(null); setShowForm(false); }}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-paper whitespace-nowrap cursor-pointer',
                          activeCourtId === court.id
                            ? 'border-secondary bg-secondary/10 text-secondary'
                            : 'border-border/60 bg-card text-muted-foreground hover:border-border hover:text-foreground',
                        )}
                      >
                        {court.name}
                      </button>
                    ))}
                  </div>
                )}

                {schedule ? (
                  <TimeSlotGrid
                    daySchedule={schedule}
                    selectedCourtId={activeCourtId}
                    selectedDuration={selectedDuration}
                    selectedStartTime={selectedStartTime}
                    onSelectSlot={handleSlotSelect}
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="font-medium text-muted-foreground">Tidak ada slot tersedia</p>
                    <p className="text-sm text-muted-foreground/60">Coba tanggal lain</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right sidebar — summary + form */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Summary card */}
              <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-secondary/4 to-primary/2 px-5 py-4 border-b border-border/40">
                  <h3 className="font-bold text-sm">Ringkasan</h3>
                </div>
                <CardContent className="p-5 space-y-3">
                  <Row label="Tanggal" value={format(new Date(selectedDate), 'dd MMM yyyy', { locale: id })} />
                  <Row label="Durasi" value={`${selectedDuration} Menit`} />
                  <Row label="Lapangan" value={selectedCourt?.name || '-'} />
                  <Row label="Jam" value={selectedStartTime || '-'} />
                  <div className="border-t border-border/40 pt-3 mt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-lg font-bold text-secondary font-mono">
                        {selectedStartTime && selectedTotalPrice > 0
                          ? formatCurrency(selectedTotalPrice + 5000)
                          : formatCurrency(0)}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Termasuk biaya admin Rp5.000</p>
                  </div>
                </CardContent>
              </Card>

              {/* Form */}
              {showForm && activeCourtId && selectedStartTime ? (
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-br from-secondary/4 to-primary/2 px-5 py-4 border-b border-border/40">
                      <h3 className="font-bold text-sm">Data Pemesan</h3>
                    </div>
                    <CardContent className="p-5 relative">
                      {!isAuthenticated && (
                        <>
                          {/* Overlay untuk blur background */}
                          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center" />
                          
                          {/* Alert card yang overlap - clickable */}
                          <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                            <div className="w-full max-w-xs rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-4 shadow-lg ring-1 ring-blue-900/10 pointer-events-auto text-center">
                              <div className="flex flex-col gap-2">
                                <div className="rounded-full bg-white/20 p-1.5 inline-flex self-center">
                                  <AlertCircle className="h-4 w-4 text-white" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-xs font-semibold text-white">Perlu Login</p>
                                  <p className="text-[10px] text-white/80 leading-tight">
                                    Login untuk lanjut booking & simpan riwayat
                                  </p>
                                </div>
                                <Link
                                  href={`/login?redirect=/venues/${slug}/booking`}
                                  className="shrink-0 pointer-events-auto mt-1"
                                >
                                  <Button 
                                    size="sm" 
                                    className="bg-white hover:bg-gray-100 text-blue-700 font-semibold shadow-md text-xs py-1.5 px-4 h-auto"
                                  >
                                    Login Sekarang
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                          
                          <div className="rounded-xl bg-accent/40 p-3 flex gap-2 text-xs text-secondary-foreground border border-accent mt-4 pointer-events-none select-none">
                            <Info className="h-4 w-4 shrink-0 mt-0.5 text-secondary" />
                            <span>
                              Atau, Anda bisa{' '}
                              <Link href={`/login?redirect=/venues/${slug}/booking`} className="underline font-bold">
                                login
                              </Link>{' '}
                              untuk simpan riwayat booking.
                            </span>
                          </div>
                        </>
                      )}

                      {isAuthenticated && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex gap-2 text-xs text-emerald-800 mb-4">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                          <span>
                            Data telah otomatis terisi dari profil Anda.{' '}
                            <Link href={`/login?redirect=/venues/${slug}/booking`} className="underline font-bold">
                              Edit profil
                            </Link>{' '}
                            jika diperlukan.
                          </span>
                        </div>
                      )}
                      <BookingForm
                        defaultValues={{ customerName: user?.name || '', customerPhone: user?.phone || '' }}
                        onSubmit={handleCheckoutSubmit}
                        isLoading={createBookingMutation.isPending}
                      />
                    </CardContent>
                  </Card>
                </m.div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/40 bg-card/30 p-5 text-center">
                  <Clock className="h-6 w-6 text-muted-foreground/30 mx-auto mb-1" />
                  <p className="text-xs font-medium text-muted-foreground">Pilih slot untuk booking</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
