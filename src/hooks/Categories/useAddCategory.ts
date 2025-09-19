"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategory } from "@/types/categoriesTypes";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategory, Error, Omit<ICategory, "id">>({
    mutationFn: (newCategory) => CategoryService.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
