"use client";

import { useQuery } from "@tanstack/react-query";
import { SubcategoryService } from "@/services/subcategoryService"; // Make sure you have this service
import { ISubcategory } from "@/types/subcategoryTypes"; // Your subcategory type

export const useSubCategory = (id: string) => {
  return useQuery<ISubcategory, Error>({
    queryKey: ["subcategory", id], // Unique key for caching
    queryFn: () => SubcategoryService.getById(id), // Fetch single subcategory by ID
    staleTime: 1000 * 60 * 5, // Optional: 5 min cache
    enabled: !!id, // Only run if ID is provided
  });
};
