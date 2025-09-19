"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubcategoryService } from "@/services/subcategoryService";
import { ISubcategory } from "@/types/subcategoryTypes";

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubcategory, Error, ISubcategory>({
    mutationFn: (updatedSubcategory: ISubcategory) =>
      SubcategoryService.update(updatedSubcategory.id!, updatedSubcategory),
    onSuccess: () => {
      // Refresh the subcategory list after successful update
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};
