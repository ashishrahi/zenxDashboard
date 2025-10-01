"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/orderService";
import { IOrderPayload } from "@/types/IOrderPayload";

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<IOrderPayload, Error, Partial<IOrderPayload> & { _id: string }>({
    mutationFn: (updatedOrder: Partial<IOrderPayload> & { _id: string }) =>
      OrderService.update(updatedOrder._id, updatedOrder), // Pass ID and partial data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};