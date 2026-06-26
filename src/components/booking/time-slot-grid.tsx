'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { DaySchedule, TimeSlot } from '@/types/court.types';

interface TimeSlotGridProps {
  daySchedule: DaySchedule;
  selectedCourtId: string | null;
  selectedDuration: 60 | 90 | 120;
  selectedStartTime: string | null;
  onSelectSlot: (courtId: string, startTime: string, totalPrice: number) => void;
}

function isPeakHour(startTime: string): boolean {
  const s = parseInt(startTime.split(':')[0], 10);
  return s >= 16;
}

export function TimeSlotGrid({
  daySchedule,
  selectedCourtId,
  selectedDuration,
  selectedStartTime,
  onSelectSlot,
}: TimeSlotGridProps) {
  const activeCourtId = selectedCourtId || daySchedule.courts[0]?.court.id || null;
  const courtEntry = daySchedule.courts.find((c) => c.court.id === activeCourtId);
  const slots = courtEntry?.slots || [];

  const slotsPerBlock = selectedDuration / 30;
  const selectedIdx = selectedStartTime
    ? slots.findIndex((s) => s.startTime === selectedStartTime)
    : -1;

  const isSlotSelected = (idx: number): boolean => {
    if (selectedIdx === -1) return false;
    return idx >= selectedIdx && idx < selectedIdx + slotsPerBlock;
  };

  // Helper to check if a sequence of slots is available starting from a given slot index
  const isSequenceAvailable = React.useCallback(
    (courtSlots: TimeSlot[], startIndex: number, durationMin: number): boolean => {
      const slotsNeeded = durationMin / 30;
      
      // Check if we would go out of bounds
      if (startIndex + slotsNeeded > courtSlots.length) {
        return false;
      }

      // Check if all slots in the sequence are AVAILABLE and consecutive
      for (let i = 0; i < slotsNeeded; i++) {
        const slot = courtSlots[startIndex + i];
        if (slot.status !== 'AVAILABLE') {
          return false;
        }
        
        if (i > 0) {
          const prevSlot = courtSlots[startIndex + i - 1];
          if (slot.startTime !== prevSlot.endTime) {
            return false;
          }
        }
      }

      return true;
    },
    []
  );

  // Helper to calculate total price of a sequence of slots starting from startIndex
  const calculateBlockPrice = React.useCallback(
    (courtSlots: TimeSlot[], startIndex: number, durationMin: number): number => {
      const slotsNeeded = durationMin / 30;
      let total = 0;
      for (let i = 0; i < slotsNeeded; i++) {
        total += courtSlots[startIndex + i]?.price || 0;
      }
      return total;
    },
    []
  );

  if (slots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/50 p-10 text-center bg-card/20">
        <AlertCircle className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
        <p className="font-medium text-muted-foreground text-sm">Tidak ada slot tersedia</p>
        <p className="text-xs text-muted-foreground/50 mt-1">
          Coba pilih lapangan atau tanggal lain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Pilih Jadwal
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {slots.length} waktu
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
        {slots.map((slot, idx) => {
          if (!slot.startTime.endsWith(':00')) return null;

          const isAvail = isSequenceAvailable(slots, idx, selectedDuration);
          const totalPrice = isAvail ? calculateBlockPrice(slots, idx, selectedDuration) : 0;
          const blockPrice = calculateBlockPrice(slots, idx, selectedDuration);
          const isSelected = isSlotSelected(idx);
          const peak = isPeakHour(slot.startTime);

          return (
            <button
              key={slot.startTime}
              disabled={!isAvail && !isSelected}
              onClick={() => {
                if (isAvail && activeCourtId) {
                  onSelectSlot(activeCourtId, slot.startTime, totalPrice);
                }
              }}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg py-2 px-1 border text-center transition-paper h-12',
                isAvail || isSelected
                  ? isSelected
                    ? 'border-secondary bg-secondary text-secondary-foreground shadow-sm cursor-pointer'
                    : 'border-success/30 bg-success/5 text-success hover:bg-success/10 cursor-pointer hover:-translate-y-0.5 transition-all duration-200'
                  : 'border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed',
              )}
            >
              {peak && (isAvail || isSelected) && (
                <span
                  title="Peak Hour"
                  className={cn(
                    'absolute top-1 right-1 w-1 h-1 rounded-full',
                    isSelected ? 'bg-white' : 'bg-warning',
                  )}
                />
              )}

              <span
                className={cn(
                  'text-[11px] font-bold font-mono',
                  !isAvail && !isSelected && 'line-through',
                  isAvail || isSelected
                    ? isSelected
                      ? 'text-secondary-foreground'
                      : 'text-success'
                    : 'text-muted-foreground/30',
                )}
              >
                {slot.startTime}
              </span>

              <span
                className={cn(
                  'text-[8px] mt-0.5',
                  isAvail || isSelected
                    ? isSelected
                      ? 'text-secondary-foreground/80'
                      : 'text-success/70'
                    : 'text-muted-foreground/30',
                )}
              >
                {isAvail || isSelected ? formatCurrency(blockPrice) : 'Terisi'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-success/20 border border-success/40" />
          Tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-muted/40 border border-border/30" />
          Terisi
        </span>
      </div>
    </div>
  );
}
