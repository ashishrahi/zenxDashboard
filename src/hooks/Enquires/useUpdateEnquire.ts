"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EnquireService } from "@/services/enquireService"; // make sure this exists
import { IEnquire } from "@/types/IEnquireTypes";

export const useUpdateEnquire = () => {
  const queryClient = useQueryClient();

  return useMutation<IEnquire, Error, IEnquire>({
    mutationFn: (updatedEnquire: IEnquire) => EnquireService.update(updatedEnquire),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquires"] });
    },
  });
};
