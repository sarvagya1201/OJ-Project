import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getAllProblems = async () => {
  const response = await axiosInstance.get("/problems");
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await axiosInstance.get(`/problems/${id}?safe=true`);
  return response.data;
};
export const getProblemForAdmin = async (id) => {
  const response = await axiosInstance.get(`/problems/${id}`); // no safe
  return response.data;
};
export const addProblem = async (formData) => {
  const res = await axiosInstance.post("/problems/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProblemById = async (id, formData) => {
  const res = await axiosInstance.put(`/problems/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProblemById = async (id) => {
  const res = await axiosInstance.delete(`/problems/${id}`);
  return res.data;
};
