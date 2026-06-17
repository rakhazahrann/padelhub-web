import { cn, formatCurrency } from '@/lib/utils';
import type { TimeSlot } from '@/types/court.types';

interface SlotCellProps {
  slot: TimeSlot;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function SlotCell({
  slot,
  isSelected,
  onClick,
  disabled = false,
}: SlotCellProps) {
  const isAvailable = slot.status === 'AVAILABLE' && !disabled;
  const isBooked = slot.status === 'BOOKED';
  const isHold = slot.status === 'HOLD';
  const isMaintenance = slot.status === 'MAINTENANCE';

  return (
    <button
      type="button"
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl p-3 h-20 w-full border text-center transition-paper font-sans',
        isAvailable
          ? isSelected
            ? 'border-secondary bg-secondary text-secondary-foreground shadow-sm scale-[0.98]'
            : 'border-border bg-card text-foreground hover:border-secondary hover:bg-accent/40 hover:text-secondary cursor-pointer'
          : 'border-border bg-muted/50 text-muted-foreground/60 cursor-not-allowed'
      )}
    >
      <span className="text-xs font-bold font-mono tracking-tight">
        {slot.startTime}
      </span>

      {isAvailable && (
        <span className={cn('text-[10px] font-semibold mt-1 font-mono', isSelected ? 'text-secondary-foreground/85' : 'text-muted-foreground')}>
          {formatCurrency(slot.price)}
        </span>
      )}

      {isBooked && (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground/50 mt-1 uppercase font-label">
          Terisi
        </span>
      )}

      {isHold && (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-warning/15 text-warning/70 mt-1 uppercase font-label">
          Hold
        </span>
      )}

      {isMaintenance && (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive/50 mt-1 uppercase font-label">
          Maint
        </span>
      )}
    </button>
  );
}
