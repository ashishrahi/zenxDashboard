export interface IOrderPayload {
  _id: string;
    userId: {
    _id: string;
    name: string;
  };
  products: {
     product: {
      name: string;
    };
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