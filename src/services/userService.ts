// services/userService.ts
import axiosInstance from "@/lib/axios";
import { IUser } from "@/types/userTypes";

export const UserService = {
  // Fetch all users
  getAll: async (): Promise<IUser[]> => {
    const { data } = await axiosInstance.get("/users");
    return data;
  },

  // Fetch a single user by ID
  getById: async (id: string): Promise<IUser> => {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  },

  // Create a new user
  create: async (user: Omit<IUser, "id">): Promise<IUser> => {
    const { data } = await axiosInstance.post("/users", user);
    return data;
  },

  // Update an existing user
  update: async (id: string, user: Partial<IUser>): Promise<IUser> => {
    const { data } = await axiosInstance.put(`/users/${id}`, user);
    return data;
  },

  // Delete a user by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
