import axios from 'axios';
import axiosInstance from './axiosInstance';

export const getAllProblems = async () => {
    const response = await axiosInstance.get('/problems');
    return response.data;
};

export const getProblemById = async (id) => {
    const response = await axiosInstance.get(`/problems/${id}`);
    return response.data;
};

export const addProblem = async (formData) => {
  const res = await axiosInstance.post('/problems/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};