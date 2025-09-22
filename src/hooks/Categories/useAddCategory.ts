"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategoryPayload } from "@/types/categoriesTypes";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategoryPayload, Error, Omit<ICategoryPayload, "id">>({
    mutationFn: (newCategory) => CategoryService.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
