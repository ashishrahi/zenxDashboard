import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService"; // Make sure this exists
import { ICountry } from "@/types/countryTypes";

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<ICountry, Error, ICountry>({
    mutationFn: (updatedCountry: ICountry) =>
      CountryService.update(updatedCountry.id!, updatedCountry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};
