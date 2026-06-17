import type { Metadata } from 'next';

import { Poppins } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { MotionProvider } from '@/providers/motion-provider';
import { Navbar, MobileNav, Footer } from '@/components/layout';

import './globals.css';

const poppins = Poppins({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PadelHub — Booking & Manajemen Venue Padel',
    template: '%s | PadelHub',
  },
  description:
    'Platform booking & manajemen venue olahraga padel terpercaya. Pesan lapangan padel secara online dengan mudah dan cepat.',
  keywords: ['padel', 'booking', 'lapangan', 'venue', 'olahraga', 'PadelHub'],
  openGraph: {
    title: 'PadelHub — Booking & Manajemen Venue Padel',
    description:
      'Platform booking & manajemen venue olahraga padel terpercaya.',
    url: 'https://padelhub.id',
    siteName: 'PadelHub',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <MotionProvider>
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>
                <Navbar />
                <MobileNav />
                {children}
                <Footer />
                <Toaster position="top-right" richColors />
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
