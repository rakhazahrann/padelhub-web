'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import * as m from 'motion/react-m';
import {
  ArrowRight, Calendar, Clock, CreditCard, Shield, Zap, MapPin,
  ChevronRight, Star, CheckCircle2, ChevronDown, Smartphone,
  Users, Target, Play, X, MessageCircle, ChevronLeft, Menu
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageTransition, StaggerContainer, StaggerItem, ScrollReveal } from '@/components/motion';
import { siteConfig } from '@/config/site';

const FEATURES = [
  {
    icon: Calendar, title: 'Jadwal Real-Time',
    description: 'Lihat ketersediaan lapangan secara langsung, tanpa perlu chat admin.',
    color: 'text-secondary', bg: 'bg-secondary/10'
  },
  {
    icon: Zap, title: 'Booking Instan',
    description: 'Pesan lapangan dalam hitungan detik. Slot langsung terkunci untuk Anda.',
    color: 'text-amber-500', bg: 'bg-amber-500/10'
  },
  {
    icon: CreditCard, title: 'Pembayaran Online',
    description: 'Bayar via QRIS atau Virtual Account. Konfirmasi otomatis, tanpa antri.',
    color: 'text-emerald-500', bg: 'bg-emerald-500/10'
  },
  {
    icon: Clock, title: 'Durasi Fleksibel',
    description: 'Pilih durasi bermain: 60, 90, atau 120 menit sesuai kebutuhan.',
    color: 'text-purple-500', bg: 'bg-purple-500/10'
  },
  {
    icon: Shield, title: 'Anti Double Booking',
    description: 'Sistem validasi ketat menjamin slot Anda tidak akan bentrok.',
    color: 'text-red-500', bg: 'bg-red-500/10'
  },
  {
    icon: Smartphone, title: 'Mudah di Mobile',
    description: 'Akses lewat smartphone, booking kapan saja, di mana saja.',
    color: 'text-sky-500', bg: 'bg-sky-500/10'
  },
];

const TESTIMONIALS = [
  { name: 'Budi Santoso', role: 'Pemain Padel Mingguan', avatar: 'BS', rating: 5,
    text: 'Aplikasi keren banget! Gampang cari lapangan, langsung tau jadwal kosong, bayar pun cepet. No ribet!' },
  { name: 'Siti Rahma', role: 'Anggota Club Padel', avatar: 'SR', rating: 5,
    text: 'Suka banget sama sistem booking-nya. Tinggal pilih jam, bayar, langsung dapat konfirmasi. Adminnya juga responsif!' },
  { name: 'Rian Wijaya', role: 'Coach Padel', avatar: 'RW', rating: 4,
    text: 'Fitur kalender real-time sangat membantu. Saya bisa atur jadwal latihan tanpa khawatir double booking.' },
  { name: 'Dewi Lestari', role: 'Pemain Rekreasi', avatar: 'DL', rating: 5,
    text: 'Pertama kali nyoba padel di PadelHub, langsung ketagihan! Proses booking-nya gampang banget.' },
];

const FAQS = [
  { q: 'Bagaimana cara booking lapangan?', a: 'Pilih venue, pilih tanggal dan jam yang tersedia, isi data diri, lalu lakukan pembayaran. Booking akan langsung terkonfirmasi setelah pembayaran berhasil.' },
  { q: 'Berapa durasi minimum dan maksimum?', a: 'Durasi sewa bisa 60, 90, atau 120 menit per sesi, sesuai kebutuhan bermain Anda.' },
  { q: 'Bisa booking berapa hari sebelumnya?', a: 'Booking bisa dilakukan hingga 14 hari ke depan. Slot akan terbuka setiap hari untuk H+14.' },
  { q: 'Apa yang terjadi jika saya telat?', a: 'Harap hadir 10 menit sebelum jadwal. Jika tidak hadir dalam 15 menit setelah jadwal, booking akan dianggap hangus (no-show).' },
  { q: 'Bagaimana cara pembatalan?', a: 'Pembatalan gratis hingga 24 jam sebelum jadwal. Kurang dari 24 jam, biaya tidak dapat dikembalikan.' },
  { q: 'Metode pembayaran apa saja?', a: 'Kami menerima QRIS, Virtual Account, dan berbagai e-wallet melalui Midtrans.' },
];

export default function HomePage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const today = new Date();
  const nextDays = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const availabilityData = [
    { time: '07:00', slots: [true, true, true, true] },
    { time: '09:00', slots: [true, false, true, true] },
    { time: '11:00', slots: [false, false, true, false] },
    { time: '13:00', slots: [true, true, true, true] },
    { time: '15:00', slots: [true, true, false, true] },
    { time: '17:00', slots: [false, true, false, false] },
    { time: '19:00', slots: [true, false, true, true] },
    { time: '21:00', slots: [true, true, true, false] },
  ];

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(`https://wa.me/${siteConfig.venuePhone.replace(/[^0-9]/g, '')}?text=Halo%20PadelHub!%20Saya%20${contactForm.name}%20(${contactForm.email}).%20${contactForm.message}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        <m.div
          className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-accent/40 to-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-6"
              >
                <Play className="h-3.5 w-3.5 fill-secondary" />
                Booking Online
              </m.div>

              <m.h1
                className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Pesan Lapangan{' '}
                <span className="text-secondary">Padel</span>
                <br />
                <span className="text-foreground/80">Tanpa Repot</span>
              </m.h1>

              <m.p
                className="mt-6 text-lg text-muted-foreground md:text-xl max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Cek jadwal langsung, pilih slot favorit, bayar online. 
                Konfirmasi instan tanpa antri dan tanpa chat WhatsApp.
              </m.p>

              <m.div
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link href="/venues">
                  <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg shadow-secondary/20 cursor-pointer">
                    <Calendar className="h-5 w-5" />
                    Lihat Jadwal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="px-8 h-12 text-base cursor-pointer">
                    Buat Akun Gratis
                  </Button>
                </Link>
              </m.div>

              {/* Stats */}
              <m.div
                className="mt-12 flex flex-wrap items-center gap-8 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {[
                  { label: 'Venue Aktif', value: '12+' },
                  { label: 'Booking Selesai', value: '2.5rb+' },
                  { label: 'Rating', value: '4.8' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </m.div>
            </div>

            {/* Right: Interactive Calendar Preview */}
            <m.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-lg p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-foreground">
                    <Calendar className="h-4 w-4 inline mr-2 text-secondary" />
                    Cek Jadwal Langsung
                  </h3>
                  <Link href="/venues" className="text-xs font-medium text-secondary hover:underline">
                    Lihat semua
                  </Link>
                </div>

                {/* Day selector */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  {nextDays.map((day, i) => {
                    const isToday = i === 0;
                    const isSelected = selectedDate === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(i)}
                        className={`flex flex-col items-center min-w-[52px] rounded-xl py-2.5 px-3 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'border-border bg-card text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className={`text-[9px] font-label uppercase ${isSelected ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          {format(day, 'EEE', { locale: id })}
                        </span>
                        <span className="text-lg font-bold mt-0.5">{format(day, 'd')}</span>
                        {isToday && (
                          <span className={`text-[8px] font-bold px-1 py-0.5 rounded-full mt-1 ${
                            isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary/10 text-secondary'
                          }`}>
                            Hari Ini
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Time slots grid */}
                <div className="space-y-1.5">
                  {availabilityData.map((row) => (
                    <div key={row.time} className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-muted-foreground w-10">
                        {row.time}
                      </span>
                      <div className="flex gap-1.5 flex-1">
                        {row.slots.map((available, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all ${
                              available
                                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20'
                                : 'bg-muted/50 text-muted-foreground/40 border border-border/50'
                            }`}
                          >
                            {available ? 'Tersedia' : 'Terisi'}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground w-14 text-right font-mono">
                        {row.slots.filter(Boolean).length}/{row.slots.length}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="h-2.5 w-2.5 rounded bg-emerald-500/30 border border-emerald-500/30" />
                    Tersedia
                    <div className="h-2.5 w-2.5 rounded bg-muted border border-border ml-2" />
                    Terisi
                  </div>
                  <span className="text-xs font-medium text-foreground">4 Lapangan</span>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE CALENDAR (MOBILE) ===== */}
      <section className="lg:hidden border-b border-border py-6 bg-accent/20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="rounded-2xl border border-border bg-card shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-sm">
                  <Calendar className="h-4 w-4 inline mr-1.5 text-secondary" />
                  Cek Jadwal
                </h3>
                <Link href="/venues" className="text-xs font-medium text-secondary">Lihat Semua</Link>
              </div>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {nextDays.slice(0, 5).map((day, i) => (
                  <button key={i} onClick={() => setSelectedDate(i)}
                    className={`flex flex-col items-center min-w-[48px] rounded-lg py-2 px-2.5 border transition-all cursor-pointer ${
                      selectedDate === i ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card'
                    }`}
                  >
                    <span className={`text-[8px] font-label uppercase ${selectedDate === i ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                      {format(day, 'EEE', { locale: id })}
                    </span>
                    <span className="text-base font-bold">{format(day, 'd')}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded bg-emerald-500/40" /> 18 Tersedia</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded bg-muted/60" /> 10 Terisi</span>
                </div>
                <Link href="/venues">
                  <Button size="sm" className="text-xs h-8 cursor-pointer">
                    Pesan Sekarang <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="cara-booking" className="border-b border-border py-20 md:py-28 bg-gradient-to-b from-background to-accent/20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-4">
                <Target className="h-3.5 w-3.5" />
                Cara Booking
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Booking dalam <span className="text-secondary">3 Langkah</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Cepat, mudah, dan tanpa ribet. Begini cara booking lapangan padel di PadelHub.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { step: '01', icon: Calendar, title: 'Pilih Jadwal', desc: 'Lihat ketersediaan lapangan secara real-time. Pilih tanggal dan jam yang Anda inginkan.', color: 'text-secondary', bg: 'bg-secondary/10' },
              { step: '02', icon: Users, title: 'Isi Data Diri', desc: 'Lengkapi informasi pemain utama. Mudah, hanya nama dan nomor WhatsApp.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { step: '03', icon: CreditCard, title: 'Bayar & Main', desc: 'Bayar online via QRIS atau Virtual Account. Konfirmasi otomatis, datang dan main!', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.15}>
                <m.div
                  className="relative rounded-2xl border border-border bg-card p-8 text-center hover:paper-shadow-lg transition-paper group"
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold shadow-sm">
                      {item.step}
                    </span>
                  </div>
                  <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} group-hover:scale-110 transition-transform`}>
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </m.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-4">
                <Zap className="h-3.5 w-3.5" />
                Kenapa PadelHub
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Semua yang Anda <span className="text-secondary">Butuhkan</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Dari cari lapangan sampai main, semuanya dalam satu platform.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <StaggerItem key={feature.title}>
                <m.div
                  className="group rounded-xl border border-border bg-card p-6 transition-paper hover:paper-shadow-md"
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <m.div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg} ${feature.color}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </m.div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </m.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== PROMO SECTION ===== */}
      <section id="promo" className="border-b border-border py-20 md:py-28 bg-gradient-to-b from-accent/20 to-background">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 mb-4">
                <Star className="h-3.5 w-3.5" />
                Promo & Harga
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Harga <span className="text-secondary">Terbaik</span>, Banyak Promo
              </h2>
              <p className="mt-4 text-muted-foreground">
                Dapatkan harga spesial untuk booking di jam tertentu dan hari tertentu.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Weekday Pagi', price: 'Rp 150rb', period: '/jam', desc: 'Senin-Jumat, 07:00-15:59', badge: 'Hemat 25%', popular: false },
              { name: 'Weekday Malam', price: 'Rp 200rb', period: '/jam', desc: 'Senin-Jumat, 16:00-23:00', badge: 'Harga Normal', popular: true },
              { name: 'Weekend', price: 'Rp 250rb', period: '/jam', desc: 'Sabtu-Minggu, 07:00-23:00', badge: 'Weekend Rate', popular: false },
            ].map((pkg, i) => (
              <ScrollReveal key={pkg.name} delay={i * 0.15}>
                <m.div
                  className={`relative rounded-2xl border-2 p-8 transition-paper hover:paper-shadow-lg ${
                    pkg.popular ? 'border-secondary bg-card shadow-md' : 'border-border bg-card'
                  }`}
                  whileHover={{ y: -4 }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-1 text-xs font-bold text-secondary-foreground shadow-sm">
                        <Star className="h-3 w-3" />
                        PALING POPULER
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
                      {pkg.badge}
                    </div>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                      <span className="text-sm text-muted-foreground">{pkg.period}</span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{pkg.desc}</p>
                    <Link href="/venues" className="mt-6 block">
                      <Button className={`w-full ${pkg.popular ? '' : 'variant-outline'}`}>
                        Booking Sekarang
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </m.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonial" className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-4">
                <Star className="h-3.5 w-3.5" />
                Testimonial
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Apa Kata <span className="text-secondary">Mereka</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Pengalaman nyata dari para pemain padel yang sudah booking di PadelHub.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <m.div
                  className="rounded-xl border border-border bg-card p-6 transition-paper hover:paper-shadow-md"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </m.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="border-b border-border py-20 md:py-28 bg-gradient-to-b from-accent/10 to-background">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-4">
                <HelpCircle className="h-3.5 w-3.5" />
                FAQ
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Pertanyaan <span className="text-secondary">Umum</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Temukan jawaban untuk pertanyaan yang sering diajukan.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 space-y-3">
            {FAQS.map((faq, i) => (
              <m.div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden transition-paper hover:paper-shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <m.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </m.div>
                </button>
                <m.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? 'auto' : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </m.div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT / HUBUNGI KAMI ===== */}
      <section id="kontak" className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary mb-4">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Hubungi Kami
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Punya Pertanyaan?{' '}
                  <span className="text-secondary">Chat WhatsApp</span>
                </h2>
                <p className="mt-4 text-muted-foreground max-w-md">
                  Tim kami siap membantu Anda 24/7. Isi form di samping atau langsung chat WhatsApp kami.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    { icon: MapPin, label: 'Alamat', value: siteConfig.venueAddress },
                    { icon: Smartphone, label: 'WhatsApp', value: siteConfig.venuePhone },
                    { icon: MessageCircle, label: 'Email', value: siteConfig.venueEmail },
                  ].map((info) => (
                    <div key={info.label} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-secondary">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                        <p className="text-sm font-medium">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <form onSubmit={handleSubmitContact} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Kirim Pesan</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Nama Anda</label>
                    <Input
                      required
                      placeholder="Nama lengkap"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <Input
                      type="email"
                      required
                      placeholder="email@anda.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Pesan</label>
                    <Textarea
                      required
                      rows={4}
                      placeholder="Tulis pesan Anda..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2 h-12">
                    <MessageCircle className="h-4 w-4" />
                    Kirim via WhatsApp
                  </Button>
                </div>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <m.div
              className="mx-auto max-w-2xl rounded-2xl border border-border bg-primary p-10 text-center text-primary-foreground md:p-14 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <h2 className="text-2xl font-bold md:text-3xl">
                  Siap Main Padel Hari Ini?
                </h2>
                <p className="mt-3 text-primary-foreground/70 max-w-md mx-auto">
                  Daftar gratis sekarang dan nikmati kemudahan booking lapangan padel. Tanpa ribet, tanpa antri.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/register">
                    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="gap-2 px-8 h-12 text-base shadow-lg cursor-pointer"
                      >
                        Daftar Gratis
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </m.div>
                  </Link>
                  <Link href="/venues">
                    <Button variant="outline" size="lg" className="px-8 h-12 text-base border-white/20 text-primary-foreground hover:bg-white/10 cursor-pointer">
                      Lihat Jadwal
                    </Button>
                  </Link>
                </div>
              </div>
            </m.div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">P</span>
                </div>
                <span className="text-lg font-semibold">PadelHub</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Platform booking & manajemen venue padel terpercaya. Main padel jadi lebih mudah dan menyenangkan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Menu</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/venues" className="hover:text-foreground transition-paper">Jadwal Lapangan</Link></li>
                <li><Link href="/#cara-booking" className="hover:text-foreground transition-paper">Cara Booking</Link></li>
                <li><Link href="/#promo" className="hover:text-foreground transition-paper">Promo</Link></li>
                <li><Link href="/#faq" className="hover:text-foreground transition-paper">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Akun</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-foreground transition-paper">Daftar</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-paper">Masuk</Link></li>
                <li><Link href="/bookings" className="hover:text-foreground transition-paper">Pemesanan Saya</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Kontak</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>{siteConfig.venuePhone}</li>
                <li>{siteConfig.venueEmail}</li>
                <li>{siteConfig.venueAddress}</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PadelHub. Hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Follow kami:</span>
              <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-paper">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HelpCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
