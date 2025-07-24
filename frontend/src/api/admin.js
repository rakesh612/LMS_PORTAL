import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "/api/admin",
    withCredentials: true
});

// Get total income from all courses
export const getIncome = async () => {
    try {
        const response = await axiosInstance.post(`/getIncome`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to fetch income data" };
    }
};

// Get number of instructors
export const getNoOfInstructors = async () => {
    try {
        const response = await axiosInstance.post(`/getNoOfInstructors`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to fetch instructors count" };
    }
};

// Get number of students
export const getNoOfStudents = async () => {
    try {
        const response = await axiosInstance.post(`/getNoOfStudents`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to fetch students count" };
    }
}; 
export const getNoOfCourses = async () => {
    try {
        const response = await axiosInstance.post(`/getNoOfCourses`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to fetch courses count" };
    }
};
export const getPendingRequests = async () => {
    try {
        const response = await axiosInstance.post(`/getPendingRequests`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to fetch pending requests" };
    }
};
export const verifyInstructor = async (data) => {
    try {
        const response = await axiosInstance.post(`/verifyInstructor`, {requestId:data});
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to verify instructor" };
    }
};
export const rejectInstructor = async (data) => {
    try {
        const response = await axiosInstance.post(`/rejectInstructor`, {requestId:data});
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to reject instructor" };
    }
};
export const createAdmin = async (data) => {
    try {
        const response = await axiosInstance.post(`/createAdmin`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to create admin" };
    }
};