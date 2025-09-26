import axiosInstance from "@/lib/axios";
import { ICountryPayload } from "@/types/ICountryTypes";

export const CountryService = {
  getAll: async (): Promise<ICountryPayload[]> => {
    const { data } = await axiosInstance.get("/countries");
    return data?.data;
  },

  create: async (country: Omit<ICountryPayload, "_id">): Promise<ICountryPayload> => {
    const { data } = await axiosInstance.post("/countries/create", country);
    return data?.data;
  },

  update: async (country: ICountryPayload): Promise<ICountryPayload> => {
    if (!country._id) throw new Error("Country _id is required for update");
    const { data } = await axiosInstance.put(`/countries/update/${country._id}`, country);
    return data?.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/countries/delete/${id}`);
  },
};
