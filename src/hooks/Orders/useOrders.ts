"use client";

import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/orderService"; // create this service
import { IOrderPayload } from "@/types/IOrderPayload";

export const useOrders = () => {
  return useQuery<IOrderPayload[], Error>({
    queryKey: ["orders"], // unique query key
    queryFn: OrderService.getAll, // fetch all orders from backend
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
