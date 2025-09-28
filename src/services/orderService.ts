"use client";

import axiosInstance from "@/lib/axios";
import { IOrderPayload } from "@/types/IOrderPayload";

export const OrderService = {
  // Fetch all orders
  getAll: async (): Promise<IOrderPayload[]> => {
    const response = await axiosInstance.get("/orders");
    return response?.data?.data; // returns array of orders
  },

  // Fetch a single order by ID
  getById: async (id: string): Promise<IOrderPayload> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response?.data?.data;
  },

  // Create a new order
  create: async (order: Omit<IOrderPayload, "_id">) => {
    const response = await axiosInstance.post("/orders/create", order);
    return response?.data?.data;
  },

  // Update an existing order
  update: async (order: IOrderPayload) => {
    const response = await axiosInstance.put(`/orders/update/${order._id}`, order);
    return response?.data?.data;
  },

  // Delete an order by ID
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/orders/delete/${id}`);
  },
};
