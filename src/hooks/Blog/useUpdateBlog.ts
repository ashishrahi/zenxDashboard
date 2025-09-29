"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";

export interface BlogApiResponse {
  success: boolean;
  message: string;
  data?: {
    _id?: string;
    id?: string;
    [key: string]: unknown;
  };
}


export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BlogApiResponse,
    Error,
    IBlogPayload & { images?: File[] }
  >({
    mutationFn: (blog) => BlogService.update(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
