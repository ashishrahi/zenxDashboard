"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BlogForm from "./BlogForm Component";

function AddBlogDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlogSubmit = (data: any) => {
    console.log("Blog Data:", data);
    // API call yahan kare (Next.js /api/blog)
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create New Blog</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Blog</DialogTitle>
          </DialogHeader>
          <BlogForm onSubmit={handleBlogSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
}
export default  AddBlogDialog