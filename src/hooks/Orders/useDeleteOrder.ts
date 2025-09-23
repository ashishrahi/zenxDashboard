"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/orderService"; // create this service

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => OrderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
