"use client"
export interface ICategory {
  _id?: string,
  name?: string;
  slug?: string;
  gender?: string;
  description?: string;
  images?: [];
}
export interface ICategoryPayload {
   _id: string;       // Required for database objects
  name: string;
  description?: string;
  images: string[];  // Must match ICategoryPayload
  gender?: string;
  createdAt: string; // or Date if your API returns Date objects
  updatedAt: string; // or Date

}

export interface TableColumn<T> {
  key: keyof T | string; // key can be from T or a custom string
  label: string;
  render?: (row: T) => React.ReactNode; // strongly type the render function
}