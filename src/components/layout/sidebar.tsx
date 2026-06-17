'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';
import { useUiStore } from '@/stores/use-ui-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { isSidebarOpen } = useUiStore();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-paper',
        !isSidebarOpen && '-translate-x-full lg:translate-x-0 lg:w-16',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-sm font-bold text-sidebar-primary-foreground">P</span>
        </div>
        {isSidebarOpen && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">PadelHub</span>
            <span className="font-label text-[0.625rem] text-sidebar-foreground/60">{title}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-paper',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                !isSidebarOpen && 'justify-center px-0',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-3">
        <div className={cn('flex items-center gap-3 rounded-lg p-2', !isSidebarOpen && 'justify-center')}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
            {initials}
          </div>
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{user?.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAuth}
          className={cn(
            'mt-1 w-full gap-2 text-sidebar-foreground/70 hover:text-destructive',
            !isSidebarOpen && 'px-0 justify-center',
          )}
        >
          <LogOut className="h-4 w-4" />
          {isSidebarOpen && <span>Keluar</span>}
        </Button>
      </div>
    </aside>
  );
}
