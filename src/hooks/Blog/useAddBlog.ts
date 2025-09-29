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

export const useAddBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BlogApiResponse,
    Error,
    Omit<IBlogPayload, "_id"> & { images?: File[] }
  >({
    mutationFn: (newBlog) => BlogService.create(newBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
