import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubcategoryService } from "@/services/subcategoryService";

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => SubcategoryService.delete(id),
    onSuccess: () => {
      // Refresh the subcategory list after deletion
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};
