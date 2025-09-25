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
import { ProductService } from "@/services/productService";

// Tag Input Component
const TagInput = ({ value, onChange, placeholder }: { value: string[]; onChange: (value: string[]) => void; placeholder: string }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newValue = inputValue.trim();
      if (newValue && !value.includes(newValue)) {
        onChange([...value, newValue]);
      }
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="border rounded-md p-2 min-h-[40px] flex flex-wrap gap-2 items-center">
      {value.map((tag, index) => (
        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
          {tag}
          <button type="button" onClick={() => removeTag(index)} className="text-blue-600 hover:text-blue-800">
            <XCircle size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : "Add more..."}
        className="flex-1 outline-none bg-transparent min-w-[100px] text-sm"
      />
    </div>
  );
};

export function AddProductDialog({ isOpen, onClose, productToEdit }: AddProductDialogProps) {
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<IProductPayload>({
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

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: "variants" });

  const { data: categories = [] } = useCategories();
  const selectedCategoryId = watch("categoryId");
  const { data: subcategories = [] } = useSubcategories();

  const [categorySearch, setCategorySearch] = useState("");
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [variantFiles, setVariantFiles] = useState<File[][]>([]);
  const [existingImages, setExistingImages] = useState<string[][]>([]);
  const [deletedImages, setDeletedImages] = useState<string[][]>([]);

  // Clear everything when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCategorySearch("");
      setSubcategorySearch("");
      setVariantFiles([]);
      setExistingImages([]);
      setDeletedImages([]);
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (productToEdit && isOpen) {
      // Reset form first
      reset();
      
      // Set basic fields
      Object.keys(productToEdit).forEach((key) => {
        if (key !== "variants") {
          const value = productToEdit[key as keyof IProductPayload];
          if (value !== undefined) setValue(key as keyof IProductPayload, value);
        }
      });

      // Handle variants with images
      const variantsWithImages = productToEdit.variants?.map((v) => ({
        ...v,
        images: v.images || [],
      })) || [];

      setValue("variants", variantsWithImages);
      
      // Store existing images separately (URLs from server)
      const existing = variantsWithImages.map(variant => variant.images || []);
      setExistingImages(existing);
      
      // Initialize variantFiles with empty arrays for each variant
      setVariantFiles(variantsWithImages.map(() => []));
      
      // Initialize deleted images array
      setDeletedImages(variantsWithImages.map(() => []));

      // Sync colors from variants
      const variantColors = variantsWithImages.map((v) => v.color?.trim()).filter(Boolean);
      setValue("colors", Array.from(new Set(variantColors)));
    } else if (!productToEdit && isOpen) {
      // Reset for new product
      reset();
      setVariantFiles([]);
      setExistingImages([]);
      setDeletedImages([]);
    }
  }, [productToEdit, setValue, reset, isOpen]);

  const generateSlugFromName = (name: string) =>
    name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!productToEdit?.slug || watch("slug") === generateSlugFromName(watch("name"))) {
      setValue("slug", generateSlugFromName(name));
    }
  };

  const variants = watch("variants");
  useEffect(() => {
    const variantColors = variants.map((v) => v.color?.trim()).filter(Boolean);
    setValue("colors", Array.from(new Set(variantColors)));
  }, [variants, setValue]);

  const handleVariantImageUpload = (variantIndex: number, files: FileList) => {
    if (!files) return;
    
    const blobUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    const updatedVariants = [...watch("variants")];
    
    // Keep existing images and add new ones
    updatedVariants[variantIndex].images = [
      ...(updatedVariants[variantIndex].images || []),
      ...blobUrls,
    ];
    
    setValue("variants", updatedVariants);

    setVariantFiles((prev) => {
      const copy = [...prev];
      copy[variantIndex] = [...(copy[variantIndex] || []), ...Array.from(files)];
      return copy;
    });
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const updatedVariants = [...watch("variants")];
    const currentImages = updatedVariants[variantIndex].images || [];
    
    // Check if this is an existing image (from server)
    const existingImagesCount = existingImages[variantIndex]?.length || 0;
    const isExistingImage = imageIndex < existingImagesCount;

    if (isExistingImage) {
      // For existing images, mark for deletion but keep track
      const imageUrl = currentImages[imageIndex];
      setDeletedImages(prev => {
        const copy = [...prev];
        if (!copy[variantIndex]) copy[variantIndex] = [];
        // Only add if not already marked for deletion
        if (!copy[variantIndex].includes(imageUrl)) {
          copy[variantIndex].push(imageUrl);
        }
        return copy;
      });
    } else {
      // For new images, remove completely from files
      const adjustedIndex = imageIndex - existingImagesCount;
      setVariantFiles((prev) => {
        const copy = [...prev];
        copy[variantIndex] = copy[variantIndex]?.filter((_, idx) => idx !== adjustedIndex) || [];
        return copy;
      });
    }
    
    // Remove the image from display
    updatedVariants[variantIndex].images = currentImages.filter((_, idx) => idx !== imageIndex);
    setValue("variants", updatedVariants);
  };

  // Check if image is an existing one from server
  const isExistingImage = (variantIndex: number, imageIndex: number) => {
    return imageIndex < (existingImages[variantIndex]?.length || 0);
  };

  // Check if image is marked for deletion
  // const isImageMarkedForDeletion = (variantIndex: number, imageUrl: string) => {
  //   return deletedImages[variantIndex]?.includes(imageUrl) || false;
  // };

  // Get images that should be displayed (non-deleted ones)
  const getDisplayImages = (variantIndex: number) => {
    const currentImages = watch("variants")[variantIndex]?.images || [];
    const deleted = deletedImages[variantIndex] || [];
    
    return currentImages.filter(img => !deleted.includes(img));
  };

  const handleAddVariant = () => {
    appendVariant({ color: "", stock: 0, images: [] });
    setVariantFiles((prev) => [...prev, []]);
    setExistingImages((prev) => [...prev, []]);
    setDeletedImages((prev) => [...prev, []]);
  };

  const handleRemoveVariant = (index: number) => {
    removeVariant(index);
    setVariantFiles((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setExistingImages((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setDeletedImages((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const onSubmit = async (data: IProductPayload) => {
    if (!data.name || !data.slug || !data.categoryId || !data.subcategoryId) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    
    // Append basic fields
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("description", data.description || "");
    formData.append("categoryId", data.categoryId);
    formData.append("subcategoryId", data.subcategoryId);
    formData.append("material", data.material || "");
    formData.append("care", data.care || "");
    formData.append("delivery", data.delivery || "");
    formData.append("rating", (data.rating || 0).toString());
    formData.append("sizes", JSON.stringify(data.sizes || []));
    formData.append("colors", JSON.stringify(data.colors || []));
    
    // Handle variants - send existing images and mark deletions
    const variantsData = data.variants?.map((variant, index) => ({
      color: variant.color,
      stock: variant.stock,
      // For existing images, only include those not marked for deletion
      existingImages: existingImages[index]?.filter(img => 
        !deletedImages[index]?.includes(img)
      ) || [],
    })) || [];
    
    formData.append("variants", JSON.stringify(variantsData));
    
    // Append deleted images information for the backend
    formData.append("deletedImages", JSON.stringify(deletedImages));
    
    // Append new variant images
    variantFiles.forEach((files, variantIndex) => {
      files.forEach((file) => {
        formData.append(`variantImages[${variantIndex}]`, file);
      });
    });

    try {
      if (productToEdit?._id) {
        await ProductService.update(productToEdit._id, formData);
      } else {
        await ProductService.create(formData);
      }
      reset();
      setVariantFiles([]);
      setExistingImages([]);
      setDeletedImages([]);
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product. Please try again.");
    }
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
            <Input {...register("name", { required: "Product name required" })} onChange={handleNameChange} placeholder="Enter product name" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label>URL Slug *</Label>
            <Input {...register("slug", { required: "Slug required" })} placeholder="Auto-generated from name" />
            {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Price *</Label>
            <Input type="number" step="0.01" {...register("price", { required: "Price required", min: { value: 0, message: "Price must be positive" } })} placeholder="0.00" />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label>Total Stock *</Label>
            <Input type="number" {...register("stock", { required: "Stock required", min: { value: 0, message: "Stock must be positive" } })} placeholder="0" />
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
                const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase()));
                return (
                  <Select value={field.value} onValueChange={(val) => { field.onChange(val); setValue("subcategoryId", ""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input placeholder="Search category..." value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} className="mb-2" />
                        {filteredCategories.map((cat) => (<SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>))}
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
                  (sub) => String(sub.categoryId) === String(selectedCategoryId) && sub.name?.toLowerCase().includes(subcategorySearch.toLowerCase())
                );
                return (
                  <Select value={field.value} onValueChange={field.onChange} disabled={!selectedCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCategoryId ? "Select Subcategory" : "Select Category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input placeholder="Search subcategory..." value={subcategorySearch} onChange={(e) => setSubcategorySearch(e.target.value)} className="mb-2" />
                        {filteredSubcategories.map((sub) => (<SelectItem key={sub._id} value={sub._id ?? ""}>{sub.name ?? "Unnamed Subcategory"}</SelectItem>))}
                        {filteredSubcategories.length === 0 && <p className="text-sm text-muted-foreground">No subcategories available</p>}
                      </div>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.subcategoryId && <p className="text-red-500 text-xs">{errors.subcategoryId.message}</p>}
          </div>

          {/* Material */}
          <div className="space-y-2">
            <Label>Material</Label>
            <Input {...register("material")} placeholder="Product material" />
          </div>

          {/* Care */}
          <div className="space-y-2">
            <Label>Care Instructions</Label>
            <Input {...register("care")} placeholder="Care instructions" />
          </div>

          {/* Delivery */}
          <div className="space-y-2">
            <Label>Delivery Info</Label>
            <Input {...register("delivery")} placeholder="Delivery information" />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <Input type="number" step="0.1" min="0" max="5" {...register("rating")} placeholder="0.0 - 5.0" />
          </div>

          {/* Sizes */}
          <div className="space-y-2 md:col-span-2">
            <Label>Sizes</Label>
            <Controller
              name="sizes"
              control={control}
              render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Type size and press Enter or comma" />}
            />
            <p className="text-xs text-muted-foreground">Add sizes by typing and pressing Enter or comma</p>
          </div>

          {/* Colors */}
          <div className="space-y-2 md:col-span-2">
            <Label>Colors</Label>
            <Controller
              name="colors"
              control={control}
              render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Type color and press Enter or comma" />}
            />
            <p className="text-xs text-muted-foreground">Add colors by typing and pressing Enter or comma</p>
          </div>

          {/* Variants */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex justify-between items-center">
              <Label className="text-lg">Variants</Label>
              <Button type="button" onClick={handleAddVariant} className="flex items-center gap-2">
                <Plus size={16} /> Add Variant
              </Button>
            </div>

            {variantFields.map((variant, index) => (
              <div key={variant.id} className="border border-border rounded-md p-4 space-y-3 relative">
                <Button type="button" onClick={() => handleRemoveVariant(index)} variant="destructive" size="sm" className="absolute top-2 right-2">
                  <Trash2 size={16} />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color *</Label>
                    <Input 
                      {...register(`variants.${index}.color`, { required: "Variant color required" })} 
                      placeholder="Color name" 
                    />
                    {errors.variants?.[index]?.color && (
                      <p className="text-red-500 text-xs">{errors.variants[index]?.color?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Stock *</Label>
                    <Input 
                      type="number" 
                      {...register(`variants.${index}.stock`, { 
                        required: "Variant stock required",
                        min: { value: 0, message: "Stock must be positive" }
                      })} 
                      placeholder="Stock quantity" 
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="text-red-500 text-xs">{errors.variants[index]?.stock?.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Variant Images</Label>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => handleVariantImageUpload(index, e.target.files!)} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {variantFiles[index]?.length || 0} new file(s), {existingImages[index]?.length || 0} existing image(s)
                    {deletedImages[index]?.length > 0 && `, ${deletedImages[index]?.length} marked for deletion`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {getDisplayImages(index).map((img, imgIdx) => (
                    <div key={imgIdx} className="relative w-24 h-24 border border-border rounded-md overflow-hidden">
                      <Image src={img} alt={`Variant ${index} Image ${imgIdx}`} width={96} height={96} className="object-cover w-full h-full" />
                      <div className="absolute top-1 right-1 flex gap-1">
                        {isExistingImage(index, imgIdx) && (
                          <span className="bg-green-500 text-white text-xs px-1 rounded">Existing</span>
                        )}
                        <button 
                          type="button" 
                          onClick={() => removeVariantImage(index, imgIdx)} 
                          className="bg-red-600 text-white rounded-full p-1"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea {...register("description")} placeholder="Product description" className="min-h-[120px]" />
          </div>

          {/* Submit Button */}
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