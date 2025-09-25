"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/categoryService";
import { ICategoryPayload } from "@/types/categoriesTypes";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ICategoryPayload, Error, ICategoryPayload>({
    mutationFn: (updatedCategory: ICategoryPayload) => {
      if (!updatedCategory._id) {
        throw new Error("Category ID is required for update");
      }
      
      // Convert the category object to FormData
      const formData = new FormData();
      
      Object.entries(updatedCategory).forEach(([key, value]) => {
        if (key === '_id') return; // Don't include ID in FormData
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append('images', file);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });
      
      return CategoryService.update(updatedCategory._id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};