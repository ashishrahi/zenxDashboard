export interface ISubcategory {
  _id: string; // Backend _id as string
  name: string;
  description?: string;
  images?: (string | File)[];
  categoryId: string; // Frontend can just use string
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}


export interface ISubcategoryResponse {
  success: boolean;
  message: string;
  data: ISubcategory;
}