"use client";

import axiosInstance from "@/lib/axios";
import { ISubcategory } from "@/types/subcategoryTypes";

export const SubcategoryService = {
  // Fetch all subcategories
  getAll: async (): Promise<ISubcategory[]> => {
    const { data } = await axiosInstance.get("/subcategories");
    return data?.data;
  },

  // Fetch a single subcategory by ID
  getById: async (id: string): Promise<ISubcategory> => {
    const { data } = await axiosInstance.get(`/subcategories/${id}`);
    return data?.data;
  },

  // Create a new subcategory (supports image files)
  create: async (subcategory: Omit<ISubcategory, "_id" | "images"> & { images?: File[] }) => {
    const formData = new FormData();
    formData.append("name", subcategory.name ?? "");
    formData.append("slug", subcategory.slug ?? "");
    formData.append("description", subcategory.description ?? "");
    formData.append("categoryId", subcategory.categoryId?.toString() ?? "");

    // Append image files if provided
    subcategory.images?.forEach((file) => formData.append("images", file));

    const { data } = await axiosInstance.post("/subcategories/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data?.data;
  },

  // Update an existing subcategory (supports image files)
  update: async (subcategory: ISubcategory & { images?: File[] }) => {
    const formData = new FormData();
    formData.append("name", subcategory.name ?? "");
    formData.append("slug", subcategory.slug ?? "");
    formData.append("description", subcategory.description ?? "");
    formData.append("categoryId", subcategory.categoryId?.toString() ?? "");

    // Append new image files if provided
    subcategory.images?.forEach((file) => formData.append("images", file));

    const { data } = await axiosInstance.put(`/subcategories/update/${subcategory._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data?.data;
  },

  // Delete a subcategory by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subcategories/${id}`);
  },
};
