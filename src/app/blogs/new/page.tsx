"use client";

import { useRouter } from "next/navigation";
import { AppContainer } from "@/AppComponents/AppContainer";
import BlogForm from "@/AppComponents/BlogForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewBlogPage() {
  const router = useRouter();

  return (
    <AppContainer>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/blogs")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Button>
        </div>

        <BlogForm mode="create" />
      </div>
    </AppContainer>
  );
}