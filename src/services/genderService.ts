import axiosInstance from "@/lib/axios";
import { IGenderPayload } from "@/types/IGenderPayload";

export const GenderService = {
  getAll: async (): Promise<IGenderPayload[]> => {
    const response = await axiosInstance.get("/genders");
    return response?.data?.data;
  },

  create: async (gender: Omit<IGenderPayload, "_id">): Promise<IGenderPayload> => {
    const response = await axiosInstance.post("/genders/create", gender);
    return response?.data;
  },

  update: async (gender: IGenderPayload): Promise<IGenderPayload> => {
    if (!gender._id) throw new Error("Gender _id is required for update");
    const response = await axiosInstance.put(`/genders/update/${gender._id}`, gender);
    return response?.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/genders/delete/${id}`);
  },
};
