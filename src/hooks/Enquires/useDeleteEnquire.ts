"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EnquireService } from "@/services/enquireService"; // create this service

export const useDeleteEnquire = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => EnquireService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquires"] });
    },
  });
};
