"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EnquireService } from "@/services/enquireService"; // create this service
import { IEnquire } from "@/types/IEnquireTypes";

export const useAddEnquire = () => {
  const queryClient = useQueryClient();

  return useMutation<IEnquire, Error, Omit<IEnquire, "_id">>({
    mutationFn: (newEnquire) => EnquireService.create(newEnquire),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquires"] });
    },
  });
};
