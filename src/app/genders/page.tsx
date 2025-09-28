"use client";

import { useState, useMemo } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddGenderDialog } from "@/AppComponents/AddGenderDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

import {
  useGenders,
  useAddGender,
  useUpdateGender,
  useDeleteGender,
} from "@/hooks/Genders";

import { IGenderPayload } from "@/types/IGenderPayload";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";

export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export default function GenderPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedGender, setSelectedGender] = useState<IGenderPayload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Gender hooks
  const { data: genders = [], isLoading } = useGenders();
  const addGender = useAddGender();
  const updateGender = useUpdateGender();
  const deleteGender = useDeleteGender();

  // Convert createdAt/updatedAt strings to Date objects
  const gendersWithDates = useMemo(
    () =>
      genders.map((g) => ({
        ...g,
        createdAt: new Date(g.createdAt),
        updatedAt: new Date(g.updatedAt),
      })),
    [genders]
  );

  // Filtered genders based on search
  const filteredGenders = useMemo(
    () =>
      gendersWithDates.filter((g) =>
        g.name.toLowerCase().includes(filterText.toLowerCase())
      ),
    [gendersWithDates, filterText]
  );

  const totalPages = Math.ceil(filteredGenders.length / pageSize);

  const paginatedGenders = useMemo(
    () =>
      filteredGenders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredGenders, currentPage, pageSize]
  );

  // Table columns
  const columns: Column<IGenderPayload>[] = [
    { key: "name", label: "Gender Name" },
    {
      key: "status",
      label: "Status",
      render: (row) => (row.status ? "Active" : "Inactive"),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => row.createdAt.toLocaleDateString(),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      render: (row) => row.updatedAt.toLocaleDateString(),
    },
  ];

  // Open add/edit dialog
  const openAddDialog = () => {
    setSelectedGender(null);
    setIsDialogOpen(true);
  };
  const openEditDialog = (gender: IGenderPayload) => {
    setSelectedGender(gender);
    setIsDialogOpen(true);
  };

  // Handle save from dialog
  const handleGenderSaved = (gender: IGenderPayload) => {
    if (selectedGender && selectedGender._id) {
      // Edit mode: merge the _id from selectedGender
      updateGender.mutate({ ...gender, _id: selectedGender._id });
    } else {
      // Add mode
      addGender.mutate(gender);
    }
    setIsDialogOpen(false);
  };

  // Handle delete
  const handleDelete = (gender: IGenderPayload) => deleteGender.mutate(gender._id);

  return (
    <AppProtectedRoute>
      <AppContainer>
        <div className="p-3 grid gap-6">
          <AppHeaderActions
            title="Add Gender"
            filterText={filterText}
            setFilterText={setFilterText}
            onAddClick={openAddDialog}
          />

          <div
            className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${
              pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
            }`}
          >
            {isLoading ? (
              <TableSkeleton rows={pageSize} />
            ) : (
              <GlobalTable<IGenderPayload>
                columns={columns}
                data={paginatedGenders}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            )}
          </div>

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

          {isDialogOpen && (
            <AddGenderDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              genderToEdit={selectedGender ?? undefined}
              onSubmit={handleGenderSaved}
            />
          )}
        </div>
      </AppContainer>
    </AppProtectedRoute>
  );
}
