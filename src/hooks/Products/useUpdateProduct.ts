import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { IProductPayload } from "@/types/productTypes";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<IProductPayload, Error, IProductPayload>({
    mutationFn: (product) => {
      if (!product._id) throw new Error("Product ID is required");

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("slug", product.slug);
      formData.append("price", product.price.toString());
      formData.append("stock", product.stock.toString());
      formData.append("categoryId", product.categoryId);
      formData.append("subcategoryId", product.subcategoryId);

      // Optional fields
      if (product.description) formData.append("description", product.description);
      if (product.material) formData.append("material", product.material);
      if (product.care) formData.append("care", product.care);
      if (product.delivery) formData.append("delivery", product.delivery);
      if (product.rating !== undefined) formData.append("rating", product.rating.toString());
      if (product.colors) formData.append("colors", JSON.stringify(product.colors));
      if (product.sizes) formData.append("sizes", JSON.stringify(product.sizes));
      if (product.variants) formData.append("variants", JSON.stringify(product.variants));

      // Append images if any
      if (product.images) {
        product.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      return ProductService.update(product._id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
