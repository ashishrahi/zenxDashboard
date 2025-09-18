// services/subcategoryService.ts
import axiosInstance from "@/lib/axios";
import { ISubcategory } from "@/types/subcategoryTypes";

export const SubcategoryService = {
  getAll: async (): Promise<ISubcategory[]> => {
    const { data } = await axiosInstance.get("/subcategories");
    return data;
  },

  getById: async (id: string): Promise<ISubcategory> => {
    const { data } = await axiosInstance.get(`/subcategories/${id}`);
    return data;
  },

  create: async (subcategory: Omit<ISubcategory, "id">): Promise<ISubcategory> => {
    const { data } = await axiosInstance.post("/subcategories", subcategory);
    return data;
  },

  update: async (subcategory: ISubcategory): Promise<ISubcategory> => {
    const { data } = await axiosInstance.put(`/subcategories/${subcategory.id}`, subcategory);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subcategories/${id}`);
  },
};
