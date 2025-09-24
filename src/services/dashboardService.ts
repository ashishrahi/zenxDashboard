import { IDashboard } from "@/types/IDashboardTypes";
import axiosInstance from "@/lib/axios";

export const DashboardService = {
  getMetrics: async (): Promise<IDashboard> => {
    const response = await axiosInstance.get("/dashboard"); // your backend endpoint
    return response?.data?.data; // assuming your API returns { success, data, message }
  },
};
