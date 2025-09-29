"use client"
import axiosInstance from "@/lib/axios";
import { ICityPayload } from "@/types/ICityPayload";

export const CityService = {
  getAll: async (): Promise<ICityPayload[]> => {
    const response = await axiosInstance.get("/cities");
    return response?.data?.data;
  },

  getById: async (id: string): Promise<ICityPayload> => {
    const response = await axiosInstance.get(`/cities/${id}`);
    return response?.data?.data;
  },

  create: async (city: Omit<ICityPayload, "_id">): Promise<ICityPayload> => {
    const response = await axiosInstance.post("/cities/create", city);
    return response?.data;
  },

  update: async (city: ICityPayload): Promise<ICityPayload> => {
    if (!city._id) throw new Error("City _id is required for update");
    const response = await axiosInstance.put(`/cities/update/${city._id}`, city);
    return response?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/cities/${id}`);
  },
};
