import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubcategoryService } from "@/services/subcategoryService";
import { ISubcategory } from "@/types/subcategoryTypes";

export const useAddSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ISubcategory, Error, Omit<ISubcategory, "id">>({
    mutationFn: (newSubcategory) => SubcategoryService.create(newSubcategory),
    onSuccess: () => {
      // Invalidate the "subcategories" query so the list refreshes
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};
