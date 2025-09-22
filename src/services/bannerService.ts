"use client";

import axiosInstance from "@/lib/axios";
import { IBannerPayload } from "@/AppComponents/AppBannersDialog";

export const BannerService = {
  // Fetch all banners
  getAll: async (): Promise<IBannerPayload[]> => {
    const response = await axiosInstance.get("/banners");
    return response?.data?.data; // backend returns { success, message, data }
  },

  // Fetch a single banner by ID
  getById: async (id: string): Promise<IBannerPayload> => {
    const response = await axiosInstance.get(`/banners/${id}`);
    return response?.data?.data;
  },

  // Create a new banner (supports image files)
  create: async (banner: Omit<IBannerPayload, "_id" | "imageFile"> & { imageFile?: File }) => {
    const formData = new FormData();
    formData.append("title", banner.title ?? "");
    formData.append("link", banner.link ?? "");
    formData.append("description", banner.description ?? "");

    // Append image file if provided
    if (banner.imageFile) {
      formData.append("imageFile", banner.imageFile);
    }

    const response = await axiosInstance.post("/banners/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data?.data;
  },

  // Update an existing banner (supports image file)
  update: async (banner: IBannerPayload & { imageFile?: File }) => {
    const formData = new FormData();
    formData.append("title", banner.title ?? "");
    formData.append("link", banner.link ?? "");
    formData.append("description", banner.description ?? "");

    // Append new image file if provided
    if (banner.imageFile) {
      formData.append("imageFile", banner.imageFile);
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
