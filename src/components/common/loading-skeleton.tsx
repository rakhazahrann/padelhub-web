import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn('rounded-xl border border-border p-6 space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function TableSkeleton({ className, rows = 5 }: LoadingSkeletonProps & { rows?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function CalendarSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 32 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

interface UnifiedSkeletonProps {
  variant: 'card' | 'table' | 'calendar' | 'title';
  className?: string;
  rows?: number;
}

export function LoadingSkeleton({ variant, className, rows }: UnifiedSkeletonProps) {
  if (variant === 'card') return <CardSkeleton className={className} />;
  if (variant === 'table') return <TableSkeleton className={className} rows={rows} />;
  if (variant === 'calendar') return <CalendarSkeleton className={className} />;
  if (variant === 'title') {
    return <Skeleton className={cn('h-8 w-64 rounded-md', className)} />;
  }
  return <Skeleton className={cn('h-4 w-full rounded-md', className)} />;
}

