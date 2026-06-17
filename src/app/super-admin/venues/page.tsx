'use client';

import { useState } from 'react';
import * as m from 'motion/react-m';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageTransition } from '@/components/motion/page-transition';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Venue {
  id: string;
  name: string;
  address: string;
  courtCount: number;
  isActive: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const MOCK_VENUES: Venue[] = [
  {
    id: '1',
    name: 'PadelHub Central Jakarta',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    courtCount: 8,
    isActive: true,
  },
  {
    id: '2',
    name: 'PadelHub Selatan',
    address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
    courtCount: 6,
    isActive: true,
  },
  {
    id: '3',
    name: 'PadelHub Barat',
    address: 'Jl. Puri Indah No. 78, Jakarta Barat',
    courtCount: 4,
    isActive: false,
  },
  {
    id: '4',
    name: 'PadelHub Timur',
    address: 'Jl. Bekasi Raya No. 90, Bekasi',
    courtCount: 5,
    isActive: true,
  },
  {
    id: '5',
    name: 'PadelHub Utara',
    address: 'Jl. Kelapa Gading Blvd No. 56, Jakarta Utara',
    courtCount: 3,
    isActive: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SuperAdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [isAdding, setIsAdding] = useState(false);

  /* ---- Actions ---- */
  const handleToggleActive = (id: string) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)),
    );
    toast.success('Status venue berhasil diubah');
  };

  const handleDelete = (id: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
    toast.success('Venue berhasil dihapus');
  };

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      const newVenue: Venue = {
        id: String(Date.now()),
        name: 'Venue Baru',
        address: 'Alamat belum ditentukan',
        courtCount: 4,
        isActive: true,
      };
      setVenues((prev) => [...prev, newVenue]);
      setIsAdding(false);
      toast.success('Venue baru berhasil ditambahkan');
    }, 500);
  };

  const handleEdit = (id: string) => {
    toast.info('Fitur edit akan segera tersedia');
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Kelola Venue</h2>
            <p className="text-muted-foreground">
              Tambah, edit, dan kelola semua venue di sistem PadelHub
            </p>
          </div>
          <Button onClick={handleAdd} disabled={isAdding}>
            <Plus className="mr-2 h-4 w-4" />
            {isAdding ? 'Menambahkan...' : 'Tambah Venue'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Venue</p>
              <p className="text-xl font-bold">{venues.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
              <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Venue Aktif</p>
              <p className="text-xl font-bold">
                {venues.filter((v) => v.isActive).length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/40">
              <MapPin className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Venue Nonaktif</p>
              <p className="text-xl font-bold">
                {venues.filter((v) => !v.isActive).length}
              </p>
            </div>
          </div>
        </div>

        {/* Venue List */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <StaggerItem key={venue.id}>
              <m.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        venue.isActive
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{venue.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {venue.address}
                      </p>
                    </div>
                  </div>
                  <Badge variant={venue.isActive ? 'default' : 'secondary'}>
                    {venue.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Lapangan:</span>
                  <span className="font-medium">{venue.courtCount}</span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(venue.id)}
                  >
                    <Edit className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleActive(venue.id)}
                  >
                    <ToggleLeft className="mr-1.5 h-3.5 w-3.5" />
                    {venue.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(venue.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </m.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Empty state */}
        {venues.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 ring-1 ring-foreground/5">
            <MapPin className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">Belum ada venue</p>
            <p className="text-sm text-muted-foreground">
              Tambahkan venue pertama Anda dengan klik tombol di atas
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
