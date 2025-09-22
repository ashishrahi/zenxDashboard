"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Column interface is generic over RowType
export interface Column<RowType> {
  key: keyof RowType; // must be a valid property of RowType
  label: string;
  render?: (row: RowType) => React.ReactNode; // optional custom render
}

export interface GlobalTableProps<RowType extends { _id: string }> {
  columns: Column<RowType>[];
  data: RowType[];
  onEdit?: (row: RowType) => void;
  onDelete?: (row: RowType) => void;
  title?: string;
}


export function GlobalTable<RowType extends { _id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  title,
}: GlobalTableProps<RowType>) {
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
                {col.label}
              </TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              {columns.map((col) => (
               <TableCell
  key={String(col.key)}
  className="text-foreground dark:text-gray-100 truncate max-w-[150px]"
>
  {col.render
    ? col.render(row)
    : String(row[col.key] ?? "")} {/* convert value to string to satisfy ReactNode */}
</TableCell>

              ))}

              {(onEdit || onDelete) && (
                <TableCell>
                  {onEdit && (
                    <Button size="sm" onClick={() => onEdit(row)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="ml-2"
                      onClick={() => onDelete(row)}
                    >
                      Delete
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
