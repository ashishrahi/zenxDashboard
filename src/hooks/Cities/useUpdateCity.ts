"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CityService } from "@/services/cityService";
import { ICityPayload } from "@/types/ICityPayload";

export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation<ICityPayload, Error, ICityPayload>({
    mutationFn: (updatedCity: ICityPayload) => {
      if (!updatedCity._id) {
        throw new Error("City ID is required for update");
      }

      // Pass the city object directly
      return CityService.update(updatedCity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
};
