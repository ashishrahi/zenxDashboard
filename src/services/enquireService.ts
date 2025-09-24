"use client";

import axiosInstance from "@/lib/axios";
import { IEnquire } from "@/types/IEnquireTypes";

export const EnquireService = {
  // Fetch all enquiries
  getAll: async (): Promise<IEnquire[]> => {
    const response = await axiosInstance.get("/enquires");
    return response?.data?.data;
  },

  // Fetch a single enquiry by ID
  getById: async (id: string): Promise<IEnquire> => {
    const response = await axiosInstance.get(`/enquires/${id}`);
    return response?.data?.data;
  },

  // Create a new enquiry
  create: async (enquire: Omit<IEnquire, "_id">) => {
    const response = await axiosInstance.post("/enquires/create", enquire);
    return response?.data?.data;
  },

  // Update an existing enquiry
  update: async (enquire: IEnquire) => {
    const response = await axiosInstance.put(`/enquires/update/${enquire._id}`, enquire);
    return response?.data?.data;
  },

  // Delete an enquiry by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/enquires/delete/${id}`);
  },
};
