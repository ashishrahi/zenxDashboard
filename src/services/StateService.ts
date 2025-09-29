"use client"
import axiosInstance from "@/lib/axios";
import { IStatePayload } from "@/types/IStateTypes";

export const StateService = {
  getAll: async (): Promise<IStatePayload[]> => {
    const response = await axiosInstance.get("/states");
    return response?.data?.data;
  },

  getById: async (id: string): Promise<IStatePayload> => {
    const response = await axiosInstance.get(`/states/${id}`);
    return response?.data?.data;
  },

  create: async (state: Omit<IStatePayload, "_id">): Promise<IStatePayload> => {
    const response = await axiosInstance.post("/states/create", state);
    return response?.data;
  },

  update: async (state: IStatePayload): Promise<IStatePayload> => {
    if (!state._id) throw new Error("State _id is required for update");
    const response = await axiosInstance.put(`/states/update/${state._id}`, state);
    return response?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/states/${id}`);
  },
};
