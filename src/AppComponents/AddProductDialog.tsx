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

  // Populate form for editing
  useEffect(() => {
    if (productToEdit) {
      (Object.keys(productToEdit) as (keyof IProductPayload)[]).forEach((key) => {
        const value = productToEdit[key];
        if (value !== undefined) {
          setValue(key, value);
        }
      });
    } else {
      reset();
    }
  }, [productToEdit, setValue, reset, isOpen]);

  const generateSlugFromName = (name: string) =>
    name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!productToEdit?.slug || watch("slug") === generateSlugFromName(productToEdit?.name ?? "")) {
      setValue("slug", generateSlugFromName(name));
    }
  };

  // Sync colors from variants automatically
  const variants = watch("variants");
  useEffect(() => {
    const variantColors = variants.map(v => v.color?.trim()).filter(Boolean);
    setValue("colors", Array.from(new Set(variantColors)));
  }, [variants, setValue]);

  const onSubmit = (data: IProductPayload) => {
    const cleanedData: IProductPayload = {
      ...data,
      sizes: data.sizes.map((s) => s.trim()),
      colors: data.colors.map((c) => c.trim()),
      variants: data.variants.map((v) => ({ ...v, images: v.images ?? [] })),
      _id: data._id,
    };

    onSubmitProduct(cleanedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-5xl rounded-xl shadow-2xl border border-border bg-background text-foreground dark:bg-background dark:text-foreground max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-border sticky top-0 z-10 bg-background">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {productToEdit ? <Edit3 size={20} /> : <Plus size={20} />}
            {productToEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input {...register("name", { required: "Product name required" })} onChange={handleNameChange} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label>URL Slug</Label>
            <Input {...register("slug", { required: "Slug required" })} />
            {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price</Label>
            <Input type="number" {...register("price", { required: "Price required" })} />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label>Total Stock</Label>
            <Input type="number" {...register("stock", { required: "Stock required" })} />
            {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
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
                      setValue("subcategoryId", "");
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
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label>Subcategory</Label>
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
          </div>

          {/* Material, Care, Delivery */}
          <div className="space-y-2"><Label>Material</Label><Input {...register("material")} /></div>
          <div className="space-y-2"><Label>Care</Label><Input {...register("care")} /></div>
          <div className="space-y-2"><Label>Delivery Info</Label><Input {...register("delivery")} /></div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <Input type="number" step="0.1" {...register("rating")} />
          </div>

          {/* Sizes & Colors */}
          <div className="space-y-2 md:col-span-2">
            <Label>Sizes (comma separated)</Label>
            <Input
              placeholder="e.g., S,M,L"
              value={watch("sizes").join(",")}
              onChange={(e) => setValue("sizes", e.target.value.split(",").map(s => s.trim()))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Colors (comma separated)</Label>
            <Input
              placeholder="e.g., Red,Blue"
              value={watch("colors").join(",")}
              onChange={(e) => setValue("colors", e.target.value.split(",").map(c => c.trim()))}
            />
          </div>

          {/* Variants */}
          <div className="space-y-2 md:col-span-2">
            <Label>Variants</Label>
            {variantFields.map((variant, index) => (
              <div key={variant.id} className="flex flex-col gap-2 mb-4 border p-2 rounded-lg">
                <div className="flex gap-2 items-center">
                  <Input {...register(`variants.${index}.color` as const)} placeholder="Color" />
                  <Input type="number" {...register(`variants.${index}.stock` as const)} placeholder="Stock" />
                  <Button type="button" variant="destructive" onClick={() => removeVariant(index)}>
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Variant Images */}
                <div>
                  <label htmlFor={`variantUpload-${index}`} className="cursor-pointer bg-secondary px-3 py-1 rounded text-white">
                    Upload Variant Images
                  </label>
                  <input
                    id={`variantUpload-${index}`}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      const updated = [...watch("variants")];
                      const blobUrls = Array.from(files).map(file => URL.createObjectURL(file));
                      updated[index].images = [...(updated[index].images || []), ...blobUrls];
                      setValue("variants", updated);
                    }}
                  />
                  {watch("variants")[index]?.images?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {watch("variants")[index].images.map((url: string, i: number) => (
                        <div key={i} className="relative w-20 h-20">
                          <Image src={url} alt={`variant-${index}-${i}`} fill className="object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...watch("variants")];
                              updated[index].images = updated[index].images.filter((_, imgIdx) => imgIdx !== i);
                              setValue("variants", updated);
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center"
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
            <Button type="button" onClick={() => appendVariant({ color: "", stock: 0, images: [] })}>
              <Plus size={16} /> Add Variant
            </Button>
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea {...register("description")} />
          </div>

          {/* Actions */}
          <DialogFooter className="mt-4 flex justify-end gap-3 md:col-span-2">
            <Button variant="destructive" type="button" onClick={onClose}>
              <XCircle size={16} /> Cancel
            </Button>
            <Button type="submit">
              {productToEdit ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
