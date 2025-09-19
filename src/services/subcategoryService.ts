"use client"
import axiosInstance from "@/lib/axios";
import { ISubcategory } from "@/types/subcategoryTypes";

export const SubcategoryService = {
  getAll: async (): Promise<ISubcategory[]> => {
    const { data } = await axiosInstance.get("/subcategories");
    return data?.data;
  },

  getById: async (id: string): Promise<ISubcategory> => {
    const { data } = await axiosInstance.get(`/subcategories/${id}`);
    return data.data;
  },

  create: async (subcategory: Omit<ISubcategory, "id">): Promise<ISubcategory> => {
    const { data } = await axiosInstance.post("/subcategories/create", subcategory);
    return data.data;
  },

  update: async (subcategory: ISubcategory): Promise<ISubcategory> => {
    const { data } = await axiosInstance.put(`/subcategories/${subcategory._id}`, subcategory);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subcategories/${id}`);
  },
};
