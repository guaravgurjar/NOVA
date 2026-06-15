"use client";

import React, { useEffect, useState, useTransition } from "react";
import { 
  getProductsAction, 
  createProductAction, 
  createVariantAction 
} from "@/app/actions";
import { 
  Plus, 
  Sparkles, 
  Layers, 
  Scale, 
  Gem, 
  ChevronsUpDown, 
  ChevronDown, 
  ChevronUp, 
  FolderPlus,
  Coins
} from "lucide-react";
import { generateVariantSKU } from "@/lib/pricing";

interface ProductVariant {
  id: string;
  sku: string;
  metalType: string;
  metalWeight: number;
  gemstoneCarat: number | null;
  gemstoneCut: string | null;
  gemstoneClarity: string | null;
  gemstoneCost: number;
  size: string | null;
  markup: number;
  stock: number;
  finalPrice: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  baseSKU: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
}

interface MetalRate {
  id: string;
  metalName: string;
  pricePerGramUSD: number;
  pricePerGramINR: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rates, setRates] = useState<MetalRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  // Forms states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodSKU, setProdSKU] = useState("");
  const [prodCategory, setProdCategory] = useState("rings");
  const [prodImages, setProdImages] = useState("");

  const [varProdId, setVarProdId] = useState("");
  const [varMetalType, setVarMetalType] = useState("GOLD_18K");
  const [varWeight, setVarWeight] = useState(4.2);
  const [varGemCarat, setVarGemCarat] = useState(0);
  const [varGemCut, setVarGemCut] = useState("");
  const [varGemClarity, setVarGemClarity] = useState("");
  const [varGemCost, setVarGemCost] = useState(0);
  const [varSize, setVarSize] = useState("");
  const [varMarkup, setVarMarkup] = useState(0);
  const [varStock, setVarStock] = useState(10);

  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    const res = await getProductsAction();
    if (res.success && res.products) {
      setProducts(res.products);
      setRates(res.rates || []);
      if (res.products.length > 0 && !varProdId) {
        setVarProdId(res.products[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSKU) return;

    const imagesArray = prodImages
      ? prodImages.split(",").map(url => url.trim()).filter(Boolean)
      : [];

    startTransition(async () => {
      const res = await createProductAction({
        name: prodName,
        description: prodDesc,
        baseSKU: prodSKU,
        category: prodCategory,
        images: imagesArray
      });

      if (res.success && res.product) {
        setStatusMsg({ type: "success", text: `Base product "${prodName}" created successfully!` });
        setProdName("");
        setProdDesc("");
        setProdSKU("");
        setProdImages("");
        setShowProductForm(false);
        loadData();
      } else {
        setStatusMsg({ type: "error", text: res.error || "Failed to create product." });
      }
    });
  };

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!varProdId) return;

    startTransition(async () => {
      const res = await createVariantAction({
        productId: varProdId,
        metalType: varMetalType,
        metalWeight: Number(varWeight),
        gemstoneCarat: varGemCarat > 0 ? Number(varGemCarat) : undefined,
        gemstoneCut: varGemCut || undefined,
        gemstoneClarity: varGemClarity || undefined,
        gemstoneCost: Number(varGemCost),
        size: varSize || undefined,
        markup: Number(varMarkup),
        stock: Number(varStock)
      });

      if (res.success && res.variant) {
        setStatusMsg({ type: "success", text: `Product variant created successfully!` });
        setVarWeight(4.2);
        setVarGemCarat(0);
        setVarGemCut("");
        setVarGemClarity("");
        setVarGemCost(0);
        setVarSize("");
        setVarMarkup(0);
        setVarStock(10);
        setShowVariantForm(false);
        loadData();
      } else {
        setStatusMsg({ type: "error", text: res.error || "Failed to create variant." });
      }
    });
  };

  // Preview Price and SKU calculations
  const selectedProduct = products.find(p => p.id === varProdId);
  const selectedRate = rates.find(r => r.id === varMetalType);
  
  const previewSKU = selectedProduct 
    ? generateVariantSKU(selectedProduct.baseSKU, varMetalType, Number(varWeight), varSize || undefined)
    : "Select a base product";

  const previewPrice = Math.round(
    (Number(varWeight) * (selectedRate ? selectedRate.pricePerGramINR : 0)) + 
    Number(varGemCost) + 
    Number(varMarkup)
  );

  const toggleExpandProduct = (id: string) => {
    if (expandedProduct === id) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse-slow">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg"></div>
        <div className="h-10 w-full bg-zinc-800 rounded-lg"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl"></div>
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
            Product Catalog
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage jewelry designs, nested variants, dynamic weights, and prices.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              setShowProductForm(true);
              setShowVariantForm(false);
              setStatusMsg(null);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 transition-all text-sm font-medium focus:outline-none cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            Add Base Product
          </button>
          
          <button
            onClick={() => {
              setShowVariantForm(true);
              setShowProductForm(false);
              setStatusMsg(null);
              if (products.length > 0 && !varProdId) {
                setVarProdId(products[0].id);
              }
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-[#06080d] transition-all text-sm font-semibold focus:outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-lg border text-sm ${
          statusMsg.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-500" 
            : "bg-rose-500/10 border-rose-500/25 text-rose-500"
        }`}>
          {statusMsg.text}
        </div>
      )}

      {/* Product Form Drawer/Modal Container */}
      {showProductForm && (
        <div className="glass-panel p-6 rounded-xl border border-gold/20 space-y-6">
          <div className="flex justify-between items-center border-b border-gold/10 pb-4">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-gold" />
              Create Base Jewelry Design
            </h3>
            <button 
              onClick={() => setShowProductForm(false)}
              className="text-zinc-500 hover:text-foreground text-xs"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Design Name</label>
              <input 
                type="text" 
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g. Royal Solitaire Diamond Ring" 
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Base SKU (Unique Identifier)</label>
              <input 
                type="text" 
                value={prodSKU}
                onChange={(e) => setProdSKU(e.target.value)}
                placeholder="e.g. RG-SLT" 
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Description</label>
              <textarea 
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                placeholder="Describe the craftsmanship details..." 
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Product Image URLs (Comma-separated)</label>
              <input 
                type="text" 
                value={prodImages}
                onChange={(e) => setProdImages(e.target.value)}
                placeholder="e.g. https://example.com/image1.jpg, https://example.com/image2.jpg" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Category</label>
              <select 
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
              >
                <option value="rings">Rings</option>
                <option value="chains">Chains</option>
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="necklaces">Necklaces</option>
              </select>
            </div>

            <div className="flex items-end md:col-span-1">
              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-gold hover:bg-gold-light text-[#06080d] font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {isPending ? "Creating..." : "Save Base Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Variant Form Drawer/Modal Container */}
      {showVariantForm && (
        <div className="glass-panel p-6 rounded-xl border border-gold/20 space-y-6">
          <div className="flex justify-between items-center border-b border-gold/10 pb-4">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Configure Nested Jewelry Variant
            </h3>
            <button 
              onClick={() => setShowVariantForm(false)}
              className="text-zinc-500 hover:text-foreground text-xs"
            >
              Cancel
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-4 text-zinc-400">
              Please create a base product first.
            </div>
          ) : (
            <form onSubmit={handleCreateVariant} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Product Association */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Base Design Association</label>
                <select 
                  value={varProdId}
                  onChange={(e) => setVarProdId(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.baseSKU})</option>
                  ))}
                </select>
              </div>

              {/* Metal Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Metal Type</label>
                <select 
                  value={varMetalType}
                  onChange={(e) => setVarMetalType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                >
                  {rates.map(r => (
                    <option key={r.id} value={r.id}>{r.metalName}</option>
                  ))}
                </select>
              </div>

              {/* Metal Weight */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Metal Weight (Grams)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.05"
                    value={varWeight}
                    onChange={(e) => setVarWeight(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-zinc-500 font-mono font-semibold">g</span>
                </div>
              </div>

              {/* Gemstone Specifications */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Gemstone Carats</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={varGemCarat}
                  onChange={(e) => setVarGemCarat(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 1.0"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Gemstone Cut</label>
                <input 
                  type="text" 
                  value={varGemCut}
                  onChange={(e) => setVarGemCut(e.target.value)}
                  placeholder="e.g. Round Brilliant"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Gemstone Clarity</label>
                <input 
                  type="text" 
                  value={varGemClarity}
                  onChange={(e) => setVarGemClarity(e.target.value)}
                  placeholder="e.g. VS1"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>

              {/* Costs */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Gemstone Static Cost (INR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500 font-semibold">₹</span>
                  <input 
                    type="number" 
                    min="0"
                    value={varGemCost}
                    onChange={(e) => setVarGemCost(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Markup / Making Charges (INR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500 font-semibold">₹</span>
                  <input 
                    type="number" 
                    min="0"
                    value={varMarkup}
                    onChange={(e) => setVarMarkup(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Size</label>
                <input 
                  type="text" 
                  value={varSize}
                  onChange={(e) => setVarSize(e.target.value)}
                  placeholder="e.g. 7 or One Size"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Initial Stock</label>
                <input 
                  type="number" 
                  min="0"
                  value={varStock}
                  onChange={(e) => setVarStock(parseInt(e.target.value) || 0)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>

              {/* Live Preview Engine (Crucial Requirement) */}
              <div className="md:col-span-2 p-4 bg-gold/5 border border-gold/15 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Live Price Calculator Preview</span>
                  <div className="text-xl font-bold text-gold">
                    ₹{previewPrice.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed">
                    ({varWeight}g * ₹{selectedRate ? Math.round(selectedRate.pricePerGramINR) : 0}/g) + ₹{varGemCost} gem + ₹{varMarkup} markup
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Auto-Generated SKU Preview</span>
                  <div className="text-sm font-mono font-bold text-zinc-200 uppercase truncate">
                    {previewSKU}
                  </div>
                  <p className="text-[9px] text-zinc-500 mt-1">
                    Standard formatting formula applied.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gold hover:bg-gold-light text-[#06080d] font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {isPending ? "Configuring..." : "Add Nested Variant"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Products Catalog Accordion */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-gold" />
          Base Catalog Catalog ({products.length})
        </h3>

        {products.length === 0 ? (
          <div className="glass-panel p-8 text-center text-zinc-500 rounded-xl border border-gold/10">
            No products in your catalog yet. Click "Add Base Product" to begin.
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const isExpanded = expandedProduct === product.id;
              return (
                <div 
                  key={product.id} 
                  className={`glass-panel rounded-xl border border-gold/15 transition-all overflow-hidden ${
                    isExpanded ? "ring-1 ring-gold/30" : "hover:border-gold/25"
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <div 
                    onClick={() => toggleExpandProduct(product.id)}
                    className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-4">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-lg border border-gold/20 bg-zinc-900 shrink-0" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center shrink-0">
                          <Gem className="w-6 h-6 text-zinc-600" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="bg-zinc-800 border border-zinc-700 text-gold text-xs px-2.5 py-0.5 rounded font-mono uppercase tracking-wide">
                            {product.baseSKU}
                          </span>
                          <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                            {product.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground mt-1.5">{product.name}</h4>
                        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{product.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
                      <div className="text-right">
                        <span className="text-xs text-zinc-500 block">Nested Variants</span>
                        <span className="text-sm font-semibold text-zinc-200">{product.variants.length} options</span>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content (Nested Variants Table) */}
                  {isExpanded && (
                    <div className="border-t border-gold/10 bg-black/20 p-5 overflow-x-auto">
                      {product.variants.length === 0 ? (
                        <div className="text-center py-6 text-zinc-500 text-sm">
                          This base jewelry design has no configured metal/size variants yet.
                        </div>
                      ) : (
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-gold/10 text-zinc-500 uppercase font-mono">
                              <th className="pb-3 font-semibold">SKU</th>
                              <th className="pb-3 font-semibold">Metal Type</th>
                              <th className="pb-3 font-semibold text-right"><Scale className="w-3.5 h-3.5 inline mr-1" />Weight</th>
                              <th className="pb-3 font-semibold"><Gem className="w-3.5 h-3.5 inline mr-1" />Gem Spec</th>
                              <th className="pb-3 font-semibold text-right">Gem Cost</th>
                              <th className="pb-3 font-semibold text-right">Markup</th>
                              <th className="pb-3 font-semibold text-right">Size</th>
                              <th className="pb-3 font-semibold text-right">Stock</th>
                              <th className="pb-3 font-semibold text-right text-gold">Computed Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/40">
                            {product.variants.map((v) => (
                              <tr key={v.id} className="hover:bg-zinc-800/15 transition-colors">
                                <td className="py-3 font-mono font-medium text-gold">{v.sku}</td>
                                <td className="py-3 text-zinc-300 font-semibold">
                                  {v.metalType.replace("GOLD_", "").replace("SILVER", "Silver")}
                                </td>
                                <td className="py-3 text-right text-zinc-300">{v.metalWeight.toFixed(1)}g</td>
                                <td className="py-3 text-zinc-400">
                                  {v.gemstoneCarat ? `${v.gemstoneCarat}ct` : ""} {v.gemstoneCut || ""} {v.gemstoneClarity || ""}
                                  {!v.gemstoneCarat && !v.gemstoneCut && "None"}
                                </td>
                                <td className="py-3 text-right text-zinc-400">₹{(v.gemstoneCost || 0).toLocaleString("en-IN")}</td>
                                <td className="py-3 text-right text-zinc-400">₹{(v.markup || 0).toLocaleString("en-IN")}</td>
                                <td className="py-3 text-right text-zinc-300 font-semibold">{v.size || "OS"}</td>
                                <td className="py-3 text-right">
                                  <span className={`px-2 py-0.5 rounded font-mono font-medium ${
                                    v.stock < 5 
                                      ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                                      : "bg-zinc-800 text-zinc-400"
                                  }`}>
                                    {v.stock}
                                  </span>
                                </td>
                                <td className="py-3 text-right font-bold text-gold text-sm">
                                  ₹{v.finalPrice.toLocaleString("en-IN")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
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
