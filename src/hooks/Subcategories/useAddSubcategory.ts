"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubcategoryService } from "@/services/subcategoryService";
import { ISubcategory } from "@/types/subcategoryTypes";

export const useAddSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubcategory, Error, Omit<ISubcategory, "_id">>({
    mutationFn: (newSubcategory) => {
      // Convert to FormData
      const formData = new FormData();
      formData.append("name", newSubcategory.name || "");
      formData.append("slug", newSubcategory.slug || "");
      formData.append("description", newSubcategory.description || "");
      formData.append("categoryId", newSubcategory.categoryId);
      newSubcategory.images.forEach((file) => {
        formData.append("images", file); // assumes images are File[]
      });

      return SubcategoryService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};
