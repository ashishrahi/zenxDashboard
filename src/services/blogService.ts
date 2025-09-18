// services/blogService.ts
import axiosInstance from "@/lib/axios";
import { IBlog } from "@/types/blogTypes";

export const BlogService = {
  getAll: async (): Promise<IBlog[]> => {
    const { data } = await axiosInstance.get("/blogs");
    return data;
  },

  getById: async (id: string): Promise<IBlog> => {
    const { data } = await axiosInstance.get(`/blogs/${id}`);
    return data;
  },

  create: async (blog: Omit<IBlog, "id">): Promise<IBlog> => {
    const { data } = await axiosInstance.post("/blogs", blog);
    return data;
  },

  update: async (blog: IBlog): Promise<IBlog> => {
    const { data } = await axiosInstance.put(`/blogs/${blog.id}`, blog);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/blogs/${id}`);
  },
};
