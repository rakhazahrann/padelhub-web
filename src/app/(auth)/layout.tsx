import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-base font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">PadelHub</span>
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 md:paper-shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

