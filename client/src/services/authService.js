import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_URL = 'http://localhost:5000/api/auth/';          // server link

// export const register = async (userData) => {
//     try {
//         const response = await axios.post(`${API_URL}register`, userData);
//         return response.data;
//     } catch (error) {
//         console.error('Error registering user:', error);
//         throw error;
//     }
// }

// export const login = async (userData) => {
//     try {
//         const response = await axios.post(`${API_URL}login`, userData);
//         return response.data;
//     } catch (error) {
//         console.error('Error logging in user:', error);
//         throw error;
//     }
// }


export const registerUser = async (userData) => {
  const res = await axiosInstance.post('/auth/register', userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axiosInstance.post('/auth/login', userData);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data;
};