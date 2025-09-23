// A single product in an order
export interface IOrderProduct {
  product: string;        // Product ID
  quantity: number;
  price: number;
}

// Shipping address
export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Optional payment result info
export interface IPaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

// Main Order type
export interface IOrderPayload {
  _id?: string;                // optional for new orders
  userId: string;              // ID of the user who placed the order
  products: IOrderProduct[];   // products in the order
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: IPaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
