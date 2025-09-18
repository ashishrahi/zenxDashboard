import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService"; // Make sure this exists

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => CountryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};
