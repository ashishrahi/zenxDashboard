import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/userService";
import { IUser } from "@/types/userTypes";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, IUser>({
    mutationFn: (updatedUser: IUser) => UserService.update(updatedUser.id, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
