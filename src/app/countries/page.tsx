"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddCountryDialog } from "@/AppComponents/AddCountryDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";

import {
  useCountries,
  useAddCountry,
  useUpdateCountry,
  useDeleteCountry,
} from "@/hooks/Countries/index";
import { ICountry } from "@/types/countryTypes";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { Globe } from "lucide-react";

export default function CountryPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

  const { data: countries = [], isLoading } = useCountries();
  const addCountry = useAddCountry();
  const updateCountry = useUpdateCountry();
  const deleteCountry = useDeleteCountry();

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCountries.length / pageSize);
  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddDialog = () => {
    setSelectedCountry(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (country: ICountry) => {
    setSelectedCountry(country);
    setIsDialogOpen(true);
  };

  const handleSubmitCountry = (country: ICountry) => {
    if (country.id) updateCountry.mutate(country);
    else addCountry.mutate({ ...country, id: undefined });
    setIsDialogOpen(false);
  };

  const handleDelete = (country: ICountry) => deleteCountry.mutate(country.id);

  const columns = [
    { key: "name", label: "Country Name" },
    { key: "code", label: "Code" },
    { key: "continent", label: "Continent" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">

        {/* Header Actions */}
        <AppHeaderActions
          title="Add Country"
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
            <TableSkeleton rows={pageSize} />
          ) : (
            <GlobalTable
              columns={columns}
              data={paginatedCountries}
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

        {/* Add / Edit Country Dialog */}
        <AddCountryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitCountry={handleSubmitCountry}
          countryToEdit={selectedCountry || undefined}
        />
      </div>
    </AppContainer>
  );
}
