"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IBlogPayload,
    Error,
    IBlogPayload & { images?: File[] }
  >({
    mutationFn: (blog) => BlogService.update(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
