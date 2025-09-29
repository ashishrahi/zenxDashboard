"use client";

import { useParams, useRouter } from "next/navigation";
import { useBlog } from "@/hooks/Blog";
import { AppContainer } from "@/AppComponents/AppContainer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BlogForm from "@/AppComponents/BlogForm";
import { useState, useEffect } from "react";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const blogId = params.id as string;

  const { data: blogData, isLoading, error } = useBlog(blogId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <AppContainer>
        <div className="max-w-4xl mx-auto py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AppContainer>
    );
  }

  if (error) {
    return (
      <AppContainer>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">Failed to load blog data.</p>
          <Button className="mt-4" onClick={() => router.push("/blogs")}>
            Back to Blogs
          </Button>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6">
        </div>

        <h1 className="text-3xl font-bold mb-6 text-accent-foreground">
          Edit Blog Post
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : blogData ? (
          <BlogForm
            mode="edit"
            blogId={blogData._id}
            initialData={{
              title: blogData.title || "",
              description: blogData.description || "",
              category: blogData.category || "",
              content: blogData.content || "",
              tags: Array.isArray(blogData.tags)
                ? blogData.tags.join(", ")
                : blogData.tags || "",
              images: blogData.images || []
            }}
            onClose={() => router.push(`/blogs/${blogId}`)}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Blog not found.</p>
            <Button onClick={() => router.push("/blogs")}>
              Back to Blogs
            </Button>
          </div>
        )}
      </div>
    </AppContainer>
  );
}