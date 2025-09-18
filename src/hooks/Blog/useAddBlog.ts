import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlog } from "@/types/blogTypes";

export const useAddBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<IBlog, Error, Omit<IBlog, "id">>({
    mutationFn: (newBlog) => BlogService.create(newBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
