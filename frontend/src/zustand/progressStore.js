// stores/progressStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProgressStore = create(
  persist(
    (set, get) => ({
      progress: {},
      loading: false,
      error: null,

      fetchProgress: async (courseId) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/api/progress/get', { courseId });
          set((state) => ({
            progress: {
              ...state.progress,
              [courseId]: response.data.progress,
            },
          }));
          return response.data.progress;
        } catch (error) {
          set({ error: error.message });
          console.error('Fetch progress error:', error);
        } finally {
          set({ loading: false });
        }
      },

      updateProgress: async (courseId, lessonIdx, progressVector) => {
        const { progress } = get();
        const newProgress = { ...progress };
        
        if (!newProgress[courseId]) newProgress[courseId] = [];
        while (newProgress[courseId].length <= lessonIdx) {
          newProgress[courseId].push([0, -1, 0]);
        }
        
        newProgress[courseId][lessonIdx] = newProgress[courseId][lessonIdx].map(
          (val, idx) => val + (progressVector[idx] || 0)
        );
        
        // Clamp values
        newProgress[courseId][lessonIdx][0] = Math.min(1, Math.max(0, newProgress[courseId][lessonIdx][0]));
        newProgress[courseId][lessonIdx][2] = Math.min(1, Math.max(0, newProgress[courseId][lessonIdx][2]));
        
        set({ progress: newProgress });

        try {
          await axios.post('/api/progress/update', {
            courseId,
            lessonIdx,
            progressVector,
          });
        } catch (error) {
          console.error('Update progress error:', error);
          set({ progress }); // Revert on error
        }
      },
    }),
    {
      name: 'course-progress-storage',
    }
  )
);