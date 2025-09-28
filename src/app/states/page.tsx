"use client";

import { useState, useMemo } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddStateDialog } from "@/AppComponents/AppStateDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

import {
  useStates,
  useAddState,
  useUpdateState,
  useDeleteState,
} from "@/hooks/States";

import { IStatePayload } from "@/types/IStateTypes";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";

export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export default function StatePage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedState, setSelectedState] = useState<IStatePayload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: states = [], isLoading } = useStates();
  const addState = useAddState();
  const updateState = useUpdateState();
  const deleteState = useDeleteState();

  const statesWithDates = useMemo(
    () =>
      states.map((s) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      })),
    [states]
  );

  const filteredStates = useMemo(
    () =>
      statesWithDates.filter((s) =>
        s.name.toLowerCase().includes(filterText.toLowerCase())
      ),
    [statesWithDates, filterText]
  );

  const totalPages = Math.ceil(filteredStates.length / pageSize);

  const paginatedStates = useMemo(
    () =>
      filteredStates.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredStates, currentPage, pageSize]
  );

  const columns: Column<IStatePayload>[] = [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
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

  const openAddDialog = () => {
    setSelectedState(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (state: IStatePayload) => {
    setSelectedState(state);
    setIsDialogOpen(true);
  };

  const handleStateSaved = (state: IStatePayload) => {
    if (state._id) {
      updateState.mutate(state);
    } else {
      addState.mutate(state);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (state: IStatePayload) => deleteState.mutate(state._id);

  return (
        <AppProtectedRoute>
    
    <AppContainer>
      <div className="p-3 grid gap-6">
        <AppHeaderActions
          title="Add State"
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
            <GlobalTable<IStatePayload>
              columns={columns}
              data={paginatedStates}
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
          <AddStateDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            stateToEdit={selectedState ?? undefined}
            onSubmit={handleStateSaved}
          />
        )}
      </div>
    </AppContainer>
    </AppProtectedRoute>
  );
}
