"use client";

import axiosInstance from "@/lib/axios";
import { ICategoryPayload } from "@/types/categoriesTypes";

export const CategoryService = {
  // Fetch all categories
  getAll: async (): Promise<ICategoryPayload[]> => {
    const response = await axiosInstance.get("/categories");
    return response?.data?.data;
  },

  // Fetch a single category by ID
  getById: async (id: string): Promise<ICategoryPayload> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response?.data?.data;
  },

  // Create a new category with files
  create: async (formData: FormData) => {
    const response = await axiosInstance.post("/categories/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  },

  // Update an existing category with files and existing images
  update: async (id: string, formData: FormData) => {
    const response = await axiosInstance.put(`/categories/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  },

  // Delete a category by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/delete/${id}`);
  },
};