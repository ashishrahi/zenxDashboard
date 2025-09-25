"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Trash2,
  XCircle,
  Tag,
  Link,
  Edit3,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { AppButton } from "./AppButton";
import { ISubcategory } from "@/types/subcategoryTypes";
import { SubcategoryService } from "@/services/subcategoryService";
import Image from "next/image";

interface AddSubcategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subcategoryToEdit?: ISubcategory & { images?: string[] };
  categories: { _id: string; name: string }[];
  onSubcategorySaved?: () => void;
  onSubmitSubcategory: (subcategory: ISubcategory) => void;
}

interface ImageState {
  url: string;
  type: 'existing' | 'new';
  file?: File;
}

export function AddSubcategoryDialog({
  isOpen,
  onClose,
  subcategoryToEdit,
  categories,
  onSubcategorySaved,
}: AddSubcategoryDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ISubcategory>({
    defaultValues: {
      _id: "",
      name: "",
      slug: "",
      description: "",
      categoryId: "",
    },
  });

  const [images, setImages] = useState<ImageState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const formValues = watch();

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.type === 'new' && image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  // Reset form function
  const resetForm = useCallback(() => {
    reset({
      _id: "",
      name: "",
      slug: "",
      description: "",
      categoryId: "",
    });
    setImages([]);
  }, [reset]);

  // Populate form when editing
  useEffect(() => {
    if (!isOpen) {
      if (subcategoryToEdit) {
        resetForm();
      }
      return;
    }

    if (subcategoryToEdit) {
      console.log("Editing subcategory:", subcategoryToEdit);
      
      setValue("_id", subcategoryToEdit._id || "");
      setValue("name", subcategoryToEdit.name || "");
      setValue("slug", subcategoryToEdit.slug || "");
      setValue("description", subcategoryToEdit.description || "");

      // Set existing images
      const existingImages: ImageState[] = (subcategoryToEdit.images || []).map(url => ({
        url,
        type: 'existing'
      }));
      setImages(existingImages);

      // Set categoryId
      if (categories.length > 0 && subcategoryToEdit.categoryId) {
        const catId = String(subcategoryToEdit.categoryId);
        const categoryExists = categories.some(cat => cat._id === catId);
        
        if (categoryExists) {
          console.log("Setting categoryId:", catId);
          setValue("categoryId", catId);
        } else {
          setValue("categoryId", "");
        }
      }
    } else {
      resetForm();
    }
  }, [isOpen, subcategoryToEdit, categories, setValue, resetForm]);

  // Generate slug from name
  const generateSlugFromName = (name: string) =>
    name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);

    if (!subcategoryToEdit || formValues.slug === generateSlugFromName(subcategoryToEdit.name || "")) {
      setValue("slug", generateSlugFromName(name));
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const filesArray = Array.from(files);
    
    const newImages: ImageState[] = filesArray.map((file) => ({
      url: URL.createObjectURL(file),
      type: 'new',
      file: file
    }));

    setImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
    
    // Clear the file input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    
    // Revoke object URL for new images
    if (imageToRemove.type === 'new' && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Fixed onSubmit function
  const onSubmit = async (data: ISubcategory) => {
    if (!data.name || !data.slug || !data.categoryId) {
      alert("Please fill all required fields");
      return;
    }

    setIsUploading(true);
    try {
      // Separate existing URLs from new files
      const existingImageUrls = images
        .filter(img => img.type === 'existing')
        .map(img => img.url);

      const newImageFiles = images
        .filter(img => img.type === 'new' && img.file)
        .map(img => img.file) as File[];

      if (subcategoryToEdit?._id) {
        // Create FormData for update
        const formData = new FormData();
        
        // Append all non-image fields
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('description', data.description || '');
        formData.append('categoryId', data.categoryId);

        // Append existing images as JSON array
        formData.append('existingImages', JSON.stringify(existingImageUrls));

        // Append new image files
        newImageFiles.forEach(file => {
          formData.append('images', file);
        });

        console.log('Updating subcategory with ID:', subcategoryToEdit._id);
        await SubcategoryService.update(subcategoryToEdit._id, formData);
      } else {
        // Create FormData for new subcategory
        const formData = new FormData();
        
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('description', data.description || '');
        formData.append('categoryId', data.categoryId);

        // Append new image files
        newImageFiles.forEach(file => {
          formData.append('images', file);
        });

        await SubcategoryService.create(formData);
      }

      resetForm();
      onClose();
      onSubcategorySaved?.();
    } catch (err: any) {
      console.error("Error saving subcategory:", err);
      alert(`Error saving subcategory: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {subcategoryToEdit ? (
              <>
                <Edit3 size={20} className="text-blue-500" /> Edit Subcategory
              </>
            ) : (
              <>
                <Tag size={20} className="text-blue-500" /> Add New Subcategory
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <input type="hidden" {...register("_id")} />

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </Label>
            <select
              id="categoryId"
              {...register("categoryId", { required: "Category is required" })}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subcategory Name *
            </Label>
            <div className="relative">
              <Input
                id="name"
                {...register("name", {
                  required: "Subcategory name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
                value={formValues.name || ""}
                onChange={handleNameChange}
                placeholder="e.g., Men's Clothing"
                className="pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Tag className="text-gray-400 dark:text-gray-500" size={18} />
              </div>
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              URL Slug *
            </Label>
            <div className="relative">
              <Input
                id="slug"
                {...register("slug", {
                  required: "Slug is required",
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message: "Slug can only contain lowercase letters, numbers, and hyphens",
                  },
                })}
                value={formValues.slug || ""}
                onChange={(e) => setValue("slug", e.target.value)}
                placeholder="e.g., mens-clothing"
                className="pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Link className="text-gray-400 dark:text-gray-500" size={18} />
              </div>
            </div>
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                {...register("description")}
                value={formValues.description || ""}
                onChange={(e) => setValue("description", e.target.value)}
                placeholder="Describe this subcategory..."
                className="pr-10 pt-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none h-24"
              />
              <div className="absolute right-3 top-3 pointer-events-none">
                <Edit3 className="text-gray-400 dark:text-gray-500" size={18} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ImageIcon size={16} /> Images
              {images.length > 0 && (
                <span className="text-xs text-gray-500">
                  ({images.filter(img => img.type === 'existing').length} existing, 
                  {images.filter(img => img.type === 'new').length} new)
                </span>
              )}
            </Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="imageUpload"
                className={`flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition ${
                  isUploading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
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
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {images.length} image(s) selected
              </span>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {images.map((image, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Image 
                      width={200} 
                      height={200} 
                      src={image.url} 
                      alt={`preview-${idx}`} 
                      className="w-full h-28 object-cover rounded-lg transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute top-1 left-1">
                      <span className={`text-xs px-1 rounded ${
                        image.type === 'existing' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {image.type === 'existing' ? 'Existing' : 'New'}
                      </span>
                    </div>
                    <AppButton
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-70 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={12} />
                    </AppButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-4 md:col-span-2 sticky bottom-0 bg-white dark:bg-gray-900 z-10">
            <AppButton
              variant="outline"
              type="button"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleClose}
              disabled={isUploading}
            >
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton 
              type="submit" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" 
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {isUploading ? "Saving..." : (subcategoryToEdit ? "Update Subcategory" : "Add Subcategory")}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}