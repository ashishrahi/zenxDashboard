import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { IProductPayload } from "@/types/productTypes";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<IProductPayload, Error, Omit<IProductPayload, "id">>({
    mutationFn: (newProduct) => ProductService.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
