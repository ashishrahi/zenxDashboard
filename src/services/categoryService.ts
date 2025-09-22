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
  create: async (category: Omit<ICategoryPayload, "id" | "images"> & { images: File[] }) => {
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    if (category.description) formData.append("description", category.description);

    category.images.forEach((file) => formData.append("images", file));

    const response = await axiosInstance.post("/categories/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data?.data;
  },

  // Update an existing category with files
  update: async (category: ICategoryPayload & { images?: File[] }) => {
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.slug);
    if (category.description) formData.append("description", category.description);

    if (category.images && category.images.length > 0) {
      category.images.forEach((file) => formData.append("images", file));
    }

    const response = await axiosInstance.put(`/categories/update/${category._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data?.data;
  },

  // Delete a category by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/delete/${id}`);
  },
};
  