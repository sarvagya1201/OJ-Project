import axios from 'axios';
import axiosInstance from './axiosInstance';


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