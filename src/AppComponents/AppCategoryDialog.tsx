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
import { ICategoryPayload } from "@/types/categoriesTypes";
import { CategoryService } from "@/services/categoryService";
import Image from "next/image";
import { AxiosError } from "axios";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: ICategoryPayload;
  onCategorySaved?: () => void;
}

interface ImageState {
  url: string;
  type: 'existing' | 'new';
  file?: File;
}

export function AddCategoryDialog({
  isOpen,
  onClose,
  categoryToEdit,
  onCategorySaved,
}: AddCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICategoryPayload>({
    defaultValues: {
      _id: "",
      name: "",
      slug: "",
      description: "",
      images: [],
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
      images: [],
    });
    setImages([]);
  }, [reset]);

  // Populate form when editing
  useEffect(() => {
    if (!isOpen) {
      if (categoryToEdit) {
        resetForm();
      }
      return;
    }

    if (categoryToEdit) {
      console.log("Editing category:", categoryToEdit);

      setValue("_id", categoryToEdit._id ?? "");
      setValue("name", categoryToEdit.name ?? "");
      setValue("slug", categoryToEdit.slug ?? "");
      setValue("description", categoryToEdit.description ?? "");

      // Set existing images
      const existingImages: ImageState[] = (categoryToEdit.images || []).map(url => ({
        url,
        type: 'existing'
      }));
      setImages(existingImages);
    } else {
      resetForm();
    }
  }, [isOpen, categoryToEdit, setValue, resetForm]);

  // Generate slug from name
  const generateSlugFromName = (name: string) =>
    name?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")?.replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);

    if (!categoryToEdit?.slug || watch("slug") === generateSlugFromName(categoryToEdit.name ?? "")) {
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
  const onSubmit = async (data: ICategoryPayload) => {
    if (!data.name || !data.slug) {
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

      if (categoryToEdit?._id) {
        // Create FormData for update
        const formData = new FormData();

        // Append all non-image fields
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        if (data.description) {
          formData.append('description', data.description);
        }

        // Append existing images as JSON array
        formData.append('existingImages', JSON.stringify(existingImageUrls));

        // Append new image files
        newImageFiles.forEach(file => {
          formData.append('images', file);
        });

        console.log('Updating category with ID:', categoryToEdit._id);
        await CategoryService.update(categoryToEdit._id, formData);
      } else {
        // Create FormData for new category
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('slug', data.slug);
        if (data.description) {
          formData.append('description', data.description);
        }

        // Append new image files
        newImageFiles.forEach(file => {
          formData.append('images', file);
        });

        await CategoryService.create(formData);
      }

      resetForm();
      onClose();
      onCategorySaved?.();
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("Error saving category:", errorMessage);
      alert(`Error saving category: ${errorMessage}`);
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
            {categoryToEdit ? (
              <>
                <Edit3 size={20} className="text-blue-500" /> Edit Category
              </>
            ) : (
              <>
                <Tag size={20} className="text-blue-500" /> Add New Category
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
        >
          <input type="hidden" {...register("_id")} />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name *
            </Label>
            <div className="relative">
              <Input
                id="name"
                {...register("name", {
                  required: "Category name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
                value={formValues.name || ""}
                onChange={handleNameChange}
                placeholder="e.g., Summer Collection"
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
                placeholder="e.g., summer-collection"
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
                placeholder="Describe this category..."
                className="pr-10 pt-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none h-24"
              />
              <div className="absolute right-3 top-3 pointer-events-none">
                <Edit3 className="text-gray-400 dark:text-gray-500" size={18} />
              </div>
            </div>
          </div>

          {/* Images Upload */}
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
                className={`flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition ${isUploading ? "opacity-70 cursor-not-allowed" : ""
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
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <Image
                      src={image.url}
                      alt={`preview-${idx}`}
                      width={200}
                      height={200}
                      className="w-full h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-1 left-1">
                      <span className={`text-xs px-1 rounded ${image.type === 'existing'
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
              {isUploading ? "Saving..." : (categoryToEdit ? "Update Category" : "Add Category")}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}