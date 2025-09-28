import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GenderService } from "@/services/genderService"; // Make sure this exists
import { IGenderPayload } from "@/types/IGenderPayload";

export const useAddGender = () => {
  const queryClient = useQueryClient();

  return useMutation<IGenderPayload, Error, Omit<IGenderPayload, "_id">>({
    mutationFn: (newGender) => GenderService.create(newGender),
    onSuccess: () => {
      // Invalidate the "genders" query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["genders"] });
    },
  });
};
