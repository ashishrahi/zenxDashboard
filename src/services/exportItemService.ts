"use client";

import axiosInstance from "@/lib/axios";
import { IExport } from "@/types/IExportItem";

export const ExportItemService = {
  // Fetch all export items
  getAll: async (): Promise<IExport[]> => {
    const response = await axiosInstance.get("/exports");
    return response?.data?.data;
  },

  // Fetch a single export item by ID
  getById: async (id: string): Promise<IExport> => {
    const response = await axiosInstance.get(`/exports/${id}`);
    return response?.data?.data;
  },

  // Create a new export item
  create: async (item: Omit<IExport, "_id">) => {
    const response = await axiosInstance.post("/exports/create", item);
    return response?.data?.data;
  },

  // Update an existing export item
  update: async (item: IExport) => {
    const response = await axiosInstance.put(`/exports/update/${item._id}`, item);
    return response?.data?.data;
  },

  // Delete an export item by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/exports/delete/${id}`);
  },
};
