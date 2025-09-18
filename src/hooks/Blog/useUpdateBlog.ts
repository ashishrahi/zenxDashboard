import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlog } from "@/types/blogTypes";

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<IBlog, Error, IBlog>({
    mutationFn: (updatedBlog: IBlog) => BlogService.update(updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
