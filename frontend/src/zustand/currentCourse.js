// src/zustand/courseStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCourseStore = create(
  persist(
    (set) => ({
      selectedCourse: null,
      setSelectedCourse: (course) => set({ selectedCourse: course }),
      clearSelectedCourse: () => set({ selectedCourse: null }),
    }),
    {
      name: 'selected-course-storage', // key in localStorage
    }
  )
);

export default useCourseStore;
