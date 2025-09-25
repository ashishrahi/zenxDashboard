"use client";

import { useState, useMemo } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
// import { AddUserDialog } from "@/AppComponents/AppUserDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import { useUsers, useDeleteUser } from "@/hooks/Users";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { IUserPayload } from "@/types/IUserPayload";

// Column type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export interface GlobalTableProps<RowType extends { _id: string }> {
  columns: Column<RowType>[];
  data: RowType[];
  onDelete?: (row: RowType) => void;
  title?: string;
}

export default function UserPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // API Hooks
  const { data: users = [], isLoading } = useUsers();
  const deleteUser = useDeleteUser();

  // ===== Transform users safely to IUserPayload =====
  const usersPayload: IUserPayload[] = useMemo(
    () =>
      users.map((u) => ({
        _id: u._id || "", // required
        name: u.name || "Unknown",
        email: u.email || "Unknown",
        role: (u.role as "user" | "admin") || "user",
        phone: u.phone || "",
        address:
          typeof u.address === "string"
            ? u.address
            : u.address?.street || "N/A",
         createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
      })),
    [users]
  );

  // ===== Filtering =====
  const filteredUsers = usersPayload.filter((u) =>
    u.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
