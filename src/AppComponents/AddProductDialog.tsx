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
import { Upload, Trash2, XCircle, Edit3, Plus } from "lucide-react";
import { useCategories } from "@/hooks/Categories/useCategories";
import { useSubcategories } from "@/hooks/Subcategories/useSubcategories";
import { IProductPayload, AddProductDialogProps, IProductVariant } from "@/types/productTypes";
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
      category: "",
      subCategory: "",
      sizes: [],
      colors: [],
      variants: [],
      material: "",
      care: "",
      delivery: "",
      rating: 0,
      stock: 0,
      images: [],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } =
    useFieldArray({ control, name: "variants" });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories = [] } = useCategories();
  const selectedCategoryId = watch("category");
  const { data: subcategories = [] } = useSubcategories();
  const [categorySearch, setCategorySearch] = useState("");
  const [subcategorySearch, setSubcategorySearch] = useState("");

  // Populate form for editing (type-safe)
  useEffect(() => {
    if (productToEdit) {
      setValue("name", productToEdit.name ?? "");
      setValue("slug", productToEdit.slug ?? "");
      setValue("price", productToEdit.price ?? 0);
      setValue("description", productToEdit.description ?? "");
      setValue("category", productToEdit.category ?? "");
      setValue("subCategory", productToEdit.subCategory ?? "");
      setValue("sizes", productToEdit.sizes ?? []);
      setValue("colors", productToEdit.colors ?? []);
      setValue("variants", productToEdit.variants ?? []);
      setValue("material", productToEdit.material ?? "");
      setValue("care", productToEdit.care ?? "");
      setValue("delivery", productToEdit.delivery ?? "");
      setValue("rating", productToEdit.rating ?? 0);
      setValue("stock", productToEdit.stock ?? 0);
      setValue("images", productToEdit.images ?? []);

      setUploadedImages(productToEdit.images ?? []);
    } else {
      reset();
      setUploadedImages([]);
    }
  }, [productToEdit, setValue, reset, isOpen]);

  // Handle main product images
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);
    try {
      const newUrls = await Promise.all(
        Array.from(files).map(
          (file) =>
            new Promise<string>((resolve) =>
              setTimeout(() => resolve(URL.createObjectURL(file)), 500)
            )
        )
      );
      const allImages = [...uploadedImages, ...newUrls];
      setUploadedImages(allImages);
      setValue("images", allImages);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  // Handle variant images
  const handleVariantImageChange = (index: number, files: FileList | null) => {
    if (!files) return;
    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    const variants = watch("variants");
    const updatedVariants = [...variants];
    updatedVariants[index].images = [...(updatedVariants[index].images || []), ...newUrls];
    setValue("variants", updatedVariants);
  };

  const generateSlugFromName = (name: string) =>
    name?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")?.replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!productToEdit?.slug || watch("slug") === generateSlugFromName(productToEdit?.name ?? "")) {
      setValue("slug", generateSlugFromName(name));
    }
  };

  const onSubmit = (data: IProductPayload) => {
    const sanitizedVariants = data.variants.map((v: IProductVariant) => ({
      color: v.color,
      stock: v.stock,
      images: v.images || [],
      ...(v._id ? { _id: v._id } : {}),
    }));

    const sanitizedData: IProductPayload = {
      ...data,
      variants: sanitizedVariants,
    };

    // Remove _id if creating a new product
    if (!data._id) delete sanitizedData._id;

    onSubmitProduct(sanitizedData);
    reset();
    setUploadedImages([]);
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl rounded-xl shadow-2xl border border-border bg-background text-foreground dark:bg-background dark:text-foreground max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-border sticky top-0 z-10 bg-background">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {productToEdit ? <Edit3 size={20} /> : <Upload size={20} />}
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

          {/* Category & Subcategory */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Controller
              name="category"
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
                      setValue("subCategory", ""); // reset subcategory
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

          <div className="space-y-2">
            <Label>Subcategory</Label>
            <Controller
              name="subCategory"
              control={control}
              rules={{ required: "Subcategory required" }}
              render={({ field }) => {


                const filteredSubcategories = subcategories.filter(
                  (sub) =>
                    sub.categoryId === selectedCategoryId &&
                    sub.name?.toLowerCase().includes(subcategorySearch.toLowerCase())
                );


                return (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedCategoryId
                            ? "Select Subcategory"
                            : "Select Category first"
                        }
                      />
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
                          <SelectItem
                            key={sub._id ?? sub._id ?? Math.random().toString()} // fallback key if _id missing
                            value={sub._id ?? sub._id ?? ""} // ensure value is always a string
                          >
                            {sub.name ?? "Unnamed Subcategory"}
                          </SelectItem>
                        ))}
                        {filteredSubcategories.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No subcategories available
                          </p>
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
            <Input {...register("sizes")} placeholder="e.g., S,M,L" onChange={(e) => setValue("sizes", e.target.value.split(","))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Colors (comma separated)</Label>
            <Input {...register("colors")} placeholder="e.g., Red,Blue" onChange={(e) => setValue("colors", e.target.value.split(","))} />
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
                    onChange={(e) => handleVariantImageChange(index, e.target.files)}
                  />
                  {variant.images && variant.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {variant.images.map((url, i) => (
                        <div key={i} className="relative w-20 h-20">
                          <Image
                            src={url}
                            alt={`variant-${index}-${i}`}
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                          />
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

          {/* Main Images */}
          <div className="space-y-2 md:col-span-2">
            <Label>Images</Label>
            <div className="flex items-center gap-3">
              <label htmlFor="imageUpload" className="flex gap-1 cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                <Upload size={16} />
                {isUploading ? "Uploading..." : "Upload Images"}
              </label>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative w-full h-28">
                    <Image
                      src={url}
                      alt={`preview-${idx}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="100vw"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <DialogFooter className="mt-4 flex justify-end gap-3 md:col-span-2">
            <Button variant="destructive" type="button" onClick={onClose}>
              <XCircle size={16} /> Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              <Upload size={16} /> {productToEdit ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
