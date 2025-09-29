"use client";

import axiosInstance from "@/lib/axios";
import { IBannerPayload } from "@/types/IBannerPayload ";

export const BannerService = {
  getAll: async (): Promise<IBannerPayload[]> => {
    const response = await axiosInstance.get("/banners");
    return response?.data?.data;
  },

  getById: async (id: string): Promise<IBannerPayload> => {
    const response = await axiosInstance.get(`/banners/${id}`);
    return response?.data?.data;
  },

  create: async (banner: Omit<IBannerPayload, "_id"> & { images?: File[] }) => {
    const formData = new FormData();
    formData.append("title", banner.title ?? "");
    formData.append("description", banner.description ?? "");
    formData.append("isActive", banner.isActive ? "true" : "false");

    // Append only actual File objects
    banner.images?.forEach((file) => {
      if (file instanceof File) formData.append("images", file);
    });

    const response = await axiosInstance.post("/banners/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data;
  },

  update: async (banner: IBannerPayload & { images?: File[]; existingImages?: string[] }) => {
    const formData = new FormData();
    formData.append("title", banner.title ?? "");
    formData.append("description", banner.description ?? "");
    formData.append("isActive", banner.isActive ? "true" : "false");

    banner.images?.forEach((file) => {
      if (file instanceof File) formData.append("images", file);
    });

    if (banner.existingImages && banner.existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(banner.existingImages));
    }

    const response = await axiosInstance.put(`/banners/update/${banner._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/banners/delete/${id}`);
  },
};
