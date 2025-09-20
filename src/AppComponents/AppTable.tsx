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

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface GlobalTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  title?: string;
}

export const GlobalTable: React.FC<GlobalTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  title,
}) => {
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
              <TableHead key={col.key} className="truncate max-w-[150px]">
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
                  key={col.key}
                  className="text-foreground dark:text-gray-100 truncate max-w-[150px]"
                >
                  {col.render ? col.render(row) : row[col.key]}
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
};
