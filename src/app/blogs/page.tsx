"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import {
  useBlogs,
  useDeleteBlog,
} from "@/hooks/Blog";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { IBlogPayload } from "@/types/IBlogPayloadTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface Column<T> {
  key: keyof T;  // This ensures key must be a property of T
  label: string;
  render?: (row: T) => React.ReactNode;
}



export default function BlogPage() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<IBlogPayload | null>(null);

  const { data: blogs = [], isLoading } = useBlogs();
  const deleteBlog = useDeleteBlog();

  const filteredBlogs = blogs.filter((b) =>
    (b.title ?? "").toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // // Navigation functions
  // const handleViewBlog = (blog: IBlogPayload) => {
  //   router.push(`/blogs/${blog._id}`);
  // };

  const handleEditBlog = (blog: IBlogPayload) => {
    router.push(`/blogs/${blog._id}`);
  };

  const handleAddBlog = () => {
    router.push("/blogs/new");
  };

  // Delete blog functions
  const handleDeleteClick = (blog: IBlogPayload) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      deleteBlog.mutate(blogToDelete._id);
    }
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  // Table columns with action buttons
 const columns: Column<IBlogPayload>[] = [
  {
    key: "title", // Must be a property of IBlogPayload
    label: "Title",
    render: (row: IBlogPayload) => row.title
  },
  {
    key: "author", // Must be a property of IBlogPayload
    label: "Author", 
    render: (row: IBlogPayload) => row.author
  },
  {
    key: "tags", // Must be a property of IBlogPayload
    label: "Tags", 
    render: (row: IBlogPayload) => (
      <div className="flex flex-wrap gap-1">
        {Array.isArray(row.tags) ? row.tags.map((tag, index) => (
          <span 
            key={index}
            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        )) : <span className="text-gray-400 italic">No tags</span>}
      </div>
    )
  },
  // ... other columns
];

  return (
    <AppContainer>
      <div className="p-2 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage your blog posts</p>
          </div>
        
        </div>

        {/* Search and Filter Section */}
        <AppHeaderActions
          title="Blog Posts"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={handleAddBlog}
        />

        {/* Table Section */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className={`overflow-x-auto ${pageSize > 5 ? "max-h-[500px] overflow-y-auto" : ""}`}>
            {isLoading ? (
              <TableSkeleton rows={pageSize} />
            ) : (
              <GlobalTable<IBlogPayload>
                columns={columns}
                data={paginatedBlogs}
                onEdit={handleEditBlog}
                onDelete={handleDeleteClick}
              />
            )}
          </div>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the blog post 
                {blogToDelete?.title}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppContainer>
  );
}