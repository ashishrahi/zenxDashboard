"use client";

import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddBlogDialog } from "@/AppComponents/AppBlogDialog"; // New dialog for blog
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useBlogs,
  useAddBlog,
  useUpdateBlog,
  useDeleteBlog,
} from "@/hooks/Blog/index"; // New hooks for blogs
import { IBlog } from "@/types/blogTypes"; // Blog type
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

export default function BlogPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);

  const { data: blogs = [], isLoading } = useBlogs();
  const addBlog = useAddBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  // Filter blogs by title or author
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(filterText.toLowerCase()) ||
      b.author.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedBlog(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (blog: IBlog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleSubmitBlog = (blog: IBlog) => {
    if (blog.id) updateBlog.mutate(blog);
    else addBlog.mutate({ ...blog, id: undefined });
    setIsDialogOpen(false);
  };

  const handleDelete = (blog: IBlog) => deleteBlog.mutate(blog.id);

  const columns = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "category", label: "Category" },
    { key: "publishedDate", label: "Published Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        {/* Header Actions */}
        <AppHeaderActions
          title="Add Blog"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        {/* Table Container */}
        <div
          className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${
            pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
          }`}
        >
          {isLoading ? (
            <TableSkeleton rows={pageSize} />
          ) : (
            <GlobalTable
              columns={columns}
              data={paginatedBlogs}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-2 gap-2 sm:gap-0">
          <PageSizeSelector
            pageSize={pageSize}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
          />
          <ShadCNPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Add / Edit Blog Dialog */}
        <AddBlogDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitBlog={handleSubmitBlog}
          blogToEdit={selectedBlog || undefined}
        />
      </div>
    </AppContainer>
  );
}
