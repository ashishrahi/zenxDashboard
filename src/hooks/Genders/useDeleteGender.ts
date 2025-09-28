import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GenderService } from "@/services/genderService"; // Make sure this exists

export const useDeleteGender = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => GenderService.delete(id),
    onSuccess: () => {
      // Invalidate the "genders" query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["genders"] });
    },
  });
};
