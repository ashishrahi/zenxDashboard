"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

// Column interface
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export interface GlobalTableProps<RowType extends { _id: string }> {
  columns: Column<RowType>[];
  data?: RowType[]; // optional, can be undefined initially
  onEdit?: (row: RowType) => void;
  onDelete?: (row: RowType) => void;
  onView?: (row: RowType) => void; // optional view callback
  title?: string;
}

export function GlobalTable<RowType extends { _id: string }>({
  columns,
  data = [],
  onEdit,
  onDelete,
  onView,
  title,
}: GlobalTableProps<RowType>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-1 w-full">
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      )}

      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow className="text-zinc-950">
            {columns.map((col) => (
              <TableHead key={String(col.key)} className="truncate max-w-[150px]">
                {col.label ?? ""}
              </TableHead>
            ))}
            {(onEdit || onDelete || onView) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  className="text-foreground dark:text-gray-200 truncate max-w-[150px]"
                >
                  {col.render ? col.render(row) : String(row?.[col.key] ?? "")}
                </TableCell>
              ))}

              {(onEdit || onDelete || onView) && (
                <TableCell className="flex gap-2">
                  {onView && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(row)}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(row)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-green-600" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost" // transparent background
                      onClick={() => onDelete(row)}
                      title="Delete"
                      className="hover:bg-red-100 dark:hover:bg-red-900 p-1" // optional hover effect
                    >
                      <Trash2 className="w-4 h-4 text-red-600" /> {/* red icon */}
                    </Button>
                  )}

                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
