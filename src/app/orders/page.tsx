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
import {
  User,
  Package,
  CreditCard,
  IndianRupee,
  Calendar,
  Clock,
} from "lucide-react";

// Column Type
export interface Column<RowType> {
  key: keyof RowType;
  label: string;
  render?: (row: RowType) => React.ReactNode;
}


export default function OrdersPage() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: orders = [], isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    processing: "bg-blue-100 text-blue-800 border border-blue-300",
    shipped: "bg-indigo-100 text-indigo-800 border border-indigo-300",
    delivered: "bg-green-100 text-green-800 border border-green-300",
    cancelled: "bg-red-100 text-red-800 border border-red-300",
  };

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
  const handleEditOrder = (orderId: string, newStatus: string) => {
    const fullOrder = orders.find((order) => order._id === orderId);
    if (fullOrder) {
      updateOrder.mutate({
        ...fullOrder,
        status: newStatus,
      });
    }
  };

  // Delete order
  const handleDeleteOrder = (order: IOrderPayload) => {
    deleteOrder.mutate(order._id);
  };

  // Table columns
  const columns: Column<IOrderPayload>[] = [
    {
      key: "userId",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span>{row.userId?.name}</span>
          <span className="text-xs text-gray-400">({row.userId?._id})</span>
        </div>
      ),
    },
    {
      key: "products",
      label: "Products",
      render: (row) => (
        <ul className="list-disc pl-5 space-y-1">
          {row.products.map((p, index) => (
            <li key={index} className="text-sm text-gray-700">
              <Package className="inline w-4 h-4 mr-1 text-gray-500" />
              {p.product.name}{" "}
              <span className="text-gray-500">
                (Qty: {p.quantity}, ₹{p.price})
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "shippingAddress",
      label: "Shipping Address",
      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.shippingAddress.address}, {row.shippingAddress.city},{" "}
          {row.shippingAddress.postalCode}, {row.shippingAddress.country}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (row) => (
        <div className="flex items-center gap-1">
          <CreditCard className="w-4 h-4 text-gray-500" />
          <span>{row.paymentMethod}</span>
        </div>
      ),
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (row) => (
        <div className="flex items-center gap-1 font-medium">
          <IndianRupee className="w-4 h-4 text-gray-500" />
          ₹{row.totalPrice}
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
          <SelectTrigger className="w-36">
            <SelectValue>
              <Badge className={`${statusColors[row.status]} capitalize`}>
                {row.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statusColors).map((status) => (
              <SelectItem key={status} value={status}>
                <Badge className={`${statusColors[status]} capitalize`}>
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
      label: "Created",
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-500" />
          {new Date(row.createdAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      ),
    },
    {
      key: "updatedAt",
      label: "Updated",
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-500" />
          {new Date(row.updatedAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      ),
    },
   
  ];

  return (
    <AppProtectedRoute>
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
            className={`border rounded-md shadow-sm transition-all duration-300 overflow-x-auto sm:overflow-x-hidden ${
              pageSize > 5 ? "max-h-[400px] overflow-y-auto" : "max-h-none"
            }`}
          >
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
    </AppProtectedRoute>
  );
}
