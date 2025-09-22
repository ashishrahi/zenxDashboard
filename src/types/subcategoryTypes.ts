export interface ISubcategory {
  _id: string; // Backend _id as string
  name?: string;
  slug?: string;
  description?: string;
  images: string[];
  categoryId?: string; // Frontend can just use string
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
