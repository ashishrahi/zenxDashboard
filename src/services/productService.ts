// services/productService.ts
import axiosInstance from "@/lib/axios";
import { Product } from "@/types/productTypes";

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await axiosInstance.get("/users");
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const { data } = await axiosInstance.post("/products", product);
    return data;
  },

  update: async (product: Product): Promise<Product> => {
    const { data } = await axiosInstance.put(`/products/${product.id}`, product);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
};
