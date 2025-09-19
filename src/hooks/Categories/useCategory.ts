"use client"
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategory } from "@/types/categoriesTypes";

export const useCategory = (id: string) => {
  return useQuery<ICategory, Error>({
    queryKey: ["category", id],      // unique key for this category
    queryFn: () => CategoryService.getById(id), // fetch function for a single category
    staleTime: 1000 * 60 * 5,       // optional: 5 min cache
  });
};
