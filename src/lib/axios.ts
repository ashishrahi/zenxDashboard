"use client"
// // lib/axios.ts
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Optional: Add interceptors for auth token or error handling
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Optional: Handle global errors
//     if (error.response?.status === 401) {
//       // handle logout or token refresh
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
