"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategoryPayload } from "@/types/categoriesTypes";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategoryPayload, Error, ICategoryPayload>({
    mutationFn: (updatedCategory: ICategoryPayload) => CategoryService.update(updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
