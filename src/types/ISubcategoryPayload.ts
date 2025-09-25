export interface ISubcategoryPayload {
  _id: string;
  name: string;
  categoryId: string;
  description?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
