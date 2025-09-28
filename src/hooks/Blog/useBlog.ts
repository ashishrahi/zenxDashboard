"use client";
import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";

export const useBlog = (id: string) => {
  return useQuery<IBlogPayload, Error>({
    queryKey: ["blog", id], // Unique cache key for this blog
    queryFn: () => BlogService.getById(id), // Fetch function for a single blog
    enabled: !!id, // Only run query if id exists
    staleTime: 1000 * 60 * 5, // Optional: cache for 5 minutes
  });
};
