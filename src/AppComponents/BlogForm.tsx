"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, Save, ArrowLeft, Zap, X } from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TipTapImage from "@tiptap/extension-image";

import EditorToolbar from "../AppComponents/AppToolbarComponent";

import { IBlogPayload } from "@/types/IBlogPayloadTypes";
import { useAddBlog, useUpdateBlog } from "@/hooks/Blog/index";
import { useSubcategories } from "@/hooks/Subcategories";
import { ISubcategory } from "@/types/subcategoryTypes";


export interface BlogApiResponse {
  success: boolean;
  message: string;
  data?: {
    _id?: string;
    id?: string;
    [key: string]: unknown;
  };
}

interface BlogFormValues {
  title: string;
  description: string;
  category: string;
  content: string;
  tags?: string;
}

interface BlogFormProps {
  initialData?: Partial<BlogFormValues> & { images?: string[] };
  mode?: "create" | "edit";
  blogId?: string;
  onClose?: () => void;
}

type BlogFormPayload = IBlogPayload & {
  imageFiles?: File[];
  existingImages?: string[];
};

interface MutationHook {
  mutateAsync: (payload: BlogFormPayload | Omit<BlogFormPayload, '_id'>) => Promise<BlogApiResponse>;
  isPending?: boolean;
  isLoading?: boolean;
}

export default function BlogForm({ initialData, mode = "create", blogId, onClose }: BlogFormProps) {
  const router = useRouter();
  const addBlog = useAddBlog() as MutationHook;
  const updateBlog = useUpdateBlog() as MutationHook;
  const { data: subcategoriesData } = useSubcategories();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BlogFormValues>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      content: "",
      tags: ""
    }
  });

  const watchedCategory = watch("category");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your amazing blog post..." }),
      BulletList,
      OrderedList,
      TipTapImage.configure({
        HTMLAttributes: {
          class: 'blog-image',
          style: 'max-width: 100%; height: auto;'
        }
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      setValue("content", htmlContent);
      setCharacterCount(textContent.length);
      setWordCount(textContent.trim() ? textContent.trim().split(/\s+/).length : 0);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        content: initialData.content || "",
        tags: initialData.tags || ""
      });

      if (initialData.images) {
        setExistingImages(initialData.images);
      }

      if (editor && initialData.content) {
        editor.commands.setContent(initialData.content);
        const textContent = editor.getText();
        setCharacterCount(textContent.length);
        setWordCount(textContent.trim() ? textContent.trim().split(/\s+/).length : 0);
      }
    }
  }, [initialData, reset, editor, isMounted]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });
      setSelectedImages(prev => [...prev, ...validFiles]);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BlogFormValues) => {
    if (!editor) {
      toast.error("Editor is not initialized");
      return;
    }

    const content = editor.getHTML();
    if (!content || content === '<p></p>' || content.trim() === '') {
      toast.error("Content is required");
      return;
    }

    if (!data.category) {
      toast.error("Please select a category");
      return;
    }

    const tagsArray = data.tags
      ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const payload: BlogFormPayload = {
      _id: mode === "edit" && blogId ? blogId : "",
      title: data.title.trim(),
      description: data.description?.trim() || "",
      category: data.category,
      content: content,
      tags: tagsArray,
      author: "Current User",
      createdAt: mode === "edit" ? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      message: "",
      ...(selectedImages.length > 0 && { imageFiles: selectedImages }),
      ...(existingImages.length > 0 && { existingImages: existingImages })
    };

    try {
      const isEdit = mode === "edit" && blogId;

      let result: BlogApiResponse;

      if (isEdit) {
        if (!updateBlog) {
          toast.error("Update functionality not available");
          return;
        }
        result = await updateBlog.mutateAsync(payload);
      } else {
        if (!addBlog) {
          toast.error("Create functionality not available");
          return;
        }
        const { _id, ...createPayload } = payload;
        result = await addBlog.mutateAsync(createPayload);
      }

      if (result.success) {
        toast.success(result.message);

        if (onClose) {
          onClose();
        } else {
          const newBlogId = result.data?._id || result.data?.id;
          if (newBlogId) {
            router.push(`/blogs/${newBlogId}`);
          } else {
            router.push('/blogs');
          }
        }
      } else {
        toast.error(result.message || `Failed to ${isEdit ? 'update' : 'create'} blog post`);
      }
    } catch (error: unknown) {
      console.error("Error saving blog:", error);

      let errorMessage = `Something went wrong while ${mode === 'edit' ? 'updating' : 'creating'} the blog post`;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as { response?: { data?: { message?: string } } };
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  const isFormLoading = addBlog.isPending || updateBlog.isPending ||
    addBlog.isLoading || updateBlog.isLoading;

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-5 h-5 text-blue-600" />
                {mode === "edit" ? "Edit Blog Post" : "Create New Blog Post"}
              </CardTitle>
              <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-5 h-5 text-blue-600" />
              {mode === "edit" ? "Edit Blog Post" : "Create New Blog Post"}
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => router.push("/blogs")}
              className="flex items-center gap-2"
              disabled={isFormLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" },
                  maxLength: { value: 200, message: "Title must be less than 200 characters" }
                })}
                disabled={isFormLoading}
                placeholder="Enter blog title"
              />
              {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" },
                  maxLength: { value: 500, message: "Description must be less than 500 characters" }
                })}
                disabled={isFormLoading}
                placeholder="Enter blog description"
                rows={3}
              />
              {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="category">Category *</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                value={watchedCategory}
                disabled={isFormLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {subcategoriesData?.map((category: ISubcategory) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!watchedCategory && <p className="text-red-600 text-sm">Category is required</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...register("tags")}
                disabled={isFormLoading}
                placeholder="Enter tags separated by commas (e.g., react, javascript, web)"
              />
              <p className="text-sm text-gray-500">Separate multiple tags with commas</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="images">Blog Images</Label>

              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Existing Images:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="h-16 w-16 relative">
                          <Image
                            src={imageUrl}
                            alt={`Existing ${index}`}
                            fill
                            className="object-cover rounded border"
                            sizes="64px"
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(index)}
                          disabled={isFormLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isFormLoading}
                />
                <p className="text-sm text-gray-500">Maximum file size: 5MB per image</p>

                {selectedImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">New Images to Upload:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="bg-gray-100 text-xs px-2 py-1 rounded border flex items-center gap-2">
                            <span className="max-w-[100px] truncate">{file.name}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => removeSelectedImage(index)}
                              disabled={isFormLoading}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Content *</Label>
              {editor && (
                <Card className="border">
                  <EditorToolbar editor={editor} />
                  <EditorContent
                    editor={editor}
                    className="min-h-[300px] p-4 prose max-w-none"
                  />
                </Card>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{wordCount} words</span>
                <span>{characterCount} characters</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isFormLoading}
                className="flex items-center gap-2"
              >
                {isFormLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === "edit" ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === "edit" ? "Update Post" : "Publish Post"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose || (() => router.back())}
                className="flex items-center gap-2"
                disabled={isFormLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}