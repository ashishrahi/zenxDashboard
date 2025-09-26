"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StateService } from "@/services/StateService";

export const useDeleteState = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => StateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
    },
  });
};
