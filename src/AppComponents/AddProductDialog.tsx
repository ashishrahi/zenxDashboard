"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, XCircle, Edit3, Plus } from "lucide-react";
import { useCategories } from "@/hooks/Categories/useCategories";
import { useSubcategories } from "@/hooks/Subcategories/useSubcategories";
import { IProductPayload, AddProductDialogProps } from "@/types/productTypes";
import Image from "next/image";

export function AddProductDialog({
  isOpen,
  onClose,
  onSubmitProduct,
  productToEdit,
}: AddProductDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IProductPayload>({
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      description: "",
      categoryId: "",
      subcategoryId: "",
      sizes: [],
      colors: [],
      variants: [],
      material: "",
      care: "",
      delivery: "",
      rating: 0,
      stock: 0,
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } =
    useFieldArray({ control, name: "variants" });

  const { data: categories = [] } = useCategories();
  const selectedCategoryId = watch("categoryId");
  const { data: subcategories = [] } = useSubcategories();
  const [categorySearch, setCategorySearch] = useState("");
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [variantFiles, setVariantFiles] = useState<File[][]>([]); // File objects per variant

  // Populate form when editing
  useEffect(() => {
    if (productToEdit) {
      // Populate all fields
      (Object.keys(productToEdit) as (keyof IProductPayload)[]).forEach((key) => {
        const value = productToEdit[key];
        if (value !== undefined) setValue(key, value);
      });

      setValue("categoryId", productToEdit.categoryId || "");
      setValue("subcategoryId", productToEdit.subcategoryId || "");

      // Ensure variants include images
      const variantsWithImages = productToEdit.variants?.map((v) => ({
        ...v,
        images: v.images || [],
      })) || [];
      setValue("variants", variantsWithImages);

      // Initialize variantFiles as empty arrays
      const filesInit = variantsWithImages.map(() => []);
      setVariantFiles(filesInit);

      // Populate colors from variants
      const variantColors = variantsWithImages.map((v) => v.color?.trim()).filter(Boolean);
      setValue("colors", Array.from(new Set(variantColors)));
    } else {
      reset();
      setVariantFiles([]);
    }
  }, [productToEdit, setValue, reset, isOpen]);

  // Slug generator
  const generateSlugFromName = (name: string) =>
    name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);

    if (!productToEdit?.slug || watch("slug") === generateSlugFromName(watch("name"))) {
      setValue("slug", generateSlugFromName(name));
    }
  };

  // Sync colors from variants on change
  const variants = watch("variants");
  useEffect(() => {
    const variantColors = variants.map((v) => v.color?.trim()).filter(Boolean);
    setValue("colors", Array.from(new Set(variantColors)));
  }, [variants, setValue]);

  // Handle file upload for variants
  const handleVariantImageUpload = (variantIndex: number, files: FileList) => {
    if (!files) return;

    // Create blob URLs for preview
    const blobUrls = Array.from(files).map((file) => URL.createObjectURL(file));

    // Update variant images for preview
    const updatedVariants = [...watch("variants")];
    updatedVariants[variantIndex].images = [
      ...(updatedVariants[variantIndex].images || []),
      ...blobUrls,
    ];
    setValue("variants", updatedVariants);

    // Update the actual files array
    setVariantFiles((prev) => {
      const copy = [...prev];
      copy[variantIndex] = [...(copy[variantIndex] || []), ...Array.from(files)];
      return copy;
    });
  };

  // Remove variant image
  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    // Remove from preview
    const updatedVariants = [...watch("variants")];
    updatedVariants[variantIndex].images = updatedVariants[variantIndex].images.filter(
      (_, imgIdx) => imgIdx !== imageIndex
    );
    setValue("variants", updatedVariants);

    // Remove from files array
    setVariantFiles((prev) => {
      const copy = [...prev];
      copy[variantIndex] = copy[variantIndex]?.filter((_, imgIdx) => imgIdx !== imageIndex) || [];
      return copy;
    });
  };

  // Submit handler
  const onSubmit = (data: IProductPayload) => {
    if (!data.name || !data.slug || !data.categoryId || !data.subcategoryId) {
      alert("Please fill all required fields");
      return;
    }

    // Prepare the data with variant files
    const productData = {
      ...data,
      variantFiles: variantFiles,
    };

    onSubmitProduct(productData);
    reset();
    setVariantFiles([]);
    onClose();
  };

  // Add new variant
  const handleAddVariant = () => {
    appendVariant({ color: "", stock: 0, images: [] });
    setVariantFiles((prev) => [...prev, []]);
  };

  // Remove variant
  const handleRemoveVariant = (index: number) => {
    removeVariant(index);
    setVariantFiles((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-5xl rounded-xl shadow-2xl border border-border bg-background text-foreground max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-border sticky top-0 z-10 bg-background">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {productToEdit ? <Edit3 size={20} /> : <Plus size={20} />}
            {productToEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input {...register("name", { required: "Product name required" })} onChange={handleNameChange} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label>URL Slug *</Label>
            <Input {...register("slug", { required: "Slug required" })} />
            {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price *</Label>
            <Input
              type="number"
              step="0.01"
              {...register("price", {
                required: "Price required",
                min: { value: 0, message: "Price must be positive" },
              })}
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label>Total Stock *</Label>
            <Input
              type="number"
              {...register("stock", {
                required: "Stock required",
                min: { value: 0, message: "Stock must be positive" },
              })}
            />
            {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category required" }}
              render={({ field }) => {
                const filteredCategories = categories.filter((cat) =>
                  cat.name.toLowerCase().includes(categorySearch.toLowerCase())
                );
                return (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("subcategoryId", ""); // reset subcategory
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search category..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="mb-2"
                        />
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label>Subcategory *</Label>
            <Controller
              name="subcategoryId"
              control={control}
              rules={{ required: "Subcategory required" }}
              render={({ field }) => {
                const filteredSubcategories = subcategories.filter(
                  (sub) =>
                    String(sub.categoryId) === String(selectedCategoryId) &&
                    sub.name?.toLowerCase().includes(subcategorySearch.toLowerCase())
                );

                return (
                  <Select value={field.value} onValueChange={field.onChange} disabled={!selectedCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCategoryId ? "Select Subcategory" : "Select Category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search subcategory..."
                          value={subcategorySearch}
                          onChange={(e) => setSubcategorySearch(e.target.value)}
                          className="mb-2"
                        />
                        {filteredSubcategories.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id ?? ""}>
                            {sub.name ?? "Unnamed Subcategory"}
                          </SelectItem>
                        ))}
                        {filteredSubcategories.length === 0 && (
                          <p className="text-sm text-muted-foreground">No subcategories available</p>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.subcategoryId && <p className="text-red-500 text-xs">{errors.subcategoryId.message}</p>}
          </div>

          {/* Material, Care, Delivery */}
          <div className="space-y-2">
            <Label>Material</Label>
            <Input {...register("material")} />
          </div>
          <div className="space-y-2">
            <Label>Care Instructions</Label>
            <Input {...register("care")} />
          </div>
          <div className="space-y-2">
            <Label>Delivery Info</Label>
            <Input {...register("delivery")} />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <Input type="number" step="0.1" min="0" max="5" {...register("rating")} />
          </div>

          {/* Sizes & Colors */}
          <div className="space-y-2 md:col-span-2">
            <Label>Sizes (comma separated)</Label>
            <Input
              placeholder="e.g., S,M,L"
              value={watch("sizes").join(",")}
              onChange={(e) =>
                setValue("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Colors (comma separated)</Label>
            <Input
              placeholder="e.g., Red,Blue"
              value={watch("colors").join(",")}
              onChange={(e) =>
                setValue("colors", e.target.value.split(",").map((c) => c.trim()).filter(Boolean))
              }
            />
          </div>

          {/* Variants Section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex justify-between items-center">
              <Label className="text-lg">Variants</Label>
              <Button type="button" onClick={handleAddVariant} className="flex items-center gap-2">
                <Plus size={16} /> Add Variant
              </Button>
            </div>

            {variantFields.map((variant, index) => (
              <div key={variant.id} className="border p-4 rounded-lg space-y-3">
                <div className="flex gap-3 items-start">
                  {/* Variant Color */}
                  <div className="flex-1 space-y-2">
                    <Label>Color *</Label>
                    <Input
                      {...register(`variants.${index}.color`, { required: "Variant color required" })}
                      placeholder="e.g., Red, Blue, Black"
                    />
                    {errors.variants?.[index]?.color && (
                      <p className="text-red-500 text-xs">{errors.variants[index]?.color?.message}</p>
                    )}
                  </div>

                  {/* Variant Stock */}
                  <div className="flex-1 space-y-2">
                    <Label>Stock *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock`, {
                        required: "Variant stock required",
                        min: { value: 0, message: "Stock must be positive" },
                      })}
                      placeholder="0"
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="text-red-500 text-xs">{errors.variants[index]?.stock?.message}</p>
                    )}
                  </div>

                  {/* Remove Variant Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveVariant(index)}
                    className="mt-6"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Variant Images */}
                <div className="space-y-2">
                  <Label>Variant Images</Label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor={`variantUpload-${index}`}
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm font-medium"
                    >
                      Upload Images
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {variantFiles[index]?.length || 0} files selected
                    </span>
                  </div>

                  <input
                    id={`variantUpload-${index}`}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleVariantImageUpload(index, e.target.files!)}
                  />

                  {/* Image Previews */}
                  {watch("variants")[index]?.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {watch("variants")[index].images.map((url: string, imageIndex: number) => (
                        <div key={imageIndex} className="relative w-20 h-20 border rounded overflow-hidden">
                          <Image src={url} alt={`variant-${index}-${imageIndex}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(index, imageIndex)}
                            className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-700"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea {...register("description")} placeholder="Enter product description..." rows={4} />
          </div>

          {/* Actions */}
          <DialogFooter className="mt-4 flex justify-end gap-3 md:col-span-2">
            <Button variant="outline" type="button" onClick={onClose}>
              <XCircle size={16} className="mr-2" /> Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {productToEdit ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
