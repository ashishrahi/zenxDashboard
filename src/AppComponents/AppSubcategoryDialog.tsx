"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { AppButton } from "./AppButton";

export interface ISubcategoryPayload {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  parentCategoryId: string;
}

interface AddSubcategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSubcategory: (subcategory: ISubcategoryPayload) => void;
  subcategoryToEdit?: ISubcategoryPayload;
  categories: { _id: string; name: string }[];
}

export function AddSubcategoryDialog({
  isOpen,
  onClose,
  onSubmitSubcategory,
  subcategoryToEdit,
  categories,
}: AddSubcategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISubcategoryPayload>({
    defaultValues: {
      _id: "",
      name: "",
      slug: "",
      description: "",
      images: [],
      parentCategoryId: "",
    },
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (subcategoryToEdit) {
      setValue("_id", subcategoryToEdit._id ?? "");
      setValue("name", subcategoryToEdit.name ?? "");
      setValue("slug", subcategoryToEdit.slug ?? "");
      setValue("description", subcategoryToEdit.description ?? "");
      setValue("images", subcategoryToEdit.images ?? []);
      setValue("parentCategoryId", subcategoryToEdit.parentCategoryId ?? "");
      setUploadedImages(subcategoryToEdit.images ?? []);
    } else {
      reset();
      setUploadedImages([]);
    }
  }, [subcategoryToEdit, setValue, reset, isOpen]);

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(
        (file) =>
          new Promise<string>((resolve) => {
            setTimeout(() => resolve(URL.createObjectURL(file)), 500);
          })
      );

      const newUrls = await Promise.all(uploadPromises);
      const newImages = [...(uploadedImages ?? []), ...newUrls];

      setUploadedImages(newImages);
      setValue("images", newImages);
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

  const onSubmit = (data: ISubcategoryPayload) => {
    console.log('data',data)
    onSubmitSubcategory(data);
    reset();
    setUploadedImages([]);
    onClose();
  };

  const generateSlugFromName = (name: string) =>
    name?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")?.replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);

    if (
      !subcategoryToEdit?.slug ||
      watch("slug") === generateSlugFromName(subcategoryToEdit.name ?? "")
    ) {
      setValue("slug", generateSlugFromName(name));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
        >
          <input type="hidden" {...register("_id")} />

          {/* Parent Category */}
          <div className="space-y-2">
            <Label
              htmlFor="parentCategoryId"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Parent Category
            </Label>
            <select
              id="parentCategoryId"
              {...register("parentCategoryId", { required: "Parent category is required" })}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.parentCategoryId && (
              <p className="text-red-500 text-xs mt-1">{errors.parentCategoryId.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subcategory Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                {...register("name", {
                  required: "Subcategory name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
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
              URL Slug
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
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe this subcategory..."
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
            </Label>

            <div className="flex items-center gap-3">
              <label
                htmlFor="imageUpload"
                className={`flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition ${
                  isUploading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
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
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {uploadedImages.length} image(s) selected
              </span>
            </div>

            {isUploading && (
              <div className="text-blue-500 text-xs flex items-center gap-1 mt-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                Processing images...
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {uploadedImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`preview-${idx}`}
                      className="w-full h-28 object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
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
              onClick={onClose}
            >
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={isUploading}
            >
              <Upload size={16} /> {subcategoryToEdit ? "Update Subcategory" : "Add Subcategory"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
