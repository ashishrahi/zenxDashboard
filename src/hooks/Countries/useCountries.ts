import { useQuery } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService";
import { ICountryPayload } from "@/types/ICountryTypes";

export const useCountries = () => {
  return useQuery<ICountryPayload[], Error>({
    queryKey: ["countries"],
    queryFn: CountryService.getAll,
    staleTime: 1000 * 60 * 5,
  });
};
