"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { AddFaqDialog } from "@/AppComponents/AddFaqDialog";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { IFaq } from "@/types/faqTypes";

import {
  useFaqs,
  useAddFaq,
  useUpdateFaq,
  useDeleteFaq,
} from "@/hooks/Faq";

import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import { toast } from "sonner";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";

// Column type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export default function FaqPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<IFaq | null>(null);

  const { data: faqs = [], isLoading } = useFaqs();
  const addFaq = useAddFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  // Filter by question
  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(filterText.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredFaqs.length / pageSize);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Dialog handlers
  const openAddDialog = () => {
    setSelectedFaq(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (faq: IFaq) => {
    setSelectedFaq(faq);
    setIsDialogOpen(true);
  };

  const handleSubmitFaq = async (faq: IFaq) => {
  try {
    if (faq._id) {
      await updateFaq.mutateAsync(faq);
      toast.success("FAQ updated successfully!");
    } else {
      await addFaq.mutateAsync(faq);
      toast.success("FAQ added successfully!");
    }
    setIsDialogOpen(false);
  } catch (error) {
    toast.error((error as Error)?.message || "Operation failed.");
  }
};

  const handleDelete = (faq: IFaq) => deleteFaq.mutate(faq._id!);

  // Table columns
  const columns: Column<IFaq>[] = [
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer" },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <AppProtectedRoute>
    <AppContainer>
      <div className="p-3 grid gap-6">
        <AppHeaderActions
          title="Add FAQ"
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
            <GlobalTable<IFaq>
              columns={columns}
              data={paginatedFaqs}
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

        <AddFaqDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitFaq={handleSubmitFaq}
          faqToEdit={selectedFaq || undefined}
        />
      </div>
    </AppContainer>
    </AppProtectedRoute>
  );
}
