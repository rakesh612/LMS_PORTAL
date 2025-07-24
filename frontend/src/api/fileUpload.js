import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: "/api/fileUpload",
  withCredentials: true,
});
const uploadFile = async (formData) => {
  const response = await axiosInstance.post(`/upload`, formData);
  return response.data;
};

export { uploadFile };