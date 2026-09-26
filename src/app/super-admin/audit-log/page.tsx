'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/services/api-client';
import * as m from 'motion/react-m';
import {
  ScrollText,
  Search,
  Filter,
  User,
  Clock,
} from 'lucide-react';

import { PageTransition } from '@/components/motion/page-transition';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ActionType = 'Login' | 'Create' | 'Update' | 'Delete';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  userEmail: string;
  action: ActionType;
  details: string;
  target: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */


const ACTION_TYPES: ActionType[] = ['Login', 'Create', 'Update', 'Delete'];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActionBadgeVariant(
  action: ActionType,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (action) {
    case 'Login':
      return 'default';
    case 'Create':
      return 'default';
    case 'Update':
      return 'secondary';
    case 'Delete':
      return 'destructive';
  }
}

function getActionIcon(action: ActionType): string {
  switch (action) {
    case 'Login':
      return '🔑';
    case 'Create':
      return '➕';
    case 'Update':
      return '✏️';
    case 'Delete':
      return '🗑️';
  }
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

export default function SuperAdminAuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  const { data: response } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Array<{ id: string; createdAt: string; action: string; entity: string; entityId: string; actor?: { name?: string | null; email?: string | null } | null; metadata?: unknown }> }>('/audit-logs');
      return data.data;
    },
  });

  const logs: AuditLogEntry[] = (response ?? []).map((log) => ({
    id: log.id,
    timestamp: new Date(log.createdAt),
    user: log.actor?.name || 'System',
    userEmail: log.actor?.email || '-',
    action: log.action.toLowerCase().includes('delete') ? 'Delete' : log.action.toLowerCase().includes('create') ? 'Create' : log.action.toLowerCase().includes('login') ? 'Login' : 'Update',
    details: `${log.action} ${log.entity}`,
    target: `${log.entity} ${log.entityId}`,
  }));

  /* ---- Filter logs ---- */
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = !selectedAction || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-muted-foreground">
            Riwayat aktivitas sistem dari semua pengguna
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari aktivitas, user, atau target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Action filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedAction === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAction(null)}
              >
                Semua
              </Button>
              {ACTION_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={selectedAction === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedAction(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <ScrollText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Log</p>
              <p className="text-xl font-bold">{logs.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Login</p>
              <p className="text-xl font-bold">
                {logs.filter((l) => l.action === 'Login').length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Update</p>
              <p className="text-xl font-bold">
                {logs.filter((l) => l.action === 'Update').length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/40">
              <ScrollText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delete</p>
              <p className="text-xl font-bold">
                {logs.filter((l) => l.action === 'Delete').length}
              </p>
            </div>
          </div>
        </div>

        {/* Log List */}
        <StaggerContainer className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 ring-1 ring-foreground/5">
              <ScrollText className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Tidak ada log</p>
              <p className="text-sm text-muted-foreground">
                Tidak ditemukan aktivitas yang sesuai dengan filter
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <StaggerItem key={log.id}>
                <m.div
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5 shadow-sm transition-colors hover:bg-muted/30"
                  whileHover={{ scale: 1.005 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {/* Avatar */}
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(log.user)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.user}</span>
                          <span className="text-xs text-muted-foreground">
                            ({log.userEmail})
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{log.details}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatTimestamp(log.timestamp)}</span>
                          <span>•</span>
                          <span>Target: {log.target}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          <span className="mr-1">{getActionIcon(log.action)}</span>
                          {log.action}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </m.div>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
