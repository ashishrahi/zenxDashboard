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
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ICategoryPayload>({
    defaultValues: {
      _id: "",
      name: "",
      description: "",
      images: [],
    },
  });

  const [images, setImages] = useState<ImageState[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const formValues = watch();

  const resetForm = useCallback(() => {
    reset({ _id: "", name: "", description: "", images: [] });
    setImages([]);
  }, [reset]);

  useEffect(() => {
    if (!isOpen) {
      if (categoryToEdit) resetForm();
      return;
    }

    if (categoryToEdit) {
      setValue("_id", categoryToEdit._id ?? "");
      setValue("name", categoryToEdit.name ?? "");
      setValue("description", categoryToEdit.description ?? "");

      const existingImages: ImageState[] = (categoryToEdit.images || []).map(url => ({
        url,
        type: 'existing'
      }));
      setImages(existingImages);
    } else resetForm();
  }, [isOpen, categoryToEdit, setValue, resetForm]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("name", e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages: ImageState[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      type: 'new',
      file,
    }));

    setImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.type === 'new' && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ICategoryPayload) => {
    if (!data.name) {
      alert("Please fill all required fields");
      return;
    }

    setIsUploading(true);
    try {
      const existingImageUrls = images.filter(img => img.type === 'existing').map(img => img.url);
      const newImageFiles = images.filter(img => img.type === 'new' && img.file).map(img => img.file) as File[];

      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('existingImages', JSON.stringify(existingImageUrls));
      newImageFiles.forEach(file => formData.append('images', file));

      if (categoryToEdit?._id) {
        await CategoryService.update(categoryToEdit._id, formData);
      } else {
        await CategoryService.create(formData);
      }

      resetForm();
      onClose();
      onCategorySaved?.();
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";
      if (err instanceof AxiosError) errorMessage = err.response?.data?.message || err.message;
      else if (err instanceof Error) errorMessage = err.message;
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
              <><Edit3 size={20} className="text-blue-500" /> Edit Category</>
            ) : (
              <><Tag size={20} className="text-blue-500" /> Add New Category</>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <input type="hidden" {...register("_id")} />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name *
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Category name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
              value={formValues.name || ""}
              onChange={handleNameChange}
              placeholder="e.g., Summer Collection"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              value={formValues.description || ""}
              onChange={(e) => setValue("description", e.target.value)}
              placeholder="Describe this category..."
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
            />
          </div>

          {/* Images Upload */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ImageIcon size={16} /> Images
            </Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="imageUpload"
                className={`flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
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
              <span className="text-xs text-gray-500 dark:text-gray-400">{images.length} image(s) selected</span>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {images.map((image, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Image src={image.url} alt={`preview-${idx}`} width={200} height={200} className="w-full h-28 object-cover rounded-lg transition-transform group-hover:scale-105" />
                    <div className="absolute top-1 left-1">
                      <span className={`text-xs px-1 rounded ${image.type === 'existing' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
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
            <AppButton variant="outline" type="button" onClick={handleClose} disabled={isUploading}>
              <XCircle size={16} /> Cancel
            </AppButton>
            <AppButton type="submit" disabled={isUploading}>
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {isUploading ? "Saving..." : (categoryToEdit ? "Update Category" : "Add Category")}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
