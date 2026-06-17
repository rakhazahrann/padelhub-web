import type { BookingStatus } from '@/types/booking.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const statusConfig: Record<
    BookingStatus,
    { label: string; className: string }
  > = {
    HOLD: {
      label: 'Hold Sesi',
      className: 'bg-warning/15 text-warning border-warning/20',
    },
    PENDING_PAYMENT: {
      label: 'Menunggu Bayar',
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    CONFIRMED: {
      label: 'Dikonfirmasi',
      className: 'bg-secondary/10 text-secondary border-secondary/20',
    },
    CHECKED_IN: {
      label: 'Sudah Hadir',
      className: 'bg-success/10 text-success border-success/20',
    },
    COMPLETED: {
      label: 'Selesai',
      className: 'bg-success/15 text-success border-success/30',
    },
    CANCELLED: {
      label: 'Dibatalkan',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    NO_SHOW: {
      label: 'Tidak Hadir',
      className: 'bg-destructive/15 text-destructive border-destructive/30',
    },
    EXPIRED: {
      label: 'Kedaluwarsa',
      className: 'bg-muted text-muted-foreground border-border',
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge
      variant="outline"
      className={cn('font-label text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
