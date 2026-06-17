'use client';

import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { DaySchedule, TimeSlot } from '@/types/court.types';

interface TimeSlotGridProps {
  daySchedule: DaySchedule;
  selectedCourtId: string | null;
  selectedDuration: 60 | 90 | 120;
  selectedStartTime: string | null;
  onSelectSlot: (courtId: string, startTime: string, totalPrice: number) => void;
}

type BlockInfo = {
  courtId: string;
  courtName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  slots: TimeSlot[];
};

export function TimeSlotGrid({
  daySchedule,
  selectedCourtId,
  selectedDuration,
  selectedStartTime,
  onSelectSlot,
}: TimeSlotGridProps) {
  const slotsPerBlock = selectedDuration / 30;

  const validBlocks = React.useMemo(() => {
    const blocks: BlockInfo[] = [];
    const courtData = selectedCourtId
      ? daySchedule.courts.filter((c) => c.court.id === selectedCourtId)
      : daySchedule.courts;

    for (const courtEntry of courtData) {
      const courtSlots = courtEntry.slots;
      for (let i = 0; i <= courtSlots.length - slotsPerBlock; i++) {
        const blockSlots = courtSlots.slice(i, i + slotsPerBlock);

        const isConsecutive = blockSlots.every((slot, idx) => {
          if (idx === 0) return true;
          return slot.startTime === blockSlots[idx - 1].endTime;
        });
        if (!isConsecutive) continue;

        const allAvailable = blockSlots.every((s) => s.status === 'AVAILABLE');
        if (!allAvailable) continue;

        const totalPrice = blockSlots.reduce((sum, s) => sum + s.price, 0);
        const last = blockSlots[blockSlots.length - 1];

        blocks.push({
          courtId: courtEntry.court.id,
          courtName: courtEntry.court.name,
          startTime: blockSlots[0].startTime,
          endTime: last.endTime,
          totalPrice,
          slots: blockSlots,
        });
      }
    }

    return blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [daySchedule, selectedCourtId, slotsPerBlock]);

  const hasMultipleCourts = daySchedule.courts.length > 1 && !selectedCourtId;

  if (validBlocks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="font-medium text-muted-foreground">Tidak ada slot tersedia</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Untuk durasi {selectedDuration} menit pada tanggal ini.
          Silakan coba tanggal atau durasi lain.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      <div className="p-4 border-b border-border/40 bg-muted/10">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Clock className="h-4 w-4 text-secondary" />
          Pilih Jadwal
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        {validBlocks.map((block) => {
          const isSelected =
            selectedCourtId === block.courtId &&
            selectedStartTime === block.startTime;

          return (
            <button
              key={`${block.courtId}-${block.startTime}`}
              onClick={() => onSelectSlot(block.courtId, block.startTime, block.totalPrice)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 transition-all cursor-pointer group text-center',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30',
                isSelected
                  ? 'border-secondary bg-secondary/10 shadow-sm'
                  : 'border-border/60 bg-card text-foreground hover:border-secondary/40 hover:bg-secondary/[0.03] hover:shadow-sm',
              )}
            >
              <span
                className={cn(
                  'text-base font-bold font-mono tracking-tight',
                  isSelected && 'text-secondary',
                )}
              >
                {block.startTime}
              </span>
              <span
                className={cn(
                  'text-xs text-muted-foreground/70 font-mono',
                  isSelected && 'text-secondary/70',
                )}
              >
                {block.endTime}
              </span>

              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium',
                  isSelected
                    ? 'bg-secondary/20 text-secondary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {selectedDuration} menit
              </span>

              <span
                className={cn(
                  'text-sm font-semibold font-mono tracking-tight',
                  isSelected ? 'text-secondary' : 'text-foreground',
                )}
              >
                {formatCurrency(block.totalPrice)}
              </span>

              {hasMultipleCourts && (
                <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wide mt-0.5">
                  {block.courtName}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
