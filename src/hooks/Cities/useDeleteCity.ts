"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CityService } from "@/services/cityService";

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => CityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
};
