"use client";

import { useQuery } from "@tanstack/react-query";
import { CityService } from "@/services/cityService";
import { ICityPayload } from "@/types/ICityPayload";

export const useCities = () => {
  return useQuery<ICityPayload[], Error>({
    queryKey: ["cities"], // Key for city queries
    queryFn: CityService.getAll, // Fetch all cities
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
