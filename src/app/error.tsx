'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background text-foreground">
      <div className="text-center">
        <p className="font-label text-destructive">Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Terjadi kesalahan
        </h1>
        <p className="mt-4 text-muted-foreground">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
        </p>
        <div className="mt-8">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
