import { useQuery } from "@tanstack/react-query";
import { CountryService } from "@/services/countryService"; // Make sure this exists
import { ICountry } from "@/types/countryTypes";

export const useCountry = (id: string) => {
  return useQuery<ICountry, Error>({
    queryKey: ["country", id], // Unique key for caching
    queryFn: () => CountryService.getById(id), // Fetch single country by ID
    staleTime: 1000 * 60 * 5, // Optional: 5 min cache
    enabled: !!id, // Only run if ID is provided
  });
};
