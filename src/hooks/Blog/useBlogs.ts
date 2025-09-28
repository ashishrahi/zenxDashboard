"use client"
import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";

export const useBlogs = () => {
  return useQuery<IBlogPayload[], Error>({
    queryKey: ["blogs"], 
    queryFn: BlogService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
