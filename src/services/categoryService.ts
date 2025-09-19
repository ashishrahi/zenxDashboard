"use client"

import axiosInstance from "@/lib/axios";
import { ICategory } from "@/types/categoriesTypes";

export const CategoryService = {
  // Fetch all categories
  getAll: async (): Promise<ICategory[]> => {
    const response = await axiosInstance.get("/categories");
    return response?.data?.data; // <--- yaha 'data.data' use karein
  },

  // Fetch a single category by ID
  getById: async (id: string): Promise<ICategory> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response?.data?.data; // <--- yaha bhi
  },

  // Create a new category
  create: async (category: Omit<ICategory, "id">): Promise<ICategory> => {
    const response = await axiosInstance.post("/categories/create", category);
    return response.data.data; // backend me 'data' field
  },

  // Update an existing category
  update: async (category: ICategory): Promise<ICategory> => {
    console.log('updated', category)
    const response = await axiosInstance.put(`/categories/update/${category._id}`, category);
    return response.data.data;
  },

  // Delete a category by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/delete/${id}`);
  },
};
