"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";

export const useAddBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IBlogPayload,
    Error,
    Omit<IBlogPayload, "_id"> & { images?: File[] }
  >({
    mutationFn: (newBlog) => BlogService.create(newBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
