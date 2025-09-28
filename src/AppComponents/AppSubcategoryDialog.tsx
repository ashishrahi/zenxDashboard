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
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<ISubcategory>({
    defaultValues: {
      _id: "",
      name: "",
      description: "",
      categoryId: "",
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
        if (image.type === 'new' && image.url.startsWith('blob:')) URL.revokeObjectURL(image.url);
      });
    };
  }, [images]);

  const resetForm = useCallback(() => {
    reset({ _id: "", name: "", description: "", categoryId: "", images: [] });
    setImages([]);
  }, [reset]);

  useEffect(() => {
    if (!isOpen) {
      if (subcategoryToEdit) resetForm();
      return;
    }

    if (subcategoryToEdit) {
      setValue("_id", subcategoryToEdit._id || "");
      setValue("name", subcategoryToEdit.name || "");
      setValue("description", subcategoryToEdit.description || "");

      const existingImages: ImageState[] = (subcategoryToEdit.images || []).map(img => ({
        url: typeof img === 'string' ? img : URL.createObjectURL(img as File),
        type: typeof img === 'string' ? 'existing' : 'new',
        file: img instanceof File ? img : undefined,
      }));

      setImages(existingImages);

      if (categories.length > 0 && subcategoryToEdit.categoryId) {
        const catId = String(subcategoryToEdit.categoryId);
        setValue("categoryId", categories.some(c => c._id === catId) ? catId : "");
      }
    } else {
      resetForm();
    }
  }, [isOpen, subcategoryToEdit, categories, setValue, resetForm]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue("name", e.target.value);

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
    if (imageToRemove.type === 'new' && imageToRemove.url.startsWith('blob:')) URL.revokeObjectURL(imageToRemove.url);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ISubcategory) => {
    if (!data.name || !data.categoryId) {
      alert("Please fill all required fields");
      return;
    }

    setIsUploading(true);
    try {
      const existingImageUrls = images.filter(img => img.type === 'existing').map(img => img.url);
      const newImageFiles = images.filter(img => img.type === 'new' && img.file).map(img => img.file) as File[];

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('categoryId', data.categoryId);
      formData.append('existingImages', JSON.stringify(existingImageUrls));
      newImageFiles.forEach(file => formData.append('images', file));

      if (subcategoryToEdit?._id) {
        await SubcategoryService.update(subcategoryToEdit._id, formData);
      } else {
        await SubcategoryService.create(formData);
      }

      resetForm();
      onClose();
      onSubcategorySaved?.();
    } catch (err: unknown) {
      console.error("Error saving subcategory:", err);
      alert("Error saving subcategory");
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
            {subcategoryToEdit ? <><Edit3 size={20} className="text-blue-500" /> Edit Subcategory</> : <><Tag size={20} className="text-blue-500" /> Add New Subcategory</>}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <input type="hidden" {...register("_id")} />

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-gray-800 dark:text-gray-100">Category *</Label>
            <select
              id="categoryId"
              {...register("categoryId", { required: "Category is required" })}
              className="w-full p-3 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            >
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-800 dark:text-gray-100">Subcategory Name *</Label>
            <Input
              id="name"
              {...register("name", { required: "Subcategory name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
              value={formValues.name || ""}
              onChange={handleNameChange}
              placeholder="e.g., Men's Clothing"
              className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-gray-800 dark:text-gray-100">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              value={formValues.description || ""}
              onChange={e => setValue("description", e.target.value)}
              placeholder="Describe this subcategory..."
              className="h-24 resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Images */}
          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-800 dark:text-gray-100"><ImageIcon size={16} /> Images {images.length > 0 && <span className="text-xs text-gray-500">({images.filter(img => img.type === 'existing').length} existing, {images.filter(img => img.type === 'new').length} new)</span>}</Label>
            <div className="flex items-center gap-3">
              <label htmlFor="imageUpload" className={`flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}>
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {isUploading ? "Uploading..." : "Upload Images"}
              </label>
              <input type="file" id="imageUpload" multiple accept="image/*" onChange={handleImageChange} className="hidden" disabled={isUploading} />
              <span className="text-xs text-gray-500">{images.length} image(s) selected</span>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {images.map((image, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border shadow-sm">
                    <Image width={200} height={200} src={image.url} alt={`preview-${idx}`} className="w-full h-28 object-cover rounded-lg transition-transform group-hover:scale-105" />
                    <div className="absolute top-1 left-1">
                      <span className={`text-xs px-1 rounded ${image.type === 'existing' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>{image.type === 'existing' ? 'Existing' : 'New'}</span>
                    </div>
                    <AppButton type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-70 group-hover:opacity-100 transition">
                      <Trash2 size={12} />
                    </AppButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-4 flex justify-end gap-3 md:col-span-2 sticky bottom-0 bg-white dark:bg-gray-900 z-10">
            <AppButton type="button" onClick={handleClose} className="flex items-center gap-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"><XCircle size={16} /> Cancel</AppButton>
            <AppButton type="submit" className="flex items-center gap-2 bg-blue-600 text-white" disabled={isUploading}>
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {isUploading ? "Saving..." : (subcategoryToEdit ? "Update Subcategory" : "Add Subcategory")}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
