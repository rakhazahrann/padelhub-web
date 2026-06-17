'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import * as m from 'motion/react-m';
import { useMotionValueEvent, useScroll } from 'motion/react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';
import { useUiStore } from '@/stores/use-ui-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { toggleMobileNav } = useUiStore();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

// Hide on admin/super-admin routes (they have their own sidebar layout) and auth routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/super-admin') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  return (
    <m.header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
      initial={{ y: 0 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left: Logo & Nav Links */}
          <div className="flex items-center gap-8 flex-1">
            {/* Hamburger Button for mobile */}
            <button
              type="button"
              onClick={toggleMobileNav}
              className="md:hidden text-foreground hover:text-secondary shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <m.div
                className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-bold text-primary-foreground">P</span>
              </m.div>
              <span className="text-base font-bold tracking-tight">PadelHub</span>
            </Link>

            {/* Desktop Navigation next to Logo */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className={cn(
                  'relative py-1 text-sm font-medium transition-colors hover:text-foreground',
                  pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                Beranda
                {pathname === '/' && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-destructive" />
                )}
              </Link>
              <Link
                href="/venues"
                className={cn(
                  'relative py-1 text-sm font-medium transition-colors hover:text-foreground',
                  pathname.startsWith('/venues') ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                Lapangan
                {pathname.startsWith('/venues') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-destructive" />
                )}
              </Link>
              <Link
                href="/bookings"
                className={cn(
                  'relative py-1 text-sm font-medium transition-colors hover:text-foreground',
                  pathname.startsWith('/bookings') ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                Pesanan
                {pathname.startsWith('/bookings') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-destructive" />
                )}
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">

            {/* Auth / Profile */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="relative outline-none cursor-pointer">
                    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-secondary transition-all">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-[11px] font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </m.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-1.5 rounded-xl border-border/60 shadow-lg">
                    <m.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer rounded-lg">
                        <Link href="/bookings" className="w-full">Pemesanan Saya</Link>
                      </DropdownMenuItem>
                      {user.role === 'ADMIN' && (
                        <DropdownMenuItem className="cursor-pointer rounded-lg">
                          <Link href="/admin/dashboard" className="w-full">Dashboard Admin</Link>
                        </DropdownMenuItem>
                      )}
                      {user.role === 'SUPER_ADMIN' && (
                        <DropdownMenuItem className="cursor-pointer rounded-lg">
                          <Link href="/super-admin/dashboard" className="w-full">Dashboard Super Admin</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={clearAuth} className="text-destructive cursor-pointer rounded-lg">
                        Keluar
                      </DropdownMenuItem>
                    </m.div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Masuk
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="rounded-xl px-4 py-2 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </m.header>
  );
}
