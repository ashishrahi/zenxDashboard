"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CityService } from "@/services/cityService";
import { ICityPayload } from "@/types/ICityPayload";

export const useAddCity = () => {
  const queryClient = useQueryClient();

  return useMutation<ICityPayload, Error, Omit<ICityPayload, "_id">>({
    mutationFn: (newCity) => {
      // Directly send the city object to the service
      return CityService.create(newCity);
    },
    onSuccess: () => {
      // Invalidate city queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
};
