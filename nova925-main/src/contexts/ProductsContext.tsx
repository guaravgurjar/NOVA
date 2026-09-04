import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Maps any AdminJS/DB category value to the frontend's slug-based category id.
const CATEGORY_MAP: Record<string, string> = {
  // ── New main categories ────────────────────────────────────────────────
  'gifts-for-her':    'gifts-for-her',
  'gifts-for-him':    'gifts-for-him',
  'astro-collection': 'astro-collection',

  // ── Gifts For Her subcategories ───────────────────────────────────────
  'female-rings':     'rings',
  'female-earrings':  'earrings',
  'female-bracelets': 'bracelets',
  'female-chains':    'chains',
  'female-bangles':   'bangles',
  'female-pendants':  'pendants',

  // ── Gifts For Him subcategories ───────────────────────────────────────
  'male-rings':       'rings',
  'male-earrings':    'earrings',
  'male-bracelets':   'bracelets',
  'male-chains':      'chains',
  'male-ear-studs':   'earrings',

  // ── Astro subcategories ───────────────────────────────────────────────
  'astro-pendants':   'pendants',
  'astro-rings':      'rings',
  'astro-bracelets':  'bracelets',

  // ── Legacy / flat category values ─────────────────────────────────────
  'rings':            'rings',
  'female rings':     'rings',
  'male rings':       'rings',
  'earrings':         'earrings',
  'female earrings':  'earrings',
  'male earrings':    'earrings',
  'male ear-studs':   'earrings',
  'bracelets':        'bracelets',
  'female bracelet':  'bracelets',
  'male bracelet':    'bracelets',
  'pendants':         'pendants',
  'chains':           'chains',
  'female chain':     'chains',
  'male chain':       'chains',
  'bangles':          'bangles',
  'female bangles':   'bangles',
  'sets':             'sets',
  'astro':            'astro-collection',
};

function normalizeCategory(raw: string | undefined | null): string {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  return CATEGORY_MAP[key] || key;
}

const PRODUCTS_CACHE_KEY = 'nova_products_cache_v3'; // bumped — clears old static-seeded cache
const PRODUCTS_CACHE_TTL_MS = 30_000; // 30 seconds

function readLocalCache(): Product[] | null {
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > PRODUCTS_CACHE_TTL_MS) {
      localStorage.removeItem(PRODUCTS_CACHE_KEY);
      return null;
    }
    return data as Product[];
  } catch {
    return null;
  }
}

function writeLocalCache(data: Product[]) {
  try {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded */ }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => readLocalCache() ?? []);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (forceFresh = false) => {
    setIsLoading(true);

    // Serve from fresh cache unless forced
    if (!forceFresh) {
      const cached = readLocalCache();
      if (cached) {
        setProducts(cached);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = (await response.json()) as any;
        if (data.products && data.products.length > 0) {
          const dbProds: Product[] = data.products.map((p: any) => {
            const defaultImg = p.fullImageUrl
              ? p.fullImageUrl
              : p.imageKey
                ? `/uploads/${p.imageKey}`
                : (p.image || (p.images && p.images[0]) || '');
            const imgList =
              p.fullImageUrls && p.fullImageUrls.length > 0
                ? p.fullImageUrls
                : p.images && p.images.length > 0
                  ? p.images
                  : [defaultImg];

            return {
              id: p._id || p.id || `db-${Date.now()}`,
              name: p.name,
              price: Number(p.price) || 0,
              originalPrice: p.originalPrice
                ? Number(p.originalPrice)
                : p.hasActiveOffer && p.offerDiscountPercentage
                  ? Math.round(Number(p.price) / (1 - Number(p.offerDiscountPercentage) / 100))
                  : undefined,
              image: defaultImg,
              images: imgList,
              category: normalizeCategory(p.category),
              subcategory: p.subcategory
                ? (CATEGORY_MAP[p.subcategory.toLowerCase()] || p.subcategory)
                : undefined,
              isNew: p.stockStatus === 'IN_STOCK',
              stock:
                typeof p.stock === 'number'
                  ? p.stock
                  : typeof p.stockQuantity === 'number'
                    ? p.stockQuantity
                    : undefined,
            };
          });

          setProducts(dbProds);
          writeLocalCache(dbProds);
          return;
        }
      }
      // API returned nothing — show empty list, do NOT fall back to static data
      setProducts([]);
    } catch (error) {
      console.error('Failed to load products from API:', error);
      // Network failure — keep existing cached state if available, else empty
      setProducts((prev) => (prev.length > 0 ? prev : []));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, isLoading, refreshProducts: () => fetchProducts(true) }}>
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
