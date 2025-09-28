"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddContactDialog } from "@/AppComponents/AppContactDialog"; // Create this similar to AddBannerDialog
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { IContact } from "@/types/IContactTypes";

import {
  useContacts,
  useAddContact,
  useUpdateContact,
  useDeleteContact,
} from "@/hooks/Contacts/index"; // similar hooks as Banners
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";

// Column type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}



export default function ContactPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  const { data: contacts = [], isLoading } = useContacts();
  const addContact = useAddContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const filteredContacts = contacts.filter((c) =>
    c.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedContact(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: IContact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleSubmitContact = (contact: IContact) => {
    if (contact._id) {
      updateContact.mutate(contact);
    } else {
      addContact.mutate(contact);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (contact: IContact) => deleteContact.mutate(contact._id!);

  // Table columns
  const columns: Column<IContact>[] = [
    { key: "title", label: "Title" },
    { key: "address", label: "Address" },
    { key: "cin", label: "CIN" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "timing", label: "Timing" },
    { key: "colspan", label: "Colspan" },
  ];

  return (
    <AppProtectedRoute>

      <AppContainer>
        <div className="p-3 grid gap-6">
          {/* Header Actions */}
          <AppHeaderActions
            title="Add Contact"
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
              <GlobalTable<IContact>
                columns={columns}
                data={paginatedContacts}
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
          <AddContactDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmitContact={handleSubmitContact}
            contactToEdit={selectedContact || undefined}
          />
        </div>
      </AppContainer>
    </AppProtectedRoute>
  );
}
