import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlog } from "@/types/blogTypes";

export const useBlog = (id: string) => {
  return useQuery<IBlog, Error>({
    queryKey: ["blog", id], // unique query key per blog
    queryFn: () => BlogService.getById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
