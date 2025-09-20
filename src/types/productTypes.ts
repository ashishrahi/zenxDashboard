export interface IProductVariant {
  _id: string;
  color: string;
  images: string[];
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  colors: string[];
  variants: IProductVariant[];
  sizes: string[];
  category: string;        // category id
  subCategory: string;     // subcategory id
  description?: string;
  material?: string;
  care?: string;
  delivery?: string;
  rating?: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
