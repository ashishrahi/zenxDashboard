"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StateService } from "@/services/StateService";
import { IStatePayload } from "@/types/IStateTypes";

export const useUpdateState = () => {
  const queryClient = useQueryClient();

  return useMutation<IStatePayload, Error, IStatePayload>({
    mutationFn: (updatedState: IStatePayload) => {
      if (!updatedState._id) {
        throw new Error("State ID is required for update");
      }

      return StateService.update(updatedState); // ✅ pass the whole object
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
    },
  });
};
