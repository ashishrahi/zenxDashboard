import axiosInstance from "@/lib/axios";
import { IGenderPayload } from "@/types/IGenderPayload";

export const GenderService = {
  getAll: async (): Promise<IGenderPayload[]> => {
    const { data } = await axiosInstance.get("/genders");
    return data?.data;
  },

  create: async (gender: Omit<IGenderPayload, "_id">): Promise<IGenderPayload> => {
    const { data } = await axiosInstance.post("/genders/create", gender);
    return data?.data;
  },

  update: async (gender: IGenderPayload): Promise<IGenderPayload> => {
    if (!gender._id) throw new Error("Gender _id is required for update");
    const { data } = await axiosInstance.put(`/genders/update/${gender._id}`, gender);
    return data?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/genders/delete/${id}`);
  },
};
