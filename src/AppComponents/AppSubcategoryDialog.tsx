"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Upload, Trash2, XCircle, Tag, Edit3 } from "lucide-react";
// import { ISubcategoryPayload } from "@/pages/subcategories";
import { useCategories } from "@/hooks/Categories/useCategories"; // your hook

interface GenderOption {
  id: string;
  name: string;
}

interface AddSubcategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSubcategory: (subcategory: ISubcategoryPayload) => void;
  subcategoryToEdit?: ISubcategoryPayload;
  genderOptions?: GenderOption[];
}

export function AddSubcategoryDialog({
  isOpen,
  onClose,
  onSubmitSubcategory,
  subcategoryToEdit,
  genderOptions = [],
}: AddSubcategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ISubcategoryPayload>({
    defaultValues: {
      _id: "",
      name: "",
      slug: "",
      description: "",
      images: [],
      categoryId: "",
    },
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories = [] } = useCategories(); // fetch categories

  useEffect(() => {
    if (subcategoryToEdit) {
      setValue("_id", subcategoryToEdit._id ?? "");
      setValue("name", subcategoryToEdit?.name ?? "");
      setValue("slug", subcategoryToEdit?.slug ?? "");
      setValue("description", subcategoryToEdit?.description ?? "");
      setValue("images", subcategoryToEdit?.images ?? []);
      setValue("categoryId", subcategoryToEdit?.categoryId ?? "");
      setUploadedImages(subcategoryToEdit?.images ?? []);
    } else {
      reset();
      setUploadedImages([]);
    }
  }, [subcategoryToEdit, setValue, reset, isOpen]);

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
      const newImages = [...uploadedImages, ...newUrls];
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

  const generateSlugFromName = (name: string) =>
    name?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")?.replace(/(^-|-$)/g, "") ?? "";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!subcategoryToEdit?.slug || watch("slug") === generateSlugFromName(subcategoryToEdit?.name ?? "")) {
      setValue("slug", generateSlugFromName(name));
    }
  };

  const onSubmit = (data: ISubcategoryPayload) => {
    onSubmitSubcategory(data);
    reset();
    setUploadedImages([]);
    onClose();
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

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <input type="hidden" {...register("_id")} />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-primary dark:text-gray-300">
              Subcategory Name
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Subcategory name is required" })}
              onChange={handleNameChange}
              placeholder="e.g., Summer Collection"
              className="text-primary"
            />
            {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              URL Slug
            </Label>
            <Input
              id="slug"
              {...register("slug", { required: "Slug is required" })}
              placeholder="e.g., summer-collection"
              className="text-primary"
            />
            {errors?.slug && <p className="text-red-500 text-xs mt-1">{errors.slug?.message}</p>}
          </div>

          {/* Parent Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary dark:text-primary">Parent Category</Label>
            {categories.length > 0 ? (
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Parent category is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}  >
                    <SelectTrigger className="text-primary">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <p className="text-sm text-gray-500">Loading categories...</p>
            )}
            {errors?.categoryId && (
              <p className="text-red-500 text-xs mt-1">{errors.categoryId?.message}</p>
            )}
          </div>

          {/* Gender */}
          {genderOptions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary dark:text-primary">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} >
                    <SelectTrigger >
                      <SelectValue placeholder="Select Gender"  />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((g) => (
                        <SelectItem key={g.id} value={g.id} >
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea id="description" {...register("description")} 
            placeholder="Describe this subcategory..."
            className="text-primary"
            
            />
          </div>

          {/* Images */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</Label>
            <div className="flex items-center gap-3">
              <label htmlFor="imageUpload" className="flex flex-row gap-1 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg">
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
                  <div key={idx} className="relative">
                    <img src={url} alt={`preview-${idx}`} className="w-full h-28 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <DialogFooter className="mt-4 flex justify-end gap-3 md:col-span-2">
               
            <Button variant="destructive" type="button" onClick={onClose}  className="text-white" >
              <XCircle size={16} /> Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              <Upload size={16} /> {subcategoryToEdit ? "Update Subcategory" : "Add Subcategory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
