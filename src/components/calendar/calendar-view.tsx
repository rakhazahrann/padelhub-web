'use client';

import { toast } from 'sonner';

import type { DaySchedule, TimeSlot } from '@/types/court.types';
import { SlotCell } from './slot-cell';

interface CalendarViewProps {
  schedule: DaySchedule;
  selectedCourtId: string | null;
  selectedStartTime: string | null;
  selectedDuration: 60 | 90 | 120;
  onSlotSelect: (courtId: string, startTime: string) => void;
}

export function CalendarView({
  schedule,
  selectedCourtId,
  selectedStartTime,
  selectedDuration,
  onSlotSelect,
}: CalendarViewProps) {
  const courts = schedule.courts || [];
  
  // Get all unique start times from the first court's slots to draw rows
  const timeLabels = courts[0]?.slots.map((s) => s.startTime) || [];

  // Helper to check if a sequence of slots is available starting from a given slot index
  const isSequenceAvailable = (
    courtSlots: TimeSlot[],
    startIndex: number,
    durationMin: number
  ): boolean => {
    const slotsNeeded = durationMin / 30;
    
    // Check if we would go out of bounds
    if (startIndex + slotsNeeded > courtSlots.length) {
      return false;
    }

    // Check if all slots in the sequence are AVAILABLE
    for (let i = 0; i < slotsNeeded; i++) {
      const slot = courtSlots[startIndex + i];
      if (slot.status !== 'AVAILABLE') {
        return false;
      }
    }

    return true;
  };

  // Helper to check if a slot is currently part of the selected slots sequence
  const isSlotSelected = (courtId: string, slotTime: string, slotIndex: number, courtSlots: TimeSlot[]): boolean => {
    if (courtId !== selectedCourtId || !selectedStartTime) return false;
    
    const startIndex = courtSlots.findIndex((s) => s.startTime === selectedStartTime);
    if (startIndex === -1) return false;

    const slotsNeeded = selectedDuration / 30;
    return slotIndex >= startIndex && slotIndex < startIndex + slotsNeeded;
  };

  const handleCellClick = (courtId: string, slotTime: string, slotIndex: number, courtSlots: TimeSlot[]) => {
    if (!isSequenceAvailable(courtSlots, slotIndex, selectedDuration)) {
      toast.error(`Waktu sewa tidak cukup. Dibutuhkan ${selectedDuration} menit slot berturut-turut.`);
      return;
    }
    onSlotSelect(courtId, slotTime);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row: Court Names */}
          <div className="grid grid-cols-[100px_repeat(4,1fr)] border-b border-border bg-muted/20">
            <div className="flex items-center justify-center p-4 text-xs font-semibold text-muted-foreground font-label border-r border-border">
              Waktu
            </div>
            {courts.map((item) => (
              <div key={item.court.id} className="p-4 text-center border-r border-border last:border-r-0">
                <p className="font-bold text-sm text-foreground">{item.court.name}</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-accent text-secondary text-[10px] font-bold mt-1 uppercase tracking-wider font-label">
                  {item.court.type}
                </span>
              </div>
            ))}
          </div>

          {/* Time rows */}
          <div className="divide-y divide-border">
            {timeLabels.map((timeStr) => {
              return (
                <div key={timeStr} className="grid grid-cols-[100px_repeat(4,1fr)] items-center">
                  {/* Left Column: Time label */}
                  <div className="flex items-center justify-center h-24 border-r border-border bg-muted/5 font-mono text-xs font-bold text-foreground">
                    {timeStr}
                  </div>

                  {/* Court columns */}
                  {courts.map((courtData) => {
                    const slotIndex = courtData.slots.findIndex((s) => s.startTime === timeStr);
                    const slot = courtData.slots[slotIndex];
                    
                    if (!slot) {
                      return <div key={courtData.court.id} className="h-24 border-r border-border last:border-r-0" />;
                    }

                    const isAvailable = slot.status === 'AVAILABLE';
                    const isValidStart = isAvailable && isSequenceAvailable(courtData.slots, slotIndex, selectedDuration);
                    const isSelected = isSlotSelected(courtData.court.id, slot.startTime, slotIndex, courtData.slots);
                    
                    // A cell is disabled if it's not available OR if it can't support the selected duration starting from it
                    // But if it is currently selected as part of a sequence, we keep it looking selected/active!
                    const isCellDisabled = !isAvailable || (!isValidStart && !isSelected);

                    return (
                      <div
                        key={courtData.court.id}
                        className="p-2 h-24 border-r border-border last:border-r-0 flex items-center justify-center"
                      >
                        <SlotCell
                          slot={slot}
                          isSelected={isSelected}
                          disabled={isCellDisabled}
                          onClick={() => handleCellClick(courtData.court.id, slot.startTime, slotIndex, courtData.slots)}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
