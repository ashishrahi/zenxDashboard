"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddUserDialog } from "@/AppComponents/AppUserDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/Users/index";
import { IUser } from "@/types/userTypes";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

export default function UserPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const { data: users = [], isLoading } = useUsers();
  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

 const filteredUsers = users.filter((u) =>
  (u.name ?? "").toLowerCase().includes(filterText.toLowerCase())
);
s

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: IUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSubmitUser = (user: IUser) => {
    if (user.id) updateUser.mutate(user);
    else addUser.mutate({ ...user, id: undefined });
    setIsDialogOpen(false);
  };

 const handleDelete = (user: IUser) => {
  if (!user.id) throw new Error("User ID is missing");
  deleteUser.mutate(user.id);
};


  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
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

        {/* Table Container */}
        <div
          className={`border rounded-md transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${
            pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
          }`}
        >
          {isLoading ? (
            <TableSkeleton
            rows={pageSize}
            />
          ) : (
            <GlobalTable
              columns={columns}
              data={paginatedUsers}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-2 gap-2 sm:gap-0">
          {/* Page Size Selector */}
          <PageSizeSelector
            pageSize={pageSize}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
          />

          {/* Pagination */}
          <ShadCNPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Add / Edit User Dialog */}
        <AddUserDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitUser={handleSubmitUser}
          userToEdit={selectedUser || undefined}
        />
      </div>
    </AppContainer>
  );
}
