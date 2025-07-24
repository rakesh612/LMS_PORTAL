import axios from 'axios';

// Create axios instance with base URL and credentials
const axiosInstance = axios.create({
  baseURL: "/api/users",
  withCredentials: true,
});

// Add course
export const addCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/addCourse', courseData);
    
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add lesson to a course
export const addLesson = async (lessonData) => {
  try {
    const response = await axiosInstance.post('/addLesson', lessonData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get instructor's courses
export const getMyCourses = async () => {
  try {
    const response = await axiosInstance.post('/getMyCourses');
    
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get course details with lessons
export const getCurrentCourse = async (courseId) => {
  try {
    const response = await axiosInstance.post('/getCurrentCourse', { courseId });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get income for a specific course
export const getCourseIncome = async (courseId) => {
  try {
    const response = await axiosInstance.post('/getCourseIncome', { courseId });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get total income across all courses
export const getTotalIncome = async () => {
  try {
    const response = await axiosInstance.post('/getTotalIncome');
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addQuiz = async (quizData) => {
  try {
    const response = await axiosInstance.post('/addQuiz', quizData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getQuiz = async (lessonId) => {
  try {
    const response = await axiosInstance.post('/getQuiz', { lessonId });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

