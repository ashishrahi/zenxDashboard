import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService";
import { ICountryPayload } from "@/types/ICountryTypes";

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<ICountryPayload, Error, ICountryPayload>({
    mutationFn: (updatedCountry: ICountryPayload) => 
      CountryService.update(updatedCountry), // only 1 argument
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};
