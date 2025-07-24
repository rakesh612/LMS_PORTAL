import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser, logoutUser } from '../api/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      initialCheckDone: false,

      initialize: async () => {
        try {
          set({ loading: true });
          const { data } = await getCurrentUser();
          
          set({
            user: (data.success) ? data.user : null,
            loading: false,
            initialCheckDone: true,
          });
        } catch (error) {
          set({
            user: null,
            loading: false,
            initialCheckDone: true,
          });
        }
      },

      login: (userData) => set({ user: userData }),

      logout: async () => {
        try {
          await logoutUser();
          set({ user: null });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }
    }),
    {
      name: 'auth-store', // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist `user`
    }
  )
);

export default useAuthStore;
