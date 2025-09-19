"use client"

import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategory } from "@/types/categoriesTypes";

export const useCategories = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories"], 
    queryFn: CategoryService.getAll, 
    staleTime: 1000 * 60 * 5, 
  });
};
