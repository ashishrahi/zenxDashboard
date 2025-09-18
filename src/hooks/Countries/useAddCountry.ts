import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService"; // Make sure this exists
import { ICountry } from "@/types/countryTypes";

export const useAddCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<ICountry, Error, Omit<ICountry, "id">>({
    mutationFn: (newCountry) => CountryService.create(newCountry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};
