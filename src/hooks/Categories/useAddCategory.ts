"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategoryPayload } from "@/types/categoriesTypes";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategoryPayload, Error, Omit<ICategoryPayload, "id">>({
    mutationFn: (newCategory) => {
      // Convert the object to FormData
      const formData = new FormData();
      
      // Append all properties to FormData
      Object.entries(newCategory).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          // Handle multiple images
          value.forEach((file) => {
            formData.append('images', file);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });
      
      return CategoryService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};