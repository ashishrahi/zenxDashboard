// services/productService.ts
import axiosInstance from "@/lib/axios";
import { Product } from "@/types/productTypes";

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await axiosInstance.get("/products");
    return data?.data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await axiosInstance.get(`/products/${id}`,);
    return data?.data;
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const { data } = await axiosInstance.post("/products/create", product);
    return data?.data;
  },

  update: async (product: Product): Promise<Product> => {
    const { data } = await axiosInstance.put(`/products/update/${product._id}`, product);
    return data?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/delete/${id}`);
  },
};
