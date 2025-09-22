import { ICategoryPayload } from "./categoriesTypes";

export interface IProductVariant {
  _id?: string;        // optional variant ID
  color: string;
  images: string[];
  stock: number;
}

export interface Product {
  id?: string;
  name?: string;
  slug?: string;
  price?: number;
  colors?: string[];
  variants?: IProductVariant[];
  sizes?: string[];
  categoryId?: string;        // category id
  subcategoryId?: string;     // subcategory id
  description?: string;
  material?: string;
  care?: string;
  delivery?: string;
  rating?: number;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductPayload {
  _id: string;
  name: string;
  slug: string;
  price: number;
  colors: string[];
  variants: IProductVariant[];
  sizes: string[];
  categoryId: string;
  subcategoryId: string;
  description?: string;
  material?: string;
  care?: string;
  delivery?: string;
  rating?: number;
  stock: number;
  images: string[];         // fixed type from empty array to string[]
  createdAt?: string;
}

export interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProduct: (product: IProductPayload) => void;
  productToEdit?: IProductPayload;
  categories: ICategoryPayload[];
}
