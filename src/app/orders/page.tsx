"use client";
import { useState } from "react";
import { AppContainer } from "@/AppComponents/AppContainer";
import { GlobalTable } from "@/AppComponents/AppTable";
import { ShadCNPagination } from "@/AppComponents/AppPagination";
import AppHeaderActions from "@/AppComponents/AppHeaderActions";
import { PageSizeSelector } from "@/AppComponents/AppPageSizeSelector";
import { TableSkeleton } from "@/AppComponents/TableSkeleton";
import {
  useOrders,
  useUpdateOrder,
  useDeleteOrder,
} from "@/hooks/Orders";

// Column Type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

// Order Payload
export interface IOrderPayload {
  _id: string;
  userId: string;
  products: {
    product: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: orders = [], isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  // Filter orders
  const filteredOrders = orders.filter((o) =>
    o.status.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Edit order (status update)
  const handleEditOrder = (order: IOrderPayload) => {
    updateOrder.mutate(order);
  };

  // Delete order
  const handleDeleteOrder = (order: IOrderPayload) => {
    deleteOrder.mutate(order._id);
  };

  // Table columns
  const columns: Column<IOrderPayload>[] = [
    { key: "userId", label: "User ID" },
    {
      key: "products",
      label: "Products",
      render: (row) => (
        <ul>
          {row.products.map((p, index) => (
            <li key={index}>
              {p.product} (Qty: {p.quantity}, Price: ₹{p.price})
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "shippingAddress",
      label: "Shipping Address",
      render: (row) =>
        `${row.shippingAddress.address}, ${row.shippingAddress.city}, ${row.shippingAddress.postalCode}, ${row.shippingAddress.country}`,
    },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "totalPrice",
      label: "Total Price",
      render: (row) => `₹${row.totalPrice}`,
    },
    { key: "status", label: "Status" },
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
          title="Orders"
          filterText={filterText}
          setFilterText={setFilterText}
          onAddClick={() => {}}
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
            <GlobalTable<IOrderPayload>
              columns={columns}
              data={paginatedOrders}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
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
