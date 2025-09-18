"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<UserTableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="p-4">
      <div className="grid gap-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 items-center py-2">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 w-full rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
