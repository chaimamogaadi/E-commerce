export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  color: string;
  brand: string;
  stock: number;
  imageUrl: string;
}

export interface ProductFilter {
  category?: string;
  color?: string;
  maxPrice?: number;
  keyword?: string;
}