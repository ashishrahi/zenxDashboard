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

  // Create a new product (supports variant images)
  create: async (product: Omit<IProductPayload, "_id"> & { 
    variantFiles?: File[][]; // Array of File arrays for each variant
  }) => {
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
    formData.append("stock", product.stock?.toString() ?? "0");
    formData.append("rating", product.rating?.toString() ?? "0");

    // Arrays
    formData.append("variants", JSON.stringify(product.variants?.map(variant => ({
      color: variant.color,
      stock: variant.stock,
      // Don't send image URLs to backend, backend will handle file uploads
    })) ?? []));
    
    formData.append("sizes", JSON.stringify(product.sizes ?? []));
    formData.append("colors", JSON.stringify(product.colors ?? []));

    // Variant Images - append each file with proper naming
    product.variantFiles?.forEach((files, variantIndex) => {
      files.forEach((file, fileIndex) => {
        formData.append(`variantImages[${variantIndex}]`, file);
      });
    });

    const { data } = await axiosInstance.post("/products/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data?.data;
  },

  // Update an existing product (supports variant images)
  update: async (product: IProductPayload & { 
    variantFiles?: File[][]; // Array of File arrays for each variant
  }) => {
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
    formData.append("stock", product.stock?.toString() ?? "0");
    formData.append("rating", product.rating?.toString() ?? "0");

    // Arrays
    formData.append("variants", JSON.stringify(product.variants?.map(variant => ({
      color: variant.color,
      stock: variant.stock,
      // Don't send image URLs to backend for existing images
    })) ?? []));
    
    formData.append("sizes", JSON.stringify(product.sizes ?? []));
    formData.append("colors", JSON.stringify(product.colors ?? []));

    // Variant Images - append each file with proper naming
    product.variantFiles?.forEach((files, variantIndex) => {
      files.forEach((file, fileIndex) => {
        formData.append(`variantImages[${variantIndex}]`, file);
      });
    });

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