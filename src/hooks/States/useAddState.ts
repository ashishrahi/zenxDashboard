"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StateService } from "@/services/StateService";
import { IStatePayload } from "@/types/IStateTypes";

export const useAddState = () => {
  const queryClient = useQueryClient();

  return useMutation<IStatePayload, Error, Omit<IStatePayload, "_id">>({
    mutationFn: (newState) => {
      return StateService.create(newState); // send JSON directly
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
    },
  });
};
