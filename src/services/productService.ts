"use client";

import axiosInstance from "@/lib/axios";
import { IProductPayload } from "@/types/productTypes";

export const ProductService = {
  // Fetch all products
  getAll: async (): Promise<IProductPayload[]> => {
    const { data } = await axiosInstance.get("/products");
    return data?.data;
  },

  // Fetch a single product by ID
  getById: async (id: string): Promise<IProductPayload> => {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data?.data;
  },

  // Create a new product
  create: async (formData: FormData) => {
    const { data } = await axiosInstance.post("/products/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data;
  },

  // Update an existing product - FIXED VERSION
  update: async (id: string, formData: FormData) => {
    const { data } = await axiosInstance.put(`/products/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data;
  },

  // Delete a product by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/delete/${id}`);
  },
};