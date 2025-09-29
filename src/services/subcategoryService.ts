"use client";

import axiosInstance from "@/lib/axios";
import { ISubcategory } from "@/types/subcategoryTypes";

export const SubcategoryService = {
  // Fetch all subcategories
  getAll: async (): Promise<ISubcategory[]> => {
    const response = await axiosInstance.get("/subcategories");
    return response?.data?.data;
  },

  // Fetch a single subcategory by ID
  getById: async (id: string): Promise<ISubcategory> => {
    const response = await axiosInstance.get(`/subcategories/${id}`);
    return response?.data?.data;
  },

  // Create a new subcategory
  create: async (formData: FormData) => {
    const response  = await axiosInstance.post("/subcategories/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  },

  // Update an existing subcategory
  update: async (id: string, formData: FormData) => {
    const  response  = await axiosInstance.put(`/subcategories/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  },

  // Delete a subcategory by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subcategories/delete/${id}`);
  },
};