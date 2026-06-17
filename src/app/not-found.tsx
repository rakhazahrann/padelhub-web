import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background text-foreground">
      <div className="text-center">
        <p className="font-label text-secondary">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
