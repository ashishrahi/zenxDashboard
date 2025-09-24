"use client"
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboardService";
import { IDashboard } from "@/types/IDashboardTypes";

export const useDashboard = () => {
  return useQuery<IDashboard, Error>({
    queryKey: ["dashboardMetrics"],
    queryFn: DashboardService.getMetrics,
    staleTime: 1000 * 60 * 5,
  });
};
