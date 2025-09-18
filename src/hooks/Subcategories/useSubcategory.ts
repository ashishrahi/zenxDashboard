import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/userService";
import { IUser } from "@/types/userTypes";

export const useUser = (id: string) => {
  return useQuery<IUser, Error>({
    queryKey: ["user", id], // Unique key for caching
    queryFn: () => UserService.getById(id), // Fetch single user by ID
    staleTime: 1000 * 60 * 5, // Optional: 5 min cache
    enabled: !!id, // Only run if ID is provided
  });
};
