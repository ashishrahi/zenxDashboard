import { useQuery } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService"; // Make sure you have this service
import { ICountry } from "@/types/countryTypes";

export const useCountries = () => {
  return useQuery<ICountry[], Error>({
    queryKey: ["countries"], // Unique key for country list
    queryFn: CountryService.getAll, // Fetch all countries
    staleTime: 1000 * 60 * 5, // Optional: 5-minute cache
  });
};
