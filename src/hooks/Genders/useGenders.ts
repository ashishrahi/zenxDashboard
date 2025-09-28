import { useQuery } from "@tanstack/react-query";
import { GenderService } from "@/services/genderService";
import { IGenderPayload } from "@/types/IGenderPayload";

export const useGenders = () => {
  return useQuery<IGenderPayload[], Error>({
    queryKey: ["genders"],
    queryFn: GenderService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
