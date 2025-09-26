"use client";

import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import AddBlogDialog  from "@/AppComponents/AppBlogDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useBlogs,
  useAddBlog,
  useUpdateBlog,
  useDeleteBlog,
} from "@/hooks/Blog";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";

export default function BlogPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<IBlogPayload | null>(null);

  const { data: blogs = [], isLoading } = useBlogs();
  const addBlog = useAddBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const filteredBlogs = blogs.filter((b) =>
    (b.title ?? "").toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Dialog open functions
  const openAddDialog = () => {
    setSelectedBlog(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (blog: IBlogPayload) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  // Submit blog
  const handleSubmitBlog = (blog: IBlogPayload) => {
    if (blog._id) {
      updateBlog.mutate(blog);
    } else {
      addBlog.mutate(blog);
    }
    setIsDialogOpen(false);
  };

  // Delete blog
  const handleDelete = (blog: IBlogPayload) => deleteBlog.mutate(blog._id);

  // Table columns
  const columns = [
    { key: "title", label: "Title" },
    {
      key: "content",
      label: "Content",
      render: (row: IBlogPayload) =>
        row.content.length > 50 ? row.content.slice(0, 50) + "..." : row.content,
    },
    { key: "tags", label: "Tags", render: (row: IBlogPayload) => row.tags?.join(", ") || "No tags" },
    {
      key: "images",
      label: "Images",
      render: (row: IBlogPayload) => row.images?.length || "No images",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row: IBlogPayload) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      render: (row: IBlogPayload) => new Date(row.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        {/* Header Actions */}
        {/* Add/Edit Dialog */}
        <AddBlogDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          blogToEdit={selectedBlog || undefined}
          onBlogSaved={() => handleSubmitBlog(selectedBlog!)}
        />
        <AppHeaderActions
          title="Add Blog"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        {/* Table */}
        <div
          className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${
            pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
          }`}
        >
          {isLoading ? (
            <TableSkeleton rows={pageSize} />
          ) : (
            <GlobalTable<IBlogPayload>
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

        
      </div>
    </AppContainer>
  );
}
