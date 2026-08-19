import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { products as staticProducts } from '../data';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Maps any AdminJS/DB category value to the frontend's slug-based category id.
// Handles both the new clean slugs and any legacy "Female Bangles"-style values.
const CATEGORY_MAP: Record<string, string> = {
  'rings': 'rings',
  'female rings': 'rings',
  'male rings': 'rings',
  'earrings': 'earrings',
  'female earrings': 'earrings',
  'male earrings': 'earrings',
  'male ear-studs': 'earrings',
  'bracelets': 'bracelets',
  'female bracelet': 'bracelets',
  'male bracelet': 'bracelets',
  'pendants': 'pendants',
  'chains': 'chains',
  'female chain': 'chains',
  'male chain': 'chains',
  'bangles': 'bangles',
  'female bangles': 'bangles',
  'sets': 'sets',
  'astro': 'astro',
};

function normalizeCategory(raw: string | undefined | null): string {
  if (!raw) return 'rings';
  const key = raw.trim().toLowerCase();
  return CATEGORY_MAP[key] || key;
}

export function mapDbProductsToStorefront(dbProducts: any[]): Product[] {
  if (!dbProducts || dbProducts.length === 0) {
    return staticProducts;
  }

  const mapped: Product[] = [];

  dbProducts.forEach((prod: any) => {
    // If the base product has no variants, create a mock variant
    const variants = prod.variants && prod.variants.length > 0
      ? prod.variants
      : [{ id: `mock-${prod.id}`, sku: prod.baseSKU, finalPrice: 2000, metalType: 'SILVER', size: 'OS', stock: 10 }];

    variants.forEach((v: any) => {
      // Find if we have a static product in data.ts that matches by baseSKU or name
      const staticMatch = staticProducts.find((sp: any) =>
        sp.id.toLowerCase() === prod.id.toLowerCase() ||
        sp.name.toLowerCase() === prod.name.toLowerCase() ||
        prod.baseSKU.toLowerCase().startsWith(sp.id.toLowerCase()) ||
        sp.id.toLowerCase().startsWith(prod.baseSKU.toLowerCase())
      );

      // Default category specific images
      let defaultImage = "/images/products/chains/15OWZ4q7jDXSoPmI2oQ1BJMLjb0ASwyTZ.webp";
      if (prod.category === "earrings") {
        defaultImage = "/images/products/earrings/1lgr1ZN3nw8rHPAC4NZ0nxHIzhaAOofUk.webp";
      } else if (prod.category === "rings") {
        const ringMatch = staticProducts.find(sp => sp.category === 'rings') || staticProducts.find(sp => sp.id.includes('ring'));
        defaultImage = ringMatch ? ringMatch.image : "/images/products/earrings/1lgr1ZN3nw8rHPAC4NZ0nxHIzhaAOofUk.webp";
      } else if (prod.category === "bracelets" || prod.category === "bangles") {
        const braceMatch = staticProducts.find(sp => sp.category === 'bracelets' || sp.category === 'bangles');
        defaultImage = braceMatch ? braceMatch.image : defaultImage;
      }

      mapped.push({
        id: v.id, // Variant ID is used as the storefront product ID
        name: `${prod.name} (${v.metalType.replace("GOLD_", "").replace("SILVER", "Silver")}${v.size && v.size !== "OS" ? ` - Sz ${v.size}` : ""})`,
        price: v.finalPrice,
        originalPrice: v.finalPrice + Math.round(v.finalPrice * 0.15),
        image: prod.images && prod.images.length > 0 ? prod.images[0] : (staticMatch ? staticMatch.image : defaultImage),
        images: prod.images && prod.images.length > 0 ? prod.images : (staticMatch ? staticMatch.images : [defaultImage]),
        category: prod.category,
        isNew: v.stock > 0 && v.stock < 5,
        // Custom properties passed down
        ...({
          sku: v.sku,
          variantId: v.id,
          productId: prod.id,
          stock: v.stock
        } as any)
      });
    });
  });

  return mapped;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          const dbProds: Product[] = data.products.map((p: any) => {
            const defaultImg = p.fullImageUrl ? p.fullImageUrl : (p.imageKey ? `/uploads/${p.imageKey}` : (p.image || (p.images && p.images[0]) || "/images/products/chains/15OWZ4q7jDXSoPmI2oQ1BJMLjb0ASwyTZ.webp"));
            const imgList = p.fullImageUrls && p.fullImageUrls.length > 0 ? p.fullImageUrls : (p.images && p.images.length > 0 ? p.images : [defaultImg]);
            return {
              id: p._id || p.id || `db-${Date.now()}`,
              name: p.name,
              price: Number(p.price) || 0,
              originalPrice: p.originalPrice ? Number(p.originalPrice) : (p.hasActiveOffer && p.offerDiscountPercentage ? Math.round(Number(p.price) / (1 - Number(p.offerDiscountPercentage) / 100)) : undefined),
              image: defaultImg,
              images: imgList,
              category: normalizeCategory(p.category),
              isNew: p.stockStatus === 'IN_STOCK'
            };
          });
          setProducts([...dbProds, ...staticProducts]);
          return;
        }
      }
      setProducts(staticProducts);
    } catch (error) {
      console.error("Failed to load products from API:", error);
      setProducts(staticProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, isLoading, refreshProducts: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
