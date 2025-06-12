
// lib/stores/menuStore.js
import { create } from "zustand";
import { persist } from 'zustand/middleware';

const TAB_ROUTES = {
  dashboard: '/dashboard',
  properties: '/properties',
  messages: '/messages',
  // Add all your tabs and corresponding routes
};

const getInitialTab = () => {
  if (typeof window === 'undefined') return 'dashboard';
  
  const currentPath = window.location.pathname;
  return Object.entries(TAB_ROUTES).find(([, route]) => 
    currentPath.startsWith(route)
  )?.[0] || 'dashboard';
};

export const useMenuStore = create(
  persist(
    (set) => ({
      mobileMenuOpen: false,
      activeTab: getInitialTab(),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({ activeTab: state.activeTab }), // Only persist activeTab
    }
  )
);