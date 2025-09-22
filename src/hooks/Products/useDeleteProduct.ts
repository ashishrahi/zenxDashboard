// hooks/Products/useDeleteProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => ProductService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
