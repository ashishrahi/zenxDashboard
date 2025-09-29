"use client";

import axiosInstance from "@/lib/axios";
import { IProductPayload } from "@/types/productTypes";

export const ProductService = {
  // Fetch all products
  getAll: async (): Promise<IProductPayload[]> => {
    const response = await axiosInstance.get("/products");
    return response?.data?.data;
  },

  // Fetch a single product by ID
  getById: async (id: string): Promise<IProductPayload> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response?.data?.data;
  },

  // Create a new product
  create: async (formData: FormData) => {
    const response = await axiosInstance.post("/products/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  },

  // Update an existing product - FIXED VERSION
  update: async (id: string, formData: FormData) => {
    const response = await axiosInstance.put(`/products/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data
  },

  // Delete a product by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/delete/${id}`);
  },
};