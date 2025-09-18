import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/userService";
import { IUser } from "@/types/userTypes";

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, Omit<IUser, "id">>({
    mutationFn: (newUser) => UserService.create(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
