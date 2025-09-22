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

  // Create a new product (supports image files)
  create: async (product: Omit<IProductPayload, "_id" | "images"> & { images?: File[] }) => {
    const formData = new FormData();

    // Required fields
    formData.append("name", product.name ?? "");
    formData.append("slug", product.slug ?? "");
    formData.append("price", product.price?.toString() ?? "0");
    formData.append("categoryId", product.categoryId?.toString() ?? "");
    if (product.subcategoryId) formData.append("subcategoryId", product.subcategoryId.toString());

    // Optional fields
    formData.append("description", product.description ?? "");
    formData.append("material", product.material ?? "");
    formData.append("care", product.care ?? "");
    formData.append("delivery", product.delivery ?? "");

    // Arrays
    formData.append("variants", JSON.stringify(product.variants ?? []));
    formData.append("sizes", JSON.stringify(product.sizes ?? []));
    formData.append("colors", JSON.stringify(product.colors ?? []));

    // Images
    product.images?.forEach((file) => formData.append("images", file));

    const { data } = await axiosInstance.post("/products/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data?.data;
  },

  // Update an existing product (supports image files)
  update: async (product: IProductPayload & { images?: File[] }) => {
    const formData = new FormData();

    // Required fields
    formData.append("name", product.name ?? "");
    formData.append("slug", product.slug ?? "");
    formData.append("price", product.price?.toString() ?? "0");
    formData.append("categoryId", product.categoryId?.toString() ?? "");
    if (product.subcategoryId) formData.append("subcategoryId", product.subcategoryId.toString());

    // Optional fields
    formData.append("description", product.description ?? "");
    formData.append("material", product.material ?? "");
    formData.append("care", product.care ?? "");
    formData.append("delivery", product.delivery ?? "");

    // Arrays
    formData.append("variants", JSON.stringify(product.variants ?? []));
    formData.append("sizes", JSON.stringify(product.sizes ?? []));
    formData.append("colors", JSON.stringify(product.colors ?? []));

    // Images
    product.images?.forEach((file) => formData.append("images", file));

    const { data } = await axiosInstance.put(`/products/update/${product._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data?.data;
  },

  // Delete a product by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/delete/${id}`);
  },
};
