'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/config/site';

export function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/super-admin') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">P</span>
          </div>
          <span className="text-sm font-medium">{siteConfig.name}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/venues"
            className="text-sm text-muted-foreground transition-paper hover:text-foreground"
          >
            Jadwal Lapangan
          </Link>
          <Link
            href={siteConfig.links.instagram}
            target="_blank"
            rel={siteConfig.links.instagram.startsWith('/') ? undefined : "noopener noreferrer"}
            className="text-sm text-muted-foreground transition-paper hover:text-foreground"
          >
            Instagram
          </Link>
          <Link
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel={siteConfig.links.whatsapp.startsWith('/') ? undefined : "noopener noreferrer"}
            className="text-sm text-muted-foreground transition-paper hover:text-foreground"
          >
            WhatsApp
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
