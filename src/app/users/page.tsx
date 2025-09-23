"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
// import { AddUserDialog } from "@/AppComponents/AppUserDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/Users";

import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

// Column type for table
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export interface GlobalTableProps<RowType extends { _id: string }> {
  columns: Column<RowType>[];
  data: RowType[];
  onEdit?: (row: RowType) => void;
  onDelete?: (row: RowType) => void;
  title?: string;
}

// ===== User Payload =====
export interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<IUserPayload | null>(null);

  // API Hooks
  const { data: users = [], isLoading } = useUsers();
  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // ===== Filtering =====
  const filteredUsers = users.filter((u) =>
    (u.name ?? "").toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ===== Dialog Handlers =====
  const openAddDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: IUserPayload) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  // ===== Submit Handler =====
  const handleSubmitUser = (user: IUserPayload) => {
    if (user._id) {
      updateUser.mutate(user);
    } else {
      addUser.mutate(user);
    }
    setIsDialogOpen(false);
  };

  // ===== Delete Handler =====
  const handleDelete = (user: IUserPayload) => deleteUser.mutate(user._id);

  // ===== Table Columns =====
  const columns: Column<IUserPayload>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "phone", label: "Phone" },
    {
      key: "address",
      label: "Address",
      render: (row) => row.address || "N/A",
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
        {/* Header Actions */}
        <AppHeaderActions
          title="Add User"
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
            <GlobalTable<IUserPayload>
              columns={columns}
              data={paginatedUsers}
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
        {/* <AddUserDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitUser={handleSubmitUser}
          userToEdit={selectedUser || undefined}
        /> */}
      </div>
    </AppContainer>
  );
}
