'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Settings,
  MapPin,
  Clock,
  Phone,
  Mail,
  FileText,
  Save,
} from 'lucide-react';

import { PageTransition } from '@/components/motion/page-transition';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface CourtItem {
  id: string;
  name: string;
  type: 'INDOOR' | 'OUTDOOR';
  isActive: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const ALL_AMENITIES = [
  'Indoor & Outdoor Courts',
  'Shower Room',
  'Locker Room',
  'Pro Shop',
  'Cafe',
  'Free Wi-Fi',
  'Parking Area',
] as const;

const DEFAULT_COURTS: CourtItem[] = [
  { id: 'court-1', name: 'Lapangan A', type: 'INDOOR', isActive: true },
  { id: 'court-2', name: 'Lapangan B', type: 'INDOOR', isActive: true },
  { id: 'court-3', name: 'Lapangan C', type: 'OUTDOOR', isActive: true },
  { id: 'court-4', name: 'Lapangan D', type: 'OUTDOOR', isActive: false },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminSettingsPage() {
  /* ---- Venue Info ---- */
  const [venueName, setVenueName] = useState('PadelHub Arena');
  const [address, setAddress] = useState(
    'Jl. Sudirman No. 123, Jakarta Selatan',
  );
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [email, setEmail] = useState('info@padelhub.id');
  const [description, setDescription] = useState(
    'Venue padel premium dengan fasilitas lengkap. Nikmati pengalaman bermain padel terbaik di Jakarta.',
  );

  /* ---- Operating Hours ---- */
  const [openTime, setOpenTime] = useState('07:00');
  const [closeTime, setCloseTime] = useState('23:00');

  /* ---- Amenities ---- */
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Indoor & Outdoor Courts',
    'Shower Room',
    'Locker Room',
    'Cafe',
    'Free Wi-Fi',
    'Parking Area',
  ]);

  /* ---- Courts ---- */
  const [courts, setCourts] = useState<CourtItem[]>(DEFAULT_COURTS);

  /* ---- Handlers ---- */
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const toggleCourtActive = (courtId: string) => {
    setCourts((prev) =>
      prev.map((c) =>
        c.id === courtId ? { ...c, isActive: !c.isActive } : c,
      ),
    );
  };

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan!');
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold tracking-tight">
              Pengaturan Venue
            </h2>
          </div>
          <p className="text-muted-foreground">
            Kelola informasi dan operasional venue
          </p>
        </div>

        {/* Section 1: Informasi Venue */}
        <ScrollReveal delay={0.05}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Informasi Venue
              </CardTitle>
              <CardDescription>
                Data dasar venue yang ditampilkan kepada pelanggan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Venue Name */}
                <div className="space-y-2">
                  <Label htmlFor="venueName" className="flex items-center gap-2 text-sm font-medium">
                    <span>Nama Venue</span>
                  </Label>
                  <Input
                    id="venueName"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="Masukkan nama venue"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Alamat
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                {/* Phone & Email Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Telepon
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+62 xxx-xxxx-xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@venue.com"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi singkat tentang venue..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 2: Jam Operasional */}
        <ScrollReveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Jam Operasional
              </CardTitle>
              <CardDescription>
                Atur waktu buka dan tutup venue setiap hari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openTime" className="text-sm font-medium">
                    Jam Buka
                  </Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime" className="text-sm font-medium">
                    Jam Tutup
                  </Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 3: Fasilitas */}
        <ScrollReveal delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Fasilitas
              </CardTitle>
              <CardDescription>
                Pilih fasilitas yang tersedia di venue Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ALL_AMENITIES.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                        isChecked
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <span className="text-sm font-medium">{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 4: Lapangan */}
        <ScrollReveal delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Lapangan
              </CardTitle>
              <CardDescription>
                Kelola status aktif/nonaktif setiap lapangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className={cn(
                      'rounded-xl border p-4 transition-colors',
                      court.isActive
                        ? 'border-border bg-card'
                        : 'border-border/60 bg-muted/30 opacity-60',
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{court.name}</h4>
                        <Badge
                          variant={
                            court.type === 'INDOOR' ? 'default' : 'secondary'
                          }
                        >
                          {court.type}
                        </Badge>
                      </div>
                      <label className="flex cursor-pointer items-center">
                        <div
                          role="switch"
                          aria-checked={court.isActive}
                          tabIndex={0}
                          onClick={() => toggleCourtActive(court.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleCourtActive(court.id);
                            }
                          }}
                          className={cn(
                            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
                            court.isActive
                              ? 'bg-emerald-500'
                              : 'bg-muted-foreground/25',
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow-sm ring-0 transition-transform',
                              court.isActive
                                ? 'translate-x-4'
                                : 'translate-x-0.5',
                            )}
                          />
                        </div>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {court.isActive ? 'Aktif - dapat dipesan' : 'Nonaktif - tidak tersedia'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Save Button */}
        <ScrollReveal delay={0.25}>
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
