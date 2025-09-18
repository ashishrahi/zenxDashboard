import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/productTypes";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Omit<Product, "id">>({
    mutationFn: (newProduct) => ProductService.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
