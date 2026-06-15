import { prisma } from './prisma';
import { calculateVariantPrice, generateVariantSKU } from './pricing';
import { Prisma } from '@prisma/client';

type Decimal = Prisma.Decimal;

import crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

let mockAdmins: any[] = [
  {
    id: 'admin-1',
    email: 'admin@nova925.com',
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    role: 'ADMIN'
  }
];


// In-Memory Database fallback for offline/development demo mode
let mockMetalRates: any[] = [
  { id: 'GOLD_24K', metalName: 'Gold 24K', pricePerGramUSD: 75.25, pricePerGramINR: 6283.38 },
  { id: 'GOLD_22K', metalName: 'Gold 22K', pricePerGramUSD: 68.98, pricePerGramINR: 5599.83 },
  { id: 'GOLD_18K', metalName: 'Gold 18K', pricePerGramUSD: 56.44, pricePerGramINR: 4712.53 },
  { id: 'GOLD_14K', metalName: 'Gold 14K', pricePerGramUSD: 43.90, pricePerGramINR: 3665.65 },
  { id: 'SILVER', metalName: 'Silver', pricePerGramUSD: 0.94, pricePerGramINR: 78.49 },
];

let mockProducts: any[] = [
  {
    id: 'prod-solitaire',
    name: 'Royal Solitaire Diamond Ring',
    description: 'A brilliant-cut diamond solitaire set in a luxury band.',
    baseSKU: 'RG-SLT',
    category: 'rings',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-herringbone',
    name: 'Classic Herringbone Chain',
    description: 'Sleek, fluid sterling silver chain laying flat against the skin.',
    baseSKU: 'CH-HRB',
    category: 'chains',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-drop',
    name: 'Dainty Drop Earrings',
    description: 'Elegant drop earrings with lab certified round cut gemstones.',
    baseSKU: 'ER-DRP',
    category: 'earrings',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rings_03',
    name: 'Elegant Peacock Silver Ring',
    description: 'An elegant peacock-designed sterling silver ring paved with emerald green and ruby pink gemstones.',
    baseSKU: 'RG-PCK',
    category: 'rings',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let mockVariants: any[] = [
  {
    id: 'var-slt-g18-sz7',
    sku: 'RG-SLT-G18-42G-SZ7',
    productId: 'prod-solitaire',
    metalType: 'GOLD_18K',
    metalWeight: 4.2,
    gemstoneCarat: 1.0,
    gemstoneCut: 'Round Brilliant',
    gemstoneClarity: 'VS1',
    gemstoneCost: 45000,
    size: '7',
    markup: 15000,
    stock: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'var-slt-g14-sz6',
    sku: 'RG-SLT-G14-38G-SZ6',
    productId: 'prod-solitaire',
    metalType: 'GOLD_14K',
    metalWeight: 3.8,
    gemstoneCarat: 0.5,
    gemstoneCut: 'Princess',
    gemstoneClarity: 'SI1',
    gemstoneCost: 22000,
    size: '6',
    markup: 12000,
    stock: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'var-hrb-slv-18in',
    sku: 'CH-HRB-S-102G-OS',
    productId: 'prod-herringbone',
    metalType: 'SILVER',
    metalWeight: 10.2,
    gemstoneCarat: 0,
    gemstoneCut: '',
    gemstoneClarity: '',
    gemstoneCost: 0,
    size: '18inch',
    markup: 2500,
    stock: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'var-drp-slv-cz',
    sku: 'ER-DRP-S-35G-OS',
    productId: 'prod-drop',
    metalType: 'SILVER',
    metalWeight: 3.5,
    gemstoneCarat: 0.8,
    gemstoneCut: 'Oval',
    gemstoneClarity: 'VVS2',
    gemstoneCost: 3500,
    size: 'One Size',
    markup: 1800,
    stock: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'var-pck-slv-sz7',
    sku: 'RG-PCK-S-35G-SZ7',
    productId: 'rings_03',
    metalType: 'SILVER',
    metalWeight: 3.5,
    gemstoneCarat: 1.2,
    gemstoneCut: 'Marquise & Round',
    gemstoneClarity: 'VS2',
    gemstoneCost: 1800,
    size: '7',
    markup: 1400,
    stock: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let mockOrders: any[] = [
  {
    id: 'order-1',
    orderNumber: 'NOV-10001',
    buyerName: 'Arjun Mehta',
    buyerEmail: 'arjun.mehta@gmail.com',
    shippingAddress: '42, Park Street, Sector 5, Kolkata, West Bengal - 700091',
    engravingText: 'Forever yours A&M',
    totalPrice: 79792.62,
    status: 'PENDING',
    trackingNumber: null,
    createdAt: new Date(Date.now() - 3600000 * 4),
    updatedAt: new Date(Date.now() - 3600000 * 4),
    items: [
      {
        id: 'item-1',
        variantId: 'var-slt-g18-sz7',
        quantity: 1,
        pricePaid: 79792.62,
        variant: {
          sku: 'RG-SLT-G18-42G-SZ7',
          product: { name: 'Royal Solitaire Diamond Ring' }
        }
      }
    ]
  },
  {
    id: 'order-2',
    orderNumber: 'NOV-10002',
    buyerName: 'Priya Sharma',
    buyerEmail: 'priya.sharma@yahoo.com',
    shippingAddress: 'B-103, Skyline Apartments, Andheri West, Mumbai, Maharashtra - 400053',
    engravingText: null,
    totalPrice: 5574.71,
    status: 'SHIPPED',
    trackingNumber: 'INS-TRK9820542',
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 48),
    items: [
      {
        id: 'item-2',
        variantId: 'var-drp-slv-cz',
        quantity: 1,
        pricePaid: 5574.71,
        variant: {
          sku: 'ER-DRP-S-35G-OS',
          product: { name: 'Dainty Drop Earrings' }
        }
      }
    ]
  }
];

// Helper to check if DB is working
async function isDbAvailable(): Promise<boolean> {
  if (process.env.DATABASE_URL?.includes('localhost:5432/mydb')) {
    return false; // Default placeholder
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    return false;
  }
}

export const dbService = {
  async getMetalRates() {
    if (await isDbAvailable()) {
      try {
        return await prisma.metalRates.findMany();
      } catch (e) {}
    }
    return mockMetalRates;
  },

  async updateMetalRates(rates: { id: string; name: string; usd: number; inr: number }[]) {
    if (await isDbAvailable()) {
      try {
        for (const r of rates) {
          await prisma.metalRates.upsert({
            where: { id: r.id },
            update: { pricePerGramUSD: r.usd, pricePerGramINR: r.inr },
            create: { id: r.id, metalName: r.name, pricePerGramUSD: r.usd, pricePerGramINR: r.inr },
          });
        }
        return;
      } catch (e) {}
    }
    // Update local memory
    mockMetalRates = mockMetalRates.map(mr => {
      const updated = rates.find(r => r.id === mr.id);
      if (updated) {
        return { ...mr, pricePerGramUSD: updated.usd, pricePerGramINR: updated.inr };
      }
      return mr;
    });
  },

  async getProducts() {
    const isDb = await isDbAvailable();
    const rates = await this.getMetalRates();
    
    let dbProducts: any[] = [];
    if (isDb) {
      try {
        dbProducts = await prisma.product.findMany({
          include: { variants: true }
        });
      } catch (e) {}
    }

    if (dbProducts.length === 0) {
      // Return memory products mapped with variants and dynamic prices
      return mockProducts.map((p: any) => {
        const variants = mockVariants
          .filter((v: any) => v.productId === p.id)
          .map((v: any) => {
            const metalRate = rates.find((r: any) => r.id === v.metalType);
            const rateVal = metalRate ? metalRate.pricePerGramINR : 0;
            const finalPrice = calculateVariantPrice({
              metalWeight: v.metalWeight,
              pricePerGram: rateVal,
              gemstoneCost: v.gemstoneCost,
              markup: v.markup
            });
            return { ...v, finalPrice };
          });
        return { ...p, variants };
      });
    }

    return dbProducts.map((p: any) => {
      const variants = p.variants.map((v: any) => {
        const metalRate = rates.find((r: any) => r.id === v.metalType);
        const rateVal = metalRate ? metalRate.pricePerGramINR : 0;
        const finalPrice = calculateVariantPrice({
          metalWeight: v.metalWeight,
          pricePerGram: rateVal,
          gemstoneCost: v.gemstoneCost,
          markup: v.markup
        });
        return { ...v, finalPrice };
      });
      return { ...p, variants };
    });
  },

  async createProduct(data: { name: string; description: string; baseSKU: string; category: string }) {
    if (await isDbAvailable()) {
      try {
        return await prisma.product.create({ data });
      } catch (e) {}
    }
    const newProduct = {
      id: `prod-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  async createVariant(data: {
    productId: string;
    metalType: string;
    metalWeight: number;
    gemstoneCarat?: number;
    gemstoneCut?: string;
    gemstoneClarity?: string;
    gemstoneCost: number;
    size?: string;
    markup: number;
    stock: number;
  }) {
    const productsList = await this.getProducts();
    const product = productsList.find(p => p.id === data.productId);
    if (!product) throw new Error('Product not found');

    const sku = generateVariantSKU(product.baseSKU, data.metalType, data.metalWeight, data.size);

    if (await isDbAvailable()) {
      try {
        return await prisma.productVariant.create({
          data: {
            ...data,
            sku,
            gemstoneCost: new Prisma.Decimal(data.gemstoneCost),
            markup: new Prisma.Decimal(data.markup),
          }
        });
      } catch (e) {}
    }

    const newVariant = {
      id: `var-${Math.random().toString(36).substr(2, 9)}`,
      sku,
      ...data,
      gemstoneCarat: data.gemstoneCarat || null,
      gemstoneCut: data.gemstoneCut || null,
      gemstoneClarity: data.gemstoneClarity || null,
      size: data.size || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockVariants.push(newVariant);
    return newVariant;
  },

  async getOrders() {
    if (await isDbAvailable()) {
      try {
        return await prisma.order.findMany({
          include: {
            items: {
              include: {
                variant: {
                  include: { product: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {}
    }
    return mockOrders;
  },

  async updateOrderStatus(orderId: string, status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED', trackingNumber?: string) {
    if (await isDbAvailable()) {
      try {
        return await prisma.order.update({
          where: { id: orderId },
          data: {
            status,
            trackingNumber: trackingNumber || undefined
          }
        });
      } catch (e) {}
    }

    mockOrders = mockOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          trackingNumber: trackingNumber || o.trackingNumber,
          updatedAt: new Date()
        };
      }
      return o;
    });

    return mockOrders.find(o => o.id === orderId);
  },

  async getDashboardStats() {
    const orders = await this.getOrders();
    const productsList = await this.getProducts();

    // Total Revenue (SHIPPED & DELIVERED & PENDING for totals)
    const revenue = orders
      .filter((o: any) => o.status !== 'CANCELLED')
      .reduce((sum: number, o: any) => sum + Number(o.totalPrice.toString()), 0);

    const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;

    // Low stock variants (less than 5 units in stock)
    let lowStockCount = 0;
    productsList.forEach((p: any) => {
      p.variants.forEach((v: any) => {
        if (v.stock < 5) lowStockCount++;
      });
    });

    return {
      totalRevenue: Math.round(revenue),
      pendingOrders,
      lowStockAlerts: lowStockCount
    };
  },

  async verifyAdminCredentials(email: string, password: string) {
    const hash = hashPassword(password);
    
    if (await isDbAvailable()) {
      try {
        const admin = await prisma.adminUser.findUnique({
          where: { email }
        });
        if (admin && admin.passwordHash === hash) {
          return { id: admin.id, email: admin.email, role: admin.role };
        }
        return null;
      } catch (e) {}
    }
    
    const admin = mockAdmins.find((a: any) => a.email.toLowerCase() === email.toLowerCase());
    if (admin && admin.passwordHash === hash) {
      return { id: admin.id, email: admin.email, role: admin.role };
    }
    return null;
  },

  async createOrder(data: {
    buyerName: string;
    buyerEmail: string;
    shippingAddress: string;
    engravingText?: string | null;
    totalPrice: number;
    items: { variantId: string; quantity: number; pricePaid: number }[];
  }) {
    const orderNumber = `NOV-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `order-${Math.random().toString(36).substring(2, 11)}`;
    
    if (await isDbAvailable()) {
      try {
        return await prisma.order.create({
          data: {
            id: orderId,
            orderNumber,
            buyerName: data.buyerName,
            buyerEmail: data.buyerEmail,
            shippingAddress: data.shippingAddress,
            engravingText: data.engravingText || null,
            totalPrice: new Prisma.Decimal(data.totalPrice),
            status: 'PENDING',
            items: {
              create: data.items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
                pricePaid: new Prisma.Decimal(item.pricePaid)
              }))
            }
          },
          include: {
            items: {
              include: {
                variant: {
                  include: { product: true }
                }
              }
            }
          }
        });
      } catch (e) {}
    }
    
    const productsList = await this.getProducts();
    const allVariants: any[] = [];
    productsList.forEach((p: any) => {
      p.variants.forEach((v: any) => {
        allVariants.push({
          ...v,
          productName: p.name
        });
      });
    });

    const newOrderItems = data.items.map((item, idx) => {
      const variantMatch = allVariants.find(v => v.id === item.variantId);
      return {
        id: `item-${orderId}-${idx}`,
        variantId: item.variantId,
        quantity: item.quantity,
        pricePaid: item.pricePaid,
        variant: {
          sku: variantMatch ? variantMatch.sku : 'UNKNOWN-SKU',
          product: {
            name: variantMatch ? variantMatch.productName : 'Unknown Jewelry Item'
          }
        }
      };
    });

    const newOrder = {
      id: orderId,
      orderNumber,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      shippingAddress: data.shippingAddress,
      engravingText: data.engravingText || null,
      totalPrice: data.totalPrice,
      status: 'PENDING',
      trackingNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: newOrderItems
    };

    mockOrders.push(newOrder);
    return newOrder;
  }
};
