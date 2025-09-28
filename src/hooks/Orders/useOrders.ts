"use client";

import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/orderService";
import { IOrderPayload } from "@/types/IOrderPayload";

export const useOrders = () => {
  return useQuery<IOrderPayload[], Error>({
    queryKey: ["orders"],      // unique cache key
    queryFn: OrderService.getAll, // calls the service method
    staleTime: 1000 * 60 * 5,  // cache for 5 minutes
  });
};
