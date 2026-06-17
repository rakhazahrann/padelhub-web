import { create } from 'zustand';

type UiState = {
  isSidebarOpen: boolean;
  isMobileNavOpen: boolean;
};

type UiActions = {
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (isOpen: boolean) => void;
};

export const useUiStore = create<UiState & UiActions>()((set) => ({
  isSidebarOpen: true,
  isMobileNavOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
}));
