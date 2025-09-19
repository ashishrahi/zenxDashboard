"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
