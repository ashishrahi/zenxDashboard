"use client";

import axiosInstance from "@/lib/axios";
import { IBlog } from "@/types/blogTypes";

export const BlogService = {
  // Fetch all blogs
  getAll: async (): Promise<IBlog[]> => {
    const { data } = await axiosInstance.get("/blogs");
    return data?.data; // backend returns { success, message, data }
  },

  // Fetch a single blog by ID
  getById: async (id: string): Promise<IBlog> => {
    const { data } = await axiosInstance.get(`/blogs/${id}`);
    return data?.data;
  },

  // Create a new blog (supports image file)
  create: async (blog: Omit<IBlog, "_id" | "imageFile"> & { imageFile?: File }) => {
    const formData = new FormData();
    formData.append("title", blog.title ?? "");
    formData.append("content", blog.content ?? "");
    formData.append("author", blog.author ?? "");

    if (blog.imageFile) {
      formData.append("imageFile", blog.imageFile);
    }

    const { data } = await axiosInstance.post("/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data?.data;
  },

  // Update an existing blog (supports image file)
  update: async (blog: IBlog & { imageFile?: File }) => {
    const formData = new FormData();
    formData.append("title", blog.title ?? "");
    formData.append("content", blog.content ?? "");
    formData.append("author", blog.author ?? "");

    if (blog.imageFile) {
      formData.append("imageFile", blog.imageFile);
    }

    const { data } = await axiosInstance.put(`/blogs/${blog._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data?.data;
  },

  // Delete a blog by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/blogs/${id}`);
  },
};
