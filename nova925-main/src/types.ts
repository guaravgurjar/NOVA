export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  imageUrls?: string[];     // Raw Cloudflare R2 full URLs (direct CDN access)
  isNew?: boolean;
  category?: string;
  subcategory?: string;
  stock?: number;           // Available stock quantity; undefined = unlimited
  description?: string;     // Optional product description
  isActive?: boolean;       // Visibility toggle; false = hidden from storefront
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

export interface Slide {
  id: number | string;
  image: string;          // Desktop image (viewport >= 768px)
  mobileImage?: string;   // Optional mobile image (viewport < 768px)
  alt?: string;
  link?: string;
  title?: string;
  subtitle?: string;
}

