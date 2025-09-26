"use client"

import { useQuery } from "@tanstack/react-query";
import { StateService } from "@/services/StateService";
import { IStatePayload } from "@/types/IStateTypes";

export const useStates = () => {
  return useQuery<IStatePayload[], Error>({
    queryKey: ["states"],
    queryFn: StateService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
