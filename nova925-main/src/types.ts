export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  isNew?: boolean;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  key?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
}
