'use client';

import { format, addDays, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedDuration: 60 | 90 | 120;
  onDurationChange: (duration: 60 | 90 | 120) => void;
}

export function CalendarHeader({
  selectedDate,
  onDateChange,
  selectedDuration,
  onDurationChange,
}: CalendarHeaderProps) {
  const today = startOfDay(new Date());
  
  // Generate the next 14 days
  const days = Array.from({ length: 14 }).map((_, i) => addDays(today, i));

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    if (startOfDay(current) > today) {
      onDateChange(format(addDays(current, -1), 'yyyy-MM-dd'));
    }
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    const maxDate = addDays(today, 13);
    if (startOfDay(current) < maxDate) {
      onDateChange(format(addDays(current, 1), 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Top Section: Title & Duration Select */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Ketersediaan Lapangan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pilih tanggal bermain dan durasi sesi Anda.
          </p>
        </div>
        
        {/* Duration selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Durasi Sesi:</span>
          <div className="flex rounded-lg border border-border p-1 bg-muted/30">
            {([60, 120] as const).map((duration) => (
              <button
                key={duration}
                onClick={() => onDurationChange(duration)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-paper cursor-pointer',
                  selectedDuration === duration
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {duration} Menit
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Slider Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevDay}
          disabled={format(today, 'yyyy-MM-dd') === selectedDate}
          className="h-10 w-10 shrink-0 cursor-pointer"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </Button>

        {/* Scrollable Day Horizontal list */}
        <div className="flex flex-1 gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isActive = dateStr === selectedDate;
            const isTodayDay = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            
            return (
              <button
                key={dateStr}
                onClick={() => onDateChange(dateStr)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl p-2 min-w-[64px] border transition-paper snap-start cursor-pointer',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                )}
              >
                <span className={cn('text-[10px] uppercase font-label', isActive ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                  {format(day, 'EEE', { locale: id })}
                </span>
                <span className="text-base font-bold mt-0.5">
                  {format(day, 'd')}
                </span>
                {isTodayDay && (
                  <span className={cn('text-[8px] font-bold px-1 py-0.2 rounded-full uppercase mt-1 tracking-wider', isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary/10 text-secondary')}>
                    Hari Ini
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Datepicker popover for alternative selection */}
        <Popover>
          <PopoverTrigger className="h-10 w-10 shrink-0 cursor-pointer border border-border rounded-lg inline-flex items-center justify-center bg-card text-foreground hover:bg-muted outline-none">
            <CalendarIcon className="h-4.5 w-4.5" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={new Date(selectedDate)}
              onSelect={(date) => {
                if (date) {
                  onDateChange(format(date, 'yyyy-MM-dd'));
                }
              }}
              disabled={(date) => date < today || date > addDays(today, 13)}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextDay}
          disabled={format(addDays(today, 13), 'yyyy-MM-dd') === selectedDate}
          className="h-10 w-10 shrink-0 cursor-pointer"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </Button>
      </div>
    </div>
  );
}
