import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { IProductPayload } from "@/types/productTypes";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: Omit<IProductPayload, "_id"> & { variantFiles?: File[][] }) => 
      ProductService.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};