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
import { IOrderPayload } from "@/types/IOrderPayload";
import AppProtectedRoute from "@/AppComponents/AppProtectedRoute";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Column Type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}

export default function OrdersPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: orders = [], isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  // Filter orders
  const filteredOrders = orders.filter((o) =>
    o.status.toLowerCase().includes(filterText.toLowerCase()) ||
    o.userId?.toLowerCase().includes(filterText.toLowerCase()) ||
    o.paymentMethod?.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Edit order (status update)
 const handleEditOrder = (orderId: string, newStatus: string) => {
  // Find the complete order object from your orders array
  const fullOrder = orders.find(order => order._id === orderId);
  
  if (fullOrder) {
    updateOrder.mutate({
      ...fullOrder, // Spread all existing properties
      status: newStatus, // Only update the status
    });
  }
};

  // Delete order
  const handleDeleteOrder = (order: IOrderPayload) => {
    if (confirm(`Are you sure you want to delete order ${order._id}?`)) {
      deleteOrder.mutate(order._id);
    }
  };

  // Table columns
  const columns: Column<IOrderPayload>[] = [
    {
      key: "userId",
      label: "Customer",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.userId?.name || "N/A"}</div>
          <div className="text-xs text-gray-500">ID: {row.userId?._id?.slice(-6)}</div>
        </div>
      ),
    },
    {
      key: "products",
      label: "Products",
      render: (row) => (
        <div className="space-y-1">
          {row.products.slice(0, 2).map((p, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">• {p.product || `Product ${p.product.slice(-6)}`}</span>
              <span className="text-gray-600 ml-2">(Qty: {p.quantity})</span>
            </div>
          ))}
          {row.products.length > 2 && (
            <div className="text-xs text-gray-500">
              +{row.products.length - 2} more items
            </div>
          )}
        </div>
      ),
    },
    {
      key: "shippingAddress",
      label: "Shipping Address",
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium">{row.shippingAddress.city}</div>
          <div className="text-gray-600">{row.shippingAddress.country}</div>
        </div>
      ),
    },
    { 
      key: "paymentMethod", 
      label: "Payment",
      render: (row) => (
        <Badge variant="outline" className="capitalize">
          {row.paymentMethod}
        </Badge>
      )
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (row) => (
        <div className="font-semibold text-gray-900">
          ₹{row.totalPrice.toLocaleString()}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Select
          value={row.status}
          onValueChange={(value) => handleEditOrder(row._id, value)}
        >
          <SelectTrigger className="w-36 border-0 bg-transparent">
            <SelectValue>
              <Badge 
                variant="outline" 
                className={`${statusColors[row.status]} capitalize font-medium px-3 py-1`}
              >
                {row.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statusColors).map((status) => (
              <SelectItem key={status} value={status}>
                <Badge 
                  variant="outline" 
                  className={`${statusColors[status]} capitalize w-full justify-center`}
                >
                  {status}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "createdAt",
      label: "Order Date",
      render: (row) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {new Date(row.createdAt).toLocaleDateString("en-IN")}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(row.createdAt).toLocaleTimeString("en-IN", {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      ),
    },
  ];

  return (
    <AppProtectedRoute>
      <AppContainer>
        <div className="p-6 space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-1">
                Manage your customer orders efficiently
              </p>
            </div>
            <AppHeaderActions
              title=""
              filterText={filterText}
              setFilterText={setFilterText}
              onAddClick={() => {}}
              placeholder="Search orders..."
            />
          </div>

          {/* Table Card */}
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              {/* Table */}
              <div className="overflow-x-auto">
                {isLoading ? (
                  <TableSkeleton rows={pageSize} />
                ) : (
                  <GlobalTable<IOrderPayload>
                    columns={columns}
                    data={paginatedOrders}
                    onEdit={(row) => handleEditOrder(row._id, row.status)}
                    onDelete={handleDeleteOrder}
                  />
                )}
              </div>

              {/* Empty State */}
              {!isLoading && filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-3">📦</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">
                    {filterText ? "No orders match your search." : "No orders available."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Controls */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-4">
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
          )}
        </div>
      </AppContainer>
    </AppProtectedRoute>
  );
}