import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/productTypes";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Product>({
    mutationFn: (updatedProduct: Product) => ProductService.update(updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
