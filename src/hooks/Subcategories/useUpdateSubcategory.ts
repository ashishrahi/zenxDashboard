"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubcategoryService } from "@/services/subcategoryService";
import { ISubcategory } from "@/types/subcategoryTypes";

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubcategory, Error, ISubcategory>({
    mutationFn: (updatedSubcategory: ISubcategory) => {
      if (!updatedSubcategory._id) {
        throw new Error("Subcategory ID is required for update");
      }

      const formData = new FormData();
      formData.append("name", updatedSubcategory.name || "");
      formData.append("slug", updatedSubcategory.slug || "");
      formData.append("description", updatedSubcategory.description || "");
      formData.append("categoryId", updatedSubcategory.categoryId);

      // Handle images safely
      if (updatedSubcategory.images) {
        updatedSubcategory.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      return SubcategoryService.update(updatedSubcategory._id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};