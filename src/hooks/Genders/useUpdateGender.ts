import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GenderService } from "@/services/genderService";
import { IGenderPayload } from "@/types/IGenderPayload";

export const useUpdateGender = () => {
  const queryClient = useQueryClient();

  return useMutation<IGenderPayload, Error, IGenderPayload>({
    mutationFn: (updatedGender: IGenderPayload) =>
      GenderService.update(updatedGender), // only 1 argument
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genders"] });
    },
  });
};
