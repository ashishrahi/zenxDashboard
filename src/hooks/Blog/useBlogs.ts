import { useQuery } from "@tanstack/react-query";
import { BlogService } from "@/services/blogService";
import { IBlog } from "@/types/blogTypes";

export const useBlogs = () => {
  return useQuery<IBlog[], Error>({
    queryKey: ["blogs"], 
    queryFn: BlogService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
