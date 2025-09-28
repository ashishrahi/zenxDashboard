"use client";

import axiosInstance from "@/lib/axios";
import { IFaq } from "@/types/faqTypes";

export const FaqService = {
  // Fetch all FAQs
  getAll: async (): Promise<IFaq[]> => {
    const response = await axiosInstance.get("/faq");
    return response?.data?.data;
  },

  // Fetch a single FAQ by ID
  getById: async (id: string): Promise<IFaq> => {
    const response = await axiosInstance.get(`/faq/${id}`);
    return response?.data?.data;
  },

  // Create a new FAQ
  create: async (faq: Omit<IFaq, "_id">) => {
    const response = await axiosInstance.post("/faq/create", faq);
    return response?.data;
  },

  // Update an existing FAQ
  update: async (faq: IFaq) => {
    const response = await axiosInstance.put(`/faq/update/${faq._id}`, faq);
    return response?.data;
  },

  // Delete a FAQ by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/faq/delete/${id}`);
  },
};
