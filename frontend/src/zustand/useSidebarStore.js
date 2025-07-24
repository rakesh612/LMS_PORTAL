// src/store/useSidebarStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useSidebarStore = create(
  persist(
    (set) => ({
      activeTab: 'dashboard', // default tab
      setActiveTab: (tab) => set({ activeTab: tab }),
      

    }),
    {
      name: 'sidebar-tab-storage', // key in localStorage
    }
  )
);
