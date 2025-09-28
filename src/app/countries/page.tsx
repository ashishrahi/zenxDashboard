"use client";

import { useState, useMemo } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddCountryDialog } from "@/AppComponents/AppCountryDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

import {
  useCountries,
  useAddCountry,
  useUpdateCountry,
  useDeleteCountry,
} from "@/hooks/Countries";

import { ICountryPayload } from "@/types/ICountryTypes";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";

export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export default function CountryPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedCountry, setSelectedCountry] = useState<ICountryPayload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: countries = [], isLoading } = useCountries();
  const addCountry = useAddCountry();
  const updateCountry = useUpdateCountry();
  const deleteCountry = useDeleteCountry();

  // Convert createdAt/updatedAt strings to Date objects
  const countriesWithDates = useMemo(
    () =>
      countries.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      })),
    [countries]
  );

  // Filtered countries based on search
  const filteredCountries = useMemo(
    () =>
      countriesWithDates.filter((c) =>
        c.name.toLowerCase().includes(filterText.toLowerCase())
      ),
    [countriesWithDates, filterText]
  );

  const totalPages = Math.ceil(filteredCountries.length / pageSize);

  const paginatedCountries = useMemo(
    () =>
      filteredCountries.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredCountries, currentPage, pageSize]
  );

  // Table columns
  const columns: Column<ICountryPayload>[] = [
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

  // Open add/edit dialog
  const openAddDialog = () => {
    setSelectedCountry(null);
    setIsDialogOpen(true);
  };
  const openEditDialog = (country: ICountryPayload) => {
    setSelectedCountry(country);
    setIsDialogOpen(true);
  };

  // Handle save from dialog
 const handleCountrySaved = (country: ICountryPayload) => {
  if (selectedCountry && selectedCountry._id) {
    // Edit mode: merge the _id from selectedCountry
    updateCountry.mutate({ ...country, _id: selectedCountry._id });
  } else {
    // Add mode
    addCountry.mutate(country);
  }
  setIsDialogOpen(false);
};


  // Handle delete
  const handleDelete = (country: ICountryPayload) => deleteCountry.mutate(country._id);

  return (
    <AppProtectedRoute>
    <AppContainer>
      <div className="p-3 grid gap-6">
        <AppHeaderActions
          title="Add Country"
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
            <GlobalTable<ICountryPayload>
              columns={columns}
              data={paginatedCountries}
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
          <AddCountryDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            countryToEdit={selectedCountry ?? undefined}
            onSubmit={handleCountrySaved} // ✅ renamed to onSubmit
          />
        )}
      </div>
    </AppContainer>
    </AppProtectedRoute>
  );
}
