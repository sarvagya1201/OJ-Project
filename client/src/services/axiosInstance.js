import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend base URL
  withCredentials: true, // send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
