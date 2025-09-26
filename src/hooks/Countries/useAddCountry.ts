import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService"; // Make sure this exists
import { ICountryPayload } from "@/types/ICountryTypes";

export const useAddCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<ICountryPayload, Error, Omit<ICountryPayload, "_id">>({
    mutationFn: (newCountry) => CountryService.create(newCountry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};
