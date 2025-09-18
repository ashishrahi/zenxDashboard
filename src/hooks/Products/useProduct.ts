import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/productTypes";

export const useProduct = (id: string) => {
  return useQuery<Product, Error>({
    queryKey: ["product", id],      // <-- key must be here
    queryFn: () => ProductService.getById(id), // <-- fetch function
    staleTime: 1000 * 60 * 5,       // optional: 5 min cache
  });
};
