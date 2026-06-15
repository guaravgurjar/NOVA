"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getOrdersAction, updateOrderStatusAction } from "@/app/actions";
import { 
  Package, 
  MapPin, 
  Mail, 
  User, 
  MessageSquareQuote, 
  Truck, 
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck
} from "lucide-react";

interface OrderItem {
  id: string;
  variantId: string;
  quantity: number;
  pricePaid: number;
  sku: string;
  productName: string;
}

interface Order {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  shippingAddress: string;
  engravingText: string | null;
  totalPrice: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Tracking inputs local state (mapped by orderId)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ orderId: string; type: "success" | "error"; text: string } | null>(null);

  const loadOrders = async () => {
    const res = await getOrdersAction();
    if (res.success && res.orders) {
      // Typecast orders correctly
      setOrders(res.orders as Order[]);
      
      // Seed tracking inputs with existing tracking numbers
      const tracking: Record<string, string> = {};
      res.orders.forEach((o: any) => {
        tracking[o.id] = o.trackingNumber || "";
      });
      setTrackingInputs(tracking);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    startTransition(async () => {
      const currentTracking = trackingInputs[orderId] || undefined;
      const res = await updateOrderStatusAction(orderId, newStatus, currentTracking);
      
      if (res.success) {
        setStatusMsg({ 
          orderId, 
          type: "success", 
          text: `Status updated to ${newStatus} successfully.` 
        });
        loadOrders();
      } else {
        setStatusMsg({ 
          orderId, 
          type: "error", 
          text: res.error || "Failed to update status." 
        });
      }
    });
  };

  const handleSaveTracking = (orderId: string, e: React.FormEvent) => {
    e.preventDefault();
    const trackingNum = trackingInputs[orderId];
    if (!trackingNum) return;

    startTransition(async () => {
      // Saving tracking number auto-sets status to SHIPPED
      const res = await updateOrderStatusAction(orderId, "SHIPPED", trackingNum);
      
      if (res.success) {
        setStatusMsg({ 
          orderId, 
          type: "success", 
          text: `Tracking saved & order marked as SHIPPED.` 
        });
        loadOrders();
      } else {
        setStatusMsg({ 
          orderId, 
          type: "error", 
          text: res.error || "Failed to update tracking." 
        });
      }
    });
  };

  const handleTrackingInputChange = (orderId: string, val: string) => {
    setTrackingInputs(prev => ({
      ...prev,
      [orderId]: val
    }));
  };

  const toggleExpandOrder = (id: string) => {
    setExpandedOrder(prev => prev === id ? null : id);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse-slow">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg"></div>
        <div className="h-10 w-full bg-zinc-800 rounded-lg"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-zinc-900 border border-zinc-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-gold/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Order Fulfillment
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track customer checkouts, engraving requests, and shipping tracking numbers.
          </p>
        </div>
      </div>

      {/* Orders List Accordion */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-gold" />
          Fulfillment Orders ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <div className="glass-panel p-8 text-center text-zinc-500 rounded-xl border border-gold/10">
            No sales orders have been recorded in the system yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const hasEngraving = !!order.engravingText;
              
              return (
                <div 
                  key={order.id} 
                  className={`glass-panel rounded-xl border border-gold/15 transition-all overflow-hidden ${
                    isExpanded ? "ring-1 ring-gold/30 shadow-xl" : "hover:border-gold/25"
                  }`}
                >
                  {/* Order Accordion Header */}
                  <div 
                    onClick={() => toggleExpandOrder(order.id)}
                    className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-gold font-bold text-base">
                          {order.orderNumber}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === "PENDING"
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            : order.status === "SHIPPED"
                            ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            : order.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.status === "PENDING"
                              ? "bg-yellow-500"
                              : order.status === "SHIPPED"
                              ? "bg-blue-500"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-500"
                              : "bg-zinc-500"
                          }`} />
                          {order.status}
                        </span>

                        {hasEngraving && (
                          <span className="bg-purple-500/10 border border-purple-500/25 text-purple-400 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                            Engraving Requested
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          {order.buyerName}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-stretch md:self-auto justify-between border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-xs text-zinc-500 block uppercase tracking-wider font-mono">Total Paid</span>
                        <span className="text-lg font-bold text-foreground">₹{order.totalPrice.toLocaleString("en-IN")}</span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gold/10 bg-black/30 p-6 space-y-6">
                      
                      {statusMsg && statusMsg.orderId === order.id && (
                        <div className={`p-3.5 rounded-lg border text-xs ${
                          statusMsg.type === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-500" 
                            : "bg-rose-500/10 border-rose-500/25 text-rose-500"
                        }`}>
                          {statusMsg.text}
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Customer & Address details */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2">
                            Shipping & Contact Details
                          </h4>
                          
                          <div className="space-y-3 text-xs text-zinc-300">
                            <div className="flex items-start gap-2.5">
                              <User className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-semibold text-foreground">{order.buyerName}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2.5">
                              <Mail className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                              <span className="font-mono">{order.buyerEmail}</span>
                            </div>

                            <div className="flex items-start gap-2.5 leading-relaxed">
                              <MapPin className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                              <span>{order.shippingAddress}</span>
                            </div>
                          </div>
                        </div>

                        {/* Engravings & Items list */}
                        <div className="space-y-4 lg:col-span-2">
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2">
                            Ordered Items & Specifications
                          </h4>

                          {/* Engraving Alert Box */}
                          {hasEngraving && (
                            <div className="bg-purple-950/15 border border-purple-500/20 p-4 rounded-lg flex items-start gap-3">
                              <MessageSquareQuote className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block mb-0.5">
                                  Custom Engraving Request:
                                </span>
                                <p className="text-sm italic font-serif text-purple-200">
                                  "{order.engravingText}"
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-zinc-800 text-zinc-500 font-mono">
                                  <th className="pb-2">Product</th>
                                  <th className="pb-2">SKU Variant</th>
                                  <th className="pb-2 text-right">Quantity</th>
                                  <th className="pb-2 text-right">Unit Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item) => (
                                  <tr key={item.id} className="border-b border-zinc-900/50">
                                    <td className="py-3 text-zinc-200 font-medium">{item.productName}</td>
                                    <td className="py-3 font-mono text-gold">{item.sku}</td>
                                    <td className="py-3 text-right text-zinc-300 font-semibold">{item.quantity}</td>
                                    <td className="py-3 text-right text-zinc-200 font-mono font-semibold">
                                      ₹{item.pricePaid.toLocaleString("en-IN")}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Sourcing Actions / Shipping updates */}
                      <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        
                        {/* Status updating dropdown */}
                        <div className="space-y-2 max-w-xs w-full">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                            Update Order Stage Status
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={order.status}
                              disabled={isPending}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order["status"])}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-gold/50 cursor-pointer"
                            >
                              <option value="PENDING">Pending Sourcing</option>
                              <option value="SHIPPED">Shipped Out</option>
                              <option value="DELIVERED">Delivered to Buyer</option>
                              <option value="CANCELLED">Cancelled Order</option>
                            </select>
                          </div>
                        </div>

                        {/* Shipping Tracking Form */}
                        <form onSubmit={(e) => handleSaveTracking(order.id, e)} className="flex-1 max-w-md w-full space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                            Shipping Carrier & Tracking Number
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Truck className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
                              <input
                                type="text"
                                value={trackingInputs[order.id] || ""}
                                onChange={(e) => handleTrackingInputChange(order.id, e.target.value)}
                                placeholder="Enter carrier code or tracking number"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-gold/50"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isPending || !trackingInputs[order.id]}
                              className="bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-[#06080d] font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              Save Tracking
                            </button>
                          </div>
                        </form>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
