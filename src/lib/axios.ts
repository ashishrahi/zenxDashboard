"use client";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ===== Request interceptor: add token =====
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ===== Response interceptor: refresh token on 401 =====
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const { data } = await axiosInstance.post("/auth/refresh-token", { refreshToken });
            const newToken = data?.data?.token;

            // Update localStorage
            localStorage.setItem("token", newToken);

            // Retry original request with new token
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("auth");
            localStorage.removeItem("user");
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
