"use client"
import axiosInstance from "@/lib/axios";
import { ICityPayload } from "@/types/ICityPayload";

export const CityService = {
  getAll: async (): Promise<ICityPayload[]> => {
    const { data } = await axiosInstance.get("/cities");
    return data?.data;
  },

  getById: async (id: string): Promise<ICityPayload> => {
    const { data } = await axiosInstance.get(`/cities/${id}`);
    return data?.data;
  },

  create: async (city: Omit<ICityPayload, "_id">): Promise<ICityPayload> => {
    const { data } = await axiosInstance.post("/cities/create", city);
    return data?.data;
  },

  update: async (city: ICityPayload): Promise<ICityPayload> => {
    if (!city._id) throw new Error("City _id is required for update");
    const { data } = await axiosInstance.put(`/cities/update/${city._id}`, city);
    return data?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/cities/${id}`);
  },
};
