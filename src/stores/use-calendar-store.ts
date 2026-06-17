import { create } from 'zustand';
import { format } from 'date-fns';

type CalendarView = 'day' | 'week';

type CalendarState = {
  selectedDate: string;
  view: CalendarView;
  selectedCourtId: string | null;
};

type CalendarActions = {
  setSelectedDate: (date: string) => void;
  setView: (view: CalendarView) => void;
  setSelectedCourtId: (courtId: string | null) => void;
  goToToday: () => void;
};

export const useCalendarStore = create<CalendarState & CalendarActions>()((set) => ({
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  view: 'day',
  selectedCourtId: null,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setView: (view) => set({ view }),
  setSelectedCourtId: (courtId) => set({ selectedCourtId: courtId }),
  goToToday: () => set({ selectedDate: format(new Date(), 'yyyy-MM-dd') }),
}));
