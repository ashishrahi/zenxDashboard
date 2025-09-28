"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddEnquireDialog } from "@/AppComponents/AppEnquireDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { IEnquire } from "@/types/IEnquireTypes";

import {
  useEnquires,
  useAddEnquire,
  useUpdateEnquire,
  useDeleteEnquire,
} from "@/hooks/Enquires/index";

import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { toast } from "sonner";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";

// Column type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export default function EnquirePage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnquire, setSelectedEnquire] = useState<IEnquire | null>(null);

  const { data: enquires = [], isLoading } = useEnquires();
  const addEnquire = useAddEnquire();
  const updateEnquire = useUpdateEnquire();
  const deleteEnquire = useDeleteEnquire();

  // Filter by name
  const filteredEnquires = enquires.filter((e) =>
    e.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEnquires.length / pageSize);
  const paginatedEnquires = filteredEnquires.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Dialog handlers
  const openAddDialog = () => {
    setSelectedEnquire(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (enquire: IEnquire) => {
    setSelectedEnquire(enquire);
    setIsDialogOpen(true);
  };

  const handleSubmitEnquire = (enquire: IEnquire) => {
    if (enquire._id) {
      // Update existing enquiry
      updateEnquire.mutate(enquire, {
        onSuccess: (response: { message?: string }) => {
          // Use backend message if available, fallback to default
          toast.success(response?.message || "Enquiry updated successfully!");
          setIsDialogOpen(false);
        },
        onError: (error: { message?: string }) => {
          toast.error(error?.message || "Failed to update enquiry.");
        },
      });
    } else {
      // Add new enquiry
      addEnquire.mutate(enquire, {
        onSuccess: (response: { message?: string }) => {
          // Show backend success message
          toast.success(response?.message || "Enquiry added successfully!");
          setIsDialogOpen(false);
        },
        onError: (error: { message?: string }) => {
          toast.error(error?.message || "Failed to add enquiry.");
        },
      });
    }
  };



  const handleDelete = (enquire: IEnquire) => deleteEnquire.mutate(enquire._id!);

  // Table columns
  const columns: Column<IEnquire>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "message", label: "Message" },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <AppProtectedRoute>
    <AppContainer>
      <div className="p-3 grid gap-6">
        {/* Header Actions */}
        <AppHeaderActions
          title="Add Enquiry"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={openAddDialog}
        />

        {/* Table */}
        <div
          className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
            }`}
        >
          {isLoading ? (
            <TableSkeleton rows={pageSize} />
          ) : (
            <GlobalTable<IEnquire>
              columns={columns}
              data={paginatedEnquires}
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

        {/* Add/Edit Dialog */}
        <AddEnquireDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitEnquire={handleSubmitEnquire}
          enquireToEdit={selectedEnquire || undefined}
        />
      </div>
    </AppContainer>
    </AppProtectedRoute>
  );
}
