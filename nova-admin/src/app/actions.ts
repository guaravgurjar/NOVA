"use server";

import { dbService } from "@/lib/db-service";
import { cookies } from "next/headers";
import { signToken } from "@/lib/auth";

export async function getDashboardData() {
  try {
    const stats = await dbService.getDashboardStats();
    const rates = await dbService.getMetalRates();
    const orders = await dbService.getOrders();
    return { 
      success: true, 
      stats, 
      rates: rates.map((r: any) => ({
        id: r.id,
        metalName: r.metalName,
        pricePerGramUSD: Number(r.pricePerGramUSD.toString()),
        pricePerGramINR: Number(r.pricePerGramINR.toString())
      })), 
      recentOrders: orders.slice(0, 5).map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        buyerName: o.buyerName,
        totalPrice: Number(o.totalPrice.toString()),
        status: o.status,
        createdAt: o.createdAt.toISOString()
      }))
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function syncMetalRatesAction() {
  try {
    const exchangeRate = 83.5;
    const currentRates = await dbService.getMetalRates();
    
    // Simulate GoldAPI fluctuation (+/- 0.8%)
    const fluctuation = 1 + (Math.random() * 0.016 - 0.008);
    const updatedRates = currentRates.map((r: any) => {
      const usd = Number(r.pricePerGramUSD.toString()) * fluctuation;
      const inr = usd * exchangeRate;
      return {
        id: r.id,
        name: r.metalName,
        usd,
        inr
      };
    });
    
    await dbService.updateMetalRates(updatedRates);
    
    return { 
      success: true, 
      rates: updatedRates.map((r: any) => ({
        id: r.id,
        metalName: r.name,
        pricePerGramUSD: Number(r.usd.toFixed(2)),
        pricePerGramINR: Number(r.inr.toFixed(2))
      }))
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getProductsAction() {
  try {
    const products = await dbService.getProducts();
    const rates = await dbService.getMetalRates();
    return { 
      success: true, 
      products: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        baseSKU: p.baseSKU,
        category: p.category,
        variants: p.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          metalType: v.metalType,
          metalWeight: v.metalWeight,
          gemstoneCarat: v.gemstoneCarat,
          gemstoneCut: v.gemstoneCut,
          gemstoneClarity: v.gemstoneClarity,
          gemstoneCost: Number(v.gemstoneCost.toString()),
          size: v.size,
          markup: Number(v.markup.toString()),
          stock: v.stock,
          finalPrice: v.finalPrice
        }))
      })),
      rates: rates.map((r: any) => ({
        id: r.id,
        metalName: r.metalName,
        pricePerGramUSD: Number(r.pricePerGramUSD.toString()),
        pricePerGramINR: Number(r.pricePerGramINR.toString())
      }))
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createProductAction(data: { name: string; description: string; baseSKU: string; category: string }) {
  try {
    const newProduct = await dbService.createProduct(data);
    return { success: true, product: newProduct };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createVariantAction(data: {
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
  try {
    const newVariant = await dbService.createVariant(data);
    return { success: true, variant: newVariant };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getOrdersAction() {
  try {
    const orders = await dbService.getOrders();
    return { 
      success: true, 
      orders: orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        buyerName: o.buyerName,
        buyerEmail: o.buyerEmail,
        shippingAddress: o.shippingAddress,
        engravingText: o.engravingText,
        totalPrice: Number(o.totalPrice.toString()),
        status: o.status,
        trackingNumber: o.trackingNumber,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((item: any) => ({
          id: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          pricePaid: Number(item.pricePaid.toString()),
          sku: item.variant.sku,
          productName: item.variant.product.name
        }))
      }))
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateOrderStatusAction(
  orderId: string, 
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED", 
  trackingNumber?: string
) {
  try {
    const updatedOrder = await dbService.updateOrderStatus(orderId, status, trackingNumber);
    return { success: true, order: updatedOrder };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function loginAdminAction(email: string, password: string) {
  try {
    const admin = await dbService.verifyAdminCredentials(email, password);
    if (!admin) {
      return { success: false, error: "Invalid email or password." };
    }

    const token = await signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8 // 8 hours
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to log in." };
  }
}

export async function logoutAdminAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to log out." };
  }
}
