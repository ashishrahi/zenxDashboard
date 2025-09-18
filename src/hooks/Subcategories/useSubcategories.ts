import { useQuery } from "@tanstack/react-query";
import { SubcategoryService } from "@/services/subcategoryService";
import { ISubcategory } from "@/types/subcategoryTypes";

export const useSubcategories = () => {
  return useQuery<ISubcategory[], Error>({
    queryKey: ["subcategories"], // Unique key for subcategory list
    queryFn: SubcategoryService.getAll, // Fetch all subcategories
    staleTime: 1000 * 60 * 5, // Optional: 5-minute cache
  });
};
