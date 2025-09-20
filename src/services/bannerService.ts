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

  // Create a new banner
  create: async (banner: Omit<IBannerPayload, "_id">): Promise<IBannerPayload> => {
    const response = await axiosInstance.post("/banners/create", banner);
    return response?.data?.data;
  },

  // Update an existing banner
  update: async (banner: IBannerPayload): Promise<IBannerPayload> => {
    const response = await axiosInstance.put(`/banners/update/${banner._id}`, banner);
    return response?.data?.data;
  },

  // Delete a banner by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/banners/delete/${id}`);
  },
};
