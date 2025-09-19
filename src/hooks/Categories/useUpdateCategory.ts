"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategory } from "@/types/categoriesTypes";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategory, Error, ICategory>({
    mutationFn: (updatedCategory: ICategory) => CategoryService.update(updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
