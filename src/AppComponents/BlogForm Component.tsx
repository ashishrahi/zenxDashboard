"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import EditorToolbar from "../AppComponents/AppToolbarComponent";

interface BlogFormValues {
  title: string;
  content: string;
  tags?: string;
}

interface BlogFormProps {
  onSubmit: (data: BlogFormValues) => void;
}

export default function BlogForm({ onSubmit }: BlogFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<BlogFormValues>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      CodeBlock,
      BulletList,
      OrderedList,
      Placeholder.configure({ placeholder: "Write your blog content here..." }),
    ],
    content: "",
  });

  const submitHandler = (data: BlogFormValues) => {
    if (editor) data.content = editor.getHTML();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Label>Content</Label>
        <EditorToolbar editor={editor} />
        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={() => <EditorContent editor={editor} className="border rounded p-2 min-h-[250px]" />}
        />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
      </div>

      <div>
        <Label>Tags (comma separated)</Label>
        <Input {...register("tags")} />
      </div>

      <Button type="submit">Publish Blog</Button>
    </form>
  );
}
