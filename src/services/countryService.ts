import axiosInstance from "@/lib/axios";
import { ICountryPayload } from "@/types/ICountryTypes";

export const CountryService = {
  getAll: async (): Promise<ICountryPayload[]> => {
    const response = await axiosInstance.get("/countries");
    return response?.data?.data;
  },

  create: async (country: Omit<ICountryPayload, "_id">): Promise<ICountryPayload> => {
    const response = await axiosInstance.post("/countries/create", country);
    return response?.data;
  },

  update: async (country: ICountryPayload): Promise<ICountryPayload> => {
    if (!country._id) throw new Error("Country _id is required for update");
    const response = await axiosInstance.put(`/countries/update/${country._id}`, country);
    return response?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/countries/delete/${id}`);
  },
};
