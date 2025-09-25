export interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}