import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/userService";
import { IUser } from "@/types/userTypes";

export const useUsers = () => {
  return useQuery<IUser[], Error>({
    queryKey: ["users"], // Unique key for user list
    queryFn: UserService.getAll, // Fetch all users
    staleTime: 1000 * 60 * 5, // Optional: 5-minute cache
  });
};
