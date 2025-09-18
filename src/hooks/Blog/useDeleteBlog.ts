import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => BlogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
