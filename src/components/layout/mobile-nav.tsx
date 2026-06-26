'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, CalendarDays, ClipboardList, MessageCircle, Home, Info, Percent, Star, HelpCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { landingNav } from '@/config/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useUiStore } from '@/stores/use-ui-store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export function MobileNav() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { isMobileNavOpen, setMobileNavOpen } = useUiStore();

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/super-admin') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  const handleClick = (href: string) => {
    setMobileNavOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (pathname === '/') {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  };

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border/60 px-4 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                <span className="text-sm font-bold text-primary-foreground">P</span>
              </div>
              <span className="font-bold tracking-tight">PadelHub</span>
            </SheetTitle>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="rounded-xl p-1.5 hover:bg-muted transition-paper"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </SheetHeader>

        <nav className="flex flex-col gap-0.5 p-2">
          {landingNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => handleClick(item.href)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-paper',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg',
                pathname === item.href ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground',
              )}>
                <item.icon className="h-4 w-4" />
              </div>
              {item.label}
            </Link>
          ))}

          <Separator className="my-1.5" />

          <Link
            href="/venues"
            onClick={() => setMobileNavOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-paper',
              pathname.startsWith('/venues')
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <div className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg',
              pathname.startsWith('/venues') ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground',
            )}>
              <CalendarDays className="h-4 w-4" />
            </div>
            Jadwal Lapangan
          </Link>
          <Link
            href="/bookings"
            onClick={() => setMobileNavOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-paper',
              pathname.startsWith('/bookings')
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <div className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg',
              pathname.startsWith('/bookings') ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground',
            )}>
              <ClipboardList className="h-4 w-4" />
            </div>
            Pemesanan Saya
          </Link>
        </nav>

        <Separator />

        <div className="p-3">
          {isAuthenticated && user ? (
            <>
              <div className="mb-3 rounded-xl bg-muted/60 p-3 border border-border/40">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                
                <Link
                  href="/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="mt-2 block text-xs font-semibold text-secondary hover:underline"
                >
                  Profil →
                </Link>
                
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileNavOpen(false)}
                    className="mt-2 block text-xs font-semibold text-secondary hover:underline"
                  >
                    Dashboard Admin →
                  </Link>
                )}
                {user.role === 'SUPER_ADMIN' && (
                  <div className="mt-2 space-y-1.5 border-t border-border/40 pt-1.5">
                    <Link
                      href="/super-admin/dashboard"
                      onClick={() => setMobileNavOpen(false)}
                      className="block text-xs font-semibold text-secondary hover:underline"
                    >
                      Dashboard Super Admin →
                    </Link>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileNavOpen(false)}
                      className="block text-xs font-semibold text-secondary hover:underline"
                    >
                      Dashboard Admin →
                    </Link>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileNavOpen(false);
                }}
                className="w-full justify-start text-destructive rounded-xl"
              >
                Keluar
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileNavOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl">
                  Masuk
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileNavOpen(false)}>
                <Button className="w-full rounded-xl bg-gradient-to-r from-secondary to-blue-600">Daftar</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
