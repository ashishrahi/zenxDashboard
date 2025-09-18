// services/countryService.ts
import axiosInstance from "@/lib/axios";
import { ICountry } from "@/types/countryTypes";

export const CountryService = {
  // Fetch all countries
  getAll: async (): Promise<ICountry[]> => {
    const { data } = await axiosInstance.get("/countries");
    return data;
  },

  // Fetch a single country by ID
  getById: async (id: string): Promise<ICountry> => {
    const { data } = await axiosInstance.get(`/countries/${id}`);
    return data;
  },

  // Create a new country
  create: async (country: Omit<ICountry, "id">): Promise<ICountry> => {
    const { data } = await axiosInstance.post("/countries", country);
    return data;
  },

  // Update an existing country
  update: async (id: string, country: Partial<ICountry>): Promise<ICountry> => {
    const { data } = await axiosInstance.put(`/countries/${id}`, country);
    return data;
  },

  // Delete a country by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/countries/${id}`);
  },
};
