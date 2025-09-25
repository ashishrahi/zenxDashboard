"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/productService";
import { IProductPayload } from "@/types/productTypes";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<IProductPayload, Error, Omit<IProductPayload, "_id"> & { variantFiles?: File[][] }>({
    mutationFn: (newProduct) => {
      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("slug", newProduct.slug);
      formData.append("price", newProduct.price.toString());
      formData.append("stock", newProduct.stock.toString());
      formData.append("categoryId", newProduct.categoryId);
      formData.append("subcategoryId", newProduct.subcategoryId);

      if (newProduct.description) formData.append("description", newProduct.description);
      if (newProduct.material) formData.append("material", newProduct.material);
      if (newProduct.care) formData.append("care", newProduct.care);
      if (newProduct.delivery) formData.append("delivery", newProduct.delivery);
      if (newProduct.rating !== undefined) formData.append("rating", newProduct.rating.toString());
      if (newProduct.colors) formData.append("colors", JSON.stringify(newProduct.colors));
      if (newProduct.sizes) formData.append("sizes", JSON.stringify(newProduct.sizes));
      if (newProduct.variants) formData.append("variants", JSON.stringify(newProduct.variants));

      // Append images from variantFiles
      newProduct.variantFiles?.forEach((files, idx) => {
        files.forEach((file) => formData.append(`variants[${idx}][images]`, file));
      });

      return ProductService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
