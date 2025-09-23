"use client";

import axiosInstance from "@/lib/axios";
import { IBannerPayload } from "@/AppComponents/AppBannersDialog";

export const BannerService = {
  // Fetch all banners
  getAll: async (): Promise<IBannerPayload[]> => {
    const response = await axiosInstance.get("/banners");
    return response?.data?.data;
  },

  // Fetch a single banner by ID
  getById: async (id: string): Promise<IBannerPayload> => {
    const response = await axiosInstance.get(`/banners/${id}`);
    return response?.data?.data;
  },

  // Create a new banner (supports multiple images)
  create: async (banner: Omit<IBannerPayload, "_id"> & { images?: File[] }) => {
    const formData = new FormData();
    formData.append("title", banner.title ?? "");
    formData.append("link", banner.link ?? "");
    formData.append("description", banner.description ?? "");
    formData.append("isActive", banner.isActive ? "true" : "false");

    // Append multiple image files
    banner.images?.forEach((file) => formData.append("images", file));

    const response = await axiosInstance.post("/banners/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data?.data;
  },

  // Update an existing banner (supports multiple images)
  update: async (banner: IBannerPayload & { images?: File[] }) => {
    const formData = new FormData();
    formData.append("title", banner.title ?? "");
    formData.append("link", banner.link ?? "");
    formData.append("description", banner.description ?? "");
    formData.append("isActive", banner.isActive ? "true" : "false");

    // Append new image files
    banner.images?.forEach((file) => formData.append("images", file));

    // Optionally send existing image URLs so backend can keep them
    if (banner.images && banner.images.length === 0 && banner.images.length !== undefined) {
      // Example: send as JSON string for backend to know which URLs to keep
      formData.append("existingImages", JSON.stringify(banner.images));
    }

    const response = await axiosInstance.put(`/banners/update/${banner._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data?.data;
  },

  // Delete a banner by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/banners/delete/${id}`);
  },
};
