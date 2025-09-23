"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddExportItemDialog } from "@/AppComponents/AppExportItemDialog"; // similar to AddContactDialog
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { IExport } from "@/types/IExportItem"; // define interface below

import {
  useExportItems,
  useAddExportItem,
  useUpdateExportItem,
  useDeleteExportItem,
} from "@/hooks/ExportItems/index"; 
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import Image from "next/image";

// Column type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}


export default function ExportItemPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IExport | null>(null);

  const { data: items = [], isLoading } = useExportItems();
  const addItem = useAddExportItem();
  const updateItem = useUpdateExportItem();
  const deleteItem = useDeleteExportItem();

  const filteredItems = items.filter((c) =>
    c.country.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: IExport) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitItem = (item: IExport) => {
    if (item._id) {
      updateItem.mutate(item);
    } else {
      addItem.mutate(item);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (item: IExport) => deleteItem.mutate(item._id);

  const columns: Column<IExport>[] = [
    { key: "country", label: "Country" },
    { key: "code", label: "Code" },
    {
      key: "flag",
      label: "Flag",
      render: (row) => <Image width={200} height={200} src={`/flags/${row.flag}`} alt={row.country} className="w-6 h-4" />,
    },
    { key: "volume", label: "Volume" },
    { key: "category", label: "Category" },
    {
      key: "isActive",
      label: "Active",
      render: (row) => (row.isActive ? "Yes" : "No"),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      render: (row) => new Date(row.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        <AppHeaderActions
          title="Add Export Item"
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
            <GlobalTable<IExport>
              columns={columns}
              data={paginatedItems}
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

        <AddExportItemDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitItem={handleSubmitItem}
          itemToEdit={selectedItem || undefined}
        />
      </div>
    </AppContainer>
  );
}
