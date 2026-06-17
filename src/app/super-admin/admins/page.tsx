'use client';

import { useState } from 'react';
import * as m from 'motion/react-m';
import {
  Shield,
  UserPlus,
  Edit,
  UserX,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageTransition } from '@/components/motion/page-transition';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  venueAssignment: string;
  isActive: boolean;
  lastLogin: Date;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const MOCK_ADMINS: Admin[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budi.santoso@padelhub.com',
    role: 'Admin Venue',
    venueAssignment: 'PadelHub Central Jakarta',
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    email: 'siti.rahayu@padelhub.com',
    role: 'Admin Venue',
    venueAssignment: 'PadelHub Selatan',
    isActive: true,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@padelhub.com',
    role: 'Admin Venue',
    venueAssignment: 'PadelHub Timur',
    isActive: false,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatLastLogin(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>(MOCK_ADMINS);
  const [isAdding, setIsAdding] = useState(false);

  /* ---- Actions ---- */
  const handleToggleActive = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)),
    );
    toast.success('Status admin berhasil diubah');
  };

  const handleEdit = (id: string) => {
    toast.info('Fitur edit admin akan segera tersedia');
  };

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      const newAdmin: Admin = {
        id: String(Date.now()),
        name: 'Admin Baru',
        email: 'admin.baru@padelhub.com',
        role: 'Admin Venue',
        venueAssignment: 'Belum ditentukan',
        isActive: true,
        lastLogin: new Date(),
      };
      setAdmins((prev) => [...prev, newAdmin]);
      setIsAdding(false);
      toast.success('Admin baru berhasil ditambahkan');
    }, 500);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Kelola Admin</h2>
            <p className="text-muted-foreground">
              Tambah, edit, dan kelola admin untuk setiap venue
            </p>
          </div>
          <Button onClick={handleAdd} disabled={isAdding}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isAdding ? 'Menambahkan...' : 'Tambah Admin'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
              <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Admin</p>
              <p className="text-xl font-bold">{admins.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Admin Aktif</p>
              <p className="text-xl font-bold">
                {admins.filter((a) => a.isActive).length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/40">
              <UserX className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Admin Nonaktif</p>
              <p className="text-xl font-bold">
                {admins.filter((a) => !a.isActive).length}
              </p>
            </div>
          </div>
        </div>

        {/* Admin List */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <StaggerItem key={admin.id}>
              <m.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5 shadow-sm"
              >
                {/* Header with Avatar */}
                <div className="flex items-start gap-4">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(admin.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{admin.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {admin.email}
                        </p>
                      </div>
                      <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                        {admin.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium">{admin.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="font-medium truncate">{admin.venueAssignment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Last login:</span>
                    <span>{formatLastLogin(admin.lastLogin)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(admin.id)}
                  >
                    <Edit className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant={admin.isActive ? 'destructive' : 'default'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleActive(admin.id)}
                  >
                    <UserX className="mr-1.5 h-3.5 w-3.5" />
                    {admin.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </div>
              </m.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Empty state */}
        {admins.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 ring-1 ring-foreground/5">
            <Shield className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">Belum ada admin</p>
            <p className="text-sm text-muted-foreground">
              Tambahkan admin pertama dengan klik tombol di atas
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
