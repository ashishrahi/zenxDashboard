"use client"
import axiosInstance from "@/lib/axios";
import { IStatePayload } from "@/types/IStateTypes";

export const StateService = {
  getAll: async (): Promise<IStatePayload[]> => {
    const { data } = await axiosInstance.get("/states");
    return data?.data;
  },

  getById: async (id: string): Promise<IStatePayload> => {
    const { data } = await axiosInstance.get(`/states/${id}`);
    return data?.data;
  },

  create: async (state: Omit<IStatePayload, "_id">): Promise<IStatePayload> => {
    const { data } = await axiosInstance.post("/states/create", state);
    return data?.data;
  },

  update: async (state: IStatePayload): Promise<IStatePayload> => {
    if (!state._id) throw new Error("State _id is required for update");
    const { data } = await axiosInstance.put(`/states/update/${state._id}`, state);
    return data?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/states/${id}`);
  },
};
