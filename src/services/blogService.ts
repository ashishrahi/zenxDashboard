"use client";

import axiosInstance from "@/lib/axios";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";

export const BlogService = {
  // Fetch all blogs
  getAll: async (): Promise<IBlogPayload[]> => {
    const response = await axiosInstance.get("/blogs");
    return response?.data?.data;
  },

  // Fetch single blog
  getById: async (id: string): Promise<IBlogPayload> => {
    const response = await axiosInstance.get(`/blogs/${id}`);
    return response?.data?.data;
  },

  // Create new blog - FIXED to match backend expectations
  create: async (blog: Omit<IBlogPayload, "_id"> & { images?: File[] }) => {
    const formData = new FormData();
    
    // Add all required fields - using exact field names backend expects
    formData.append("title", blog.title ?? "");
    formData.append("description", blog.description ?? "");
    formData.append("content", blog.content ?? "");
    formData.append("category", blog.category ?? "");
    formData.append("author", blog.author ?? "");
    
    // Backend expects "image" (singular) not "images"
    if (blog.images && blog.images.length > 0) {
      formData.append("image", blog.images[0]); // Use "image" not "images"
    } else {
      // If no image is provided, you might want to handle this case
      // Either provide a default image or let backend handle the validation
      console.warn("No image provided, backend validation might fail");
    }

    const response = await axiosInstance.post("/blogs/create", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  },

  // Update existing blog - FIXED to match backend expectations
  update: async (blog: IBlogPayload & { images?: File[] }) => {
    const formData = new FormData();
    formData.append("title", blog.title ?? "");
    formData.append("description", blog.description ?? "");
    formData.append("content", blog.content ?? "");
    formData.append("category", blog.category ?? "");
    formData.append("author", blog.author ?? "");

    // Backend expects "image" (singular)
    if (blog.images && blog.images.length > 0) {
      formData.append("image", blog.images[0]); // Use "image" not "images"
    }

    const response = await axiosInstance.put(`/blogs/update/${blog._id}`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  },

  // Delete blog
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/blogs/delete/${id}`);
  },
};