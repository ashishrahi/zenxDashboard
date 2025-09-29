"use client";

import axiosInstance from "@/lib/axios";
import { IUser } from "@/types/userTypes";

export const UserService = {
  // Fetch all users
  getAll: async (): Promise<IUser[]> => {
    const response = await axiosInstance.get("/users");
    return response?.data?.data;
  },

  // Fetch a single user by ID
  getById: async (id: string): Promise<IUser> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response?.data?.data;
  },

  // Create a new user (supports file upload)
  create: async (user: Omit<IUser, "_id" | "profileImage"> & { profileImage?: File }) => {
    const formData = new FormData();

    formData.append("name", user.name ?? "");
    formData.append("email", user.email ?? "");
    formData.append("role", user.role ?? "");

    if (user.profileImage) {
      formData.append("profileImage", user.profileImage);
    }

    const response = await axiosInstance.post("/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data;
  },

  // Update an existing user (supports file upload)
  update: async (user: IUser & { profileImage?: File }) => {
    const formData = new FormData();

    formData.append("name", user.name ?? "");
    formData.append("email", user.email ?? "");
    formData.append("role", user.role ?? "");

    if (user.profileImage) {
      formData.append("profileImage", user.profileImage);
    }

    const response = await axiosInstance.put(`/users/${user._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data;
  },

  // Delete a user by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
