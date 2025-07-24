import axios from 'axios';

const API_BASE_URL = "/api/auth";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor


// API methods
export const registerUser = (userData) => axiosInstance.post('/signup', userData);
export const loginUser = (credentials) => axiosInstance.post('/login', credentials);
export const logoutUser = () => axiosInstance.post('/logout');
export const sendOtp = (email) => axiosInstance.post('/sendotp', { email });
export const verifyEmail = (email, otp) => axiosInstance.post('/verifyEmail', { email, otp });
export const resetPassword = (email, otp, newPassword) => 
  axiosInstance.post('/changepassword', { email, otp, newPassword });
export const getCurrentUser = () => axiosInstance.get('/me');
export const googleLogin = (token) => axiosInstance.post('/googleLogin', { token });
export const instructorRegister = (data) => axiosInstance.post('/instructorRegister', data);
export const checkRequest = (email) => axiosInstance.post('/checkRequest', { email });
export const tempRegisterInstructor = (data) => axiosInstance.post('/tempRegisterInstructor', data);
export default axiosInstance;
