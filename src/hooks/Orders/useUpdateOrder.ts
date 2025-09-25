"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/orderService";
import { IOrderPayload } from "@/types/IOrderPayload";

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<IOrderPayload, Error, IOrderPayload>({
    mutationFn: (updatedOrder: IOrderPayload) =>
      OrderService.update(updatedOrder), // Pass only the object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};