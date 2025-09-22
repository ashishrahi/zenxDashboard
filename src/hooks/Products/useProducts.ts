import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { IProductPayload } from "@/types/productTypes";

export const useProducts = () => {
  return useQuery<IProductPayload[], Error>({
    queryKey: ["products"], 
    queryFn: ProductService.getAll,
    staleTime: 1000 * 60 * 5, 
  });
};
