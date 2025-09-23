"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/orderService"; // create this service
import { IOrderPayload } from "@/types/IOrderPayload"; // define this type

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<IOrderPayload, Error, IOrderPayload>({
    mutationFn: (updatedOrder: IOrderPayload) =>
      OrderService.update(updatedOrder._id, updatedOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
