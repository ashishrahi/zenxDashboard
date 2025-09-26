"use client";

import { useState, useMemo } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddCityDialog } from "@/AppComponents/AppCityDialog"; // Updated
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";

import {
  useCities,       
  useAddCity,      
  useUpdateCity,  
  useDeleteCity,   
} from "@/hooks/Cities";

import { ICityPayload } from "@/types/ICityPayload"; // Updated type

export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export default function CityPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedCity, setSelectedCity] = useState<ICityPayload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: cities = [], isLoading } = useCities();
  const addCity = useAddCity();
  const updateCity = useUpdateCity();
  const deleteCity = useDeleteCity();

  const citiesWithDates = useMemo(
    () =>
      cities.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      })),
    [cities]
  );

  const filteredCities = useMemo(
    () =>
      citiesWithDates.filter((c) =>
        c.name.toLowerCase().includes(filterText.toLowerCase())
      ),
    [citiesWithDates, filterText]
  );

  const totalPages = Math.ceil(filteredCities.length / pageSize);

  const paginatedCities = useMemo(
    () =>
      filteredCities.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredCities, currentPage, pageSize]
  );

  const columns: Column<ICityPayload>[] = [
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

  const openAddDialog = () => {
    setSelectedCity(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (city: ICityPayload) => {
    setSelectedCity(city);
    setIsDialogOpen(true);
  };

  const handleCitySaved = (city: ICityPayload) => {
    if (city._id) {
      updateCity.mutate(city);
    } else {
      addCity.mutate(city);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (city: ICityPayload) => deleteCity.mutate(city._id);

  return (
    <AppContainer>
      <div className="p-3 grid gap-6">
        <AppHeaderActions
          title="Add City"
          searchText ="cityname"
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
            <GlobalTable<ICityPayload>
              columns={columns}
              data={paginatedCities}
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
          <AddCityDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            cityToEdit={selectedCity ?? null}
            onSubmit={handleCitySaved}
          />
        )}
      </div>
    </AppContainer>
  );
}
