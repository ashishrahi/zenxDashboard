"use client";

import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, List, Link, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-2">
      <Button
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Button>

      <Button
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Button>

      <Button
        variant={editor.isActive("underline") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </Button>

      <Button
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>

      <Button
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Button>

      <Button
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </Button>

      <Button
        variant={editor.isActive("codeBlock") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code size={16} />
      </Button>

      <Button
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
      >
        <Link size={16} />
      </Button>
    </div>
  );
}
