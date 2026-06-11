import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, shopCategories } from '../data';
import { ProductCard } from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { ChevronDown, X, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Product } from '../types';

// Helper to derive luxury attributes dynamically for the products
function getProductAttributes(product: any, index: number) {
  // Color derivation
  let color = "Silver";
  if (index % 3 === 1) color = "Rose Gold";
  else if (index % 3 === 2) color = "Yellow Gold";

  // Shop For derivation
  let shopFor = "Women";
  if ((product.category === 'chains' || product.category === 'bracelets') && index % 3 === 0) {
    shopFor = "Men";
  } else if (index % 5 === 4) {
    shopFor = "Kids";
  } else if (index % 7 === 0) {
    shopFor = "Unisex";
  }

  // Metal derivation
  let metal = "925 Sterling Silver";
  if (color === "Rose Gold") metal = "Rhodium Plated";
  else if (color === "Yellow Gold") metal = "Yellow Gold Plated";

  // Stone derivation
  let stone = "No Stone";
  if ((product.category === 'pendants' || product.category === 'earrings') && index % 2 === 0) {
    stone = "Cubic Zirconia";
  } else if (index % 5 === 2) {
    stone = "Pearl";
  } else if (index % 5 === 3) {
    stone = "Crystal";
  }

  // Style derivation
  let style = "Modern";
  if (product.name.includes("Classic")) style = "Classic";
  else if (product.name.includes("Dainty") || product.name.includes("Minimalist")) style = "Minimalist";
  else if (product.name.includes("Vintage")) style = "Vintage";
  else if (product.name.includes("Elegant") || product.name.includes("Luxury") || product.name.includes("Royal")) style = "Classic";

  // Sub Category derivation
  let subCategory = "Daily Wear";
  if (index % 4 === 1) subCategory = "Party Wear";
  else if (index % 4 === 2) subCategory = "Office Wear";
  else if (index % 4 === 3) subCategory = "Festive";

  return { color, shopFor, metal, stone, style, subCategory };
}

export function Shop() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Open dropdown state
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  
  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter selections
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedShopFor, setSelectedShopFor] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  
  // Sort selection
  const [sortBy, setSortBy] = useState<string>("best-selling");

  // Reset category filters when URL category parameter changes
  useEffect(() => {
    setOpenFilter(null);
    clearAllFilters();
  }, [id]);

  const clearAllFilters = () => {
    setSelectedProductTypes([]);
    setSelectedPriceRanges([]);
    setSelectedShopFor([]);
    setSelectedColors([]);
    setSelectedMetals([]);
    setSelectedStones([]);
    setSelectedStyles([]);
    setSelectedSubCategories([]);
  };

  // 1. Process all products with derived attributes
  const computedProducts = products.map((p, idx) => ({
    ...p,
    attributes: getProductAttributes(p, idx)
  }));

  // 2. Base list depends on the active URL category
  const baseProducts = id ? computedProducts.filter(p => p.category === id) : computedProducts;

  // 3. Compute Counts dynamically for checkboxes based on the active category products
  const productTypeOptions = [
    { label: 'Chains', value: 'chains', count: baseProducts.filter(p => p.category === 'chains').length },
    { label: 'Earrings', value: 'earrings', count: baseProducts.filter(p => p.category === 'earrings').length },
    { label: 'Bracelets', value: 'bracelets', count: baseProducts.filter(p => p.category === 'bracelets').length },
    { label: 'Bangles', value: 'bangles', count: baseProducts.filter(p => p.category === 'bangles').length },
    { label: 'Pendants', value: 'pendants', count: baseProducts.filter(p => p.category === 'pendants').length },
    { label: 'Sets', value: 'sets', count: baseProducts.filter(p => p.category === 'sets').length },
    { label: 'Astro Jewellery', value: 'astro', count: baseProducts.filter(p => p.category === 'astro').length }
  ];

  const priceRangeOptions = [
    { label: 'Under Rs. 1500', value: 'under-1500', count: baseProducts.filter(p => p.price < 1500).length },
    { label: 'Rs. 1500 - Rs. 3000', value: '1500-3000', count: baseProducts.filter(p => p.price >= 1500 && p.price < 3000).length },
    { label: 'Rs. 3000 - Rs. 5000', value: '3000-5000', count: baseProducts.filter(p => p.price >= 3000 && p.price < 5000).length },
    { label: 'Over Rs. 5000', value: 'over-5000', count: baseProducts.filter(p => p.price >= 5000).length }
  ];

  const shopForOptions = [
    { label: 'Women', value: 'Women', count: baseProducts.filter(p => p.attributes.shopFor === 'Women').length },
    { label: 'Men', value: 'Men', count: baseProducts.filter(p => p.attributes.shopFor === 'Men').length },
    { label: 'Unisex', value: 'Unisex', count: baseProducts.filter(p => p.attributes.shopFor === 'Unisex').length },
    { label: 'Kids', value: 'Kids', count: baseProducts.filter(p => p.attributes.shopFor === 'Kids').length }
  ];

  const colorOptions = [
    { label: 'Silver', value: 'Silver', count: baseProducts.filter(p => p.attributes.color === 'Silver').length },
    { label: 'Rose Gold', value: 'Rose Gold', count: baseProducts.filter(p => p.attributes.color === 'Rose Gold').length },
    { label: 'Yellow Gold', value: 'Yellow Gold', count: baseProducts.filter(p => p.attributes.color === 'Yellow Gold').length }
  ];

  const metalOptions = [
    { label: '925 Sterling Silver', value: '925 Sterling Silver', count: baseProducts.filter(p => p.attributes.metal === '925 Sterling Silver').length },
    { label: 'Rhodium Plated', value: 'Rhodium Plated', count: baseProducts.filter(p => p.attributes.metal === 'Rhodium Plated').length },
    { label: 'Yellow Gold Plated', value: 'Yellow Gold Plated', count: baseProducts.filter(p => p.attributes.metal === 'Yellow Gold Plated').length }
  ];

  const stoneOptions = [
    { label: 'No Stone', value: 'No Stone', count: baseProducts.filter(p => p.attributes.stone === 'No Stone').length },
    { label: 'Cubic Zirconia', value: 'Cubic Zirconia', count: baseProducts.filter(p => p.attributes.stone === 'Cubic Zirconia').length },
    { label: 'Pearl', value: 'Pearl', count: baseProducts.filter(p => p.attributes.stone === 'Pearl').length },
    { label: 'Crystal', value: 'Crystal', count: baseProducts.filter(p => p.attributes.stone === 'Crystal').length }
  ];

  const styleOptions = [
    { label: 'Classic', value: 'Classic', count: baseProducts.filter(p => p.attributes.style === 'Classic').length },
    { label: 'Modern', value: 'Modern', count: baseProducts.filter(p => p.attributes.style === 'Modern').length },
    { label: 'Vintage', value: 'Vintage', count: baseProducts.filter(p => p.attributes.style === 'Vintage').length },
    { label: 'Minimalist', value: 'Minimalist', count: baseProducts.filter(p => p.attributes.style === 'Minimalist').length }
  ];

  const subCategoryOptions = [
    { label: 'Daily Wear', value: 'Daily Wear', count: baseProducts.filter(p => p.attributes.subCategory === 'Daily Wear').length },
    { label: 'Party Wear', value: 'Party Wear', count: baseProducts.filter(p => p.attributes.subCategory === 'Party Wear').length },
    { label: 'Office Wear', value: 'Office Wear', count: baseProducts.filter(p => p.attributes.subCategory === 'Office Wear').length },
    { label: 'Festive', value: 'Festive', count: baseProducts.filter(p => p.attributes.subCategory === 'Festive').length }
  ];

  // 4. Apply filter selections
  let filtered = baseProducts;

  if (selectedProductTypes.length > 0) {
    filtered = filtered.filter(p => selectedProductTypes.includes(p.category || ''));
  }

  if (selectedPriceRanges.length > 0) {
    filtered = filtered.filter(p => {
      return selectedPriceRanges.some(range => {
        if (range === 'under-1500') return p.price < 1500;
        if (range === '1500-3000') return p.price >= 1500 && p.price < 3000;
        if (range === '3000-5000') return p.price >= 3000 && p.price < 5000;
        if (range === 'over-5000') return p.price >= 5000;
        return false;
      });
    });
  }

  if (selectedShopFor.length > 0) {
    filtered = filtered.filter(p => selectedShopFor.includes(p.attributes.shopFor));
  }

  if (selectedColors.length > 0) {
    filtered = filtered.filter(p => selectedColors.includes(p.attributes.color));
  }

  if (selectedMetals.length > 0) {
    filtered = filtered.filter(p => selectedMetals.includes(p.attributes.metal));
  }

  if (selectedStones.length > 0) {
    filtered = filtered.filter(p => selectedStones.includes(p.attributes.stone));
  }

  if (selectedStyles.length > 0) {
    filtered = filtered.filter(p => selectedStyles.includes(p.attributes.style));
  }

  if (selectedSubCategories.length > 0) {
    filtered = filtered.filter(p => selectedSubCategories.includes(p.attributes.subCategory));
  }

  // 5. Apply sorting
  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "new-arrivals") {
    filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
  } else if (sortBy === "rating") {
    filtered = [...filtered].sort((a, b) => {
      const idxA = products.findIndex(p => p.id === a.id);
      const idxB = products.findIndex(p => p.id === b.id);
      return (idxB % 3) - (idxA % 3);
    });
  }

  const activeCategory = shopCategories.find(c => c.id === id);

  // Helper toggle selections
  const toggleSelection = (value: string, currentSelected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentSelected.includes(value)) {
      setSelected(currentSelected.filter(v => v !== value));
    } else {
      setSelected([...currentSelected, value]);
    }
  };

  // Helper for open filter toggle
  const toggleFilterDropdown = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  // Check if any filter is active
  const hasActiveFilters = 
    selectedProductTypes.length > 0 || 
    selectedPriceRanges.length > 0 || 
    selectedShopFor.length > 0 || 
    selectedColors.length > 0 || 
    selectedMetals.length > 0 || 
    selectedStones.length > 0 || 
    selectedStyles.length > 0 || 
    selectedSubCategories.length > 0;

  // Active filter helper list for tags
  const getActiveFilterTags = () => {
    const tags: { type: string; label: string; value: string; clearFn: () => void }[] = [];
    
    selectedProductTypes.forEach(val => {
      const opt = productTypeOptions.find(o => o.value === val);
      tags.push({ type: 'Product type', label: opt ? opt.label : val, value: val, clearFn: () => setSelectedProductTypes(prev => prev.filter(v => v !== val)) });
    });
    selectedPriceRanges.forEach(val => {
      const opt = priceRangeOptions.find(o => o.value === val);
      tags.push({ type: 'Price', label: opt ? opt.label : val, value: val, clearFn: () => setSelectedPriceRanges(prev => prev.filter(v => v !== val)) });
    });
    selectedShopFor.forEach(val => {
      tags.push({ type: 'Shop For', label: val, value: val, clearFn: () => setSelectedShopFor(prev => prev.filter(v => v !== val)) });
    });
    selectedColors.forEach(val => {
      tags.push({ type: 'Color', label: val, value: val, clearFn: () => setSelectedColors(prev => prev.filter(v => v !== val)) });
    });
    selectedMetals.forEach(val => {
      tags.push({ type: 'Metal', label: val, value: val, clearFn: () => setSelectedMetals(prev => prev.filter(v => v !== val)) });
    });
    selectedStones.forEach(val => {
      tags.push({ type: 'Stone', label: val, value: val, clearFn: () => setSelectedStones(prev => prev.filter(v => v !== val)) });
    });
    selectedStyles.forEach(val => {
      tags.push({ type: 'Style', label: val, value: val, clearFn: () => setSelectedStyles(prev => prev.filter(v => v !== val)) });
    });
    selectedSubCategories.forEach(val => {
      tags.push({ type: 'Sub Category', label: val, value: val, clearFn: () => setSelectedSubCategories(prev => prev.filter(v => v !== val)) });
    });
    
    return tags;
  };

  const activeFilterTags = getActiveFilterTags();

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white">
      
      {/* Page Header Banner */}
      <div className="relative w-full h-[220px] md:h-[280px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 flex flex-col justify-center">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">NOVA COLLECTION</span>
          <h1 className="text-3xl md:text-5xl font-serif tracking-wider mb-3">
            {activeCategory ? activeCategory.name : "Luxury Shop"}
          </h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light leading-relaxed">
            {activeCategory 
              ? `Browse our exclusive range of certified 925 sterling silver ${activeCategory.name.toLowerCase()} crafted to elevate your style.` 
              : "Discover hand-finished 925 sterling silver jewellery, from classic pendants to elegant bracelets."}
          </p>
        </div>
      </div>
      
      {/* Category Pills Navigation */}
      <div className="bg-nova-dark border-b border-white/5 py-4 overflow-x-auto hide-scrollbar">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl flex items-center justify-start md:justify-center space-x-3 whitespace-nowrap">
          <Link 
            to="/shop" 
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${
              !id 
                ? 'bg-nova-gold text-nova-darker font-bold shadow-md shadow-nova-gold/20' 
                : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            All Products
          </Link>
          {shopCategories.map(cat => (
            <Link 
              key={cat.id}
              to={`/category/${cat.id}`} 
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${
                id === cat.id 
                  ? 'bg-nova-gold text-nova-darker font-bold shadow-md shadow-nova-gold/20' 
                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 max-w-7xl flex-1">
        
        {/* Horizontal Dropdowns Filters & Sorting Row */}
        <div className="relative border-b border-white/10 pb-6 mb-8 flex flex-col gap-4">
          
          {/* 1. Desktop Filters (md and above) */}
          <div className="hidden md:flex flex-wrap items-center justify-between gap-4 text-xs font-light">
            
            {/* Click-away overlay when a dropdown is open */}
            {openFilter && (
              <div 
                className="fixed inset-0 z-20 bg-transparent" 
                onClick={() => setOpenFilter(null)}
              ></div>
            )}

            {/* Horizontal Filter Options */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 relative z-30">
              
              {/* 1. Product Type */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('type')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'type' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedProductTypes.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Product type</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'type' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'type' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {productTypeOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedProductTypes.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedProductTypes, setSelectedProductTypes)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Price */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('price')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'price' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedPriceRanges.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Price</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'price' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'price' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {priceRangeOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedPriceRanges.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedPriceRanges, setSelectedPriceRanges)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Shop For */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('shopfor')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'shopfor' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedShopFor.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Shop For</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'shopfor' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'shopfor' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {shopForOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedShopFor.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedShopFor, setSelectedShopFor)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Color */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('color')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'color' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedColors.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Color</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'color' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'color' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {colorOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedColors.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedColors, setSelectedColors)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Metal */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('metal')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'metal' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedMetals.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Metal</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'metal' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'metal' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {metalOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedMetals.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedMetals, setSelectedMetals)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Stone */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('stone')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'stone' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedStones.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Stone</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'stone' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'stone' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {stoneOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedStones.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedStones, setSelectedStones)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Style */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('style')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'style' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedStyles.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Style</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'style' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'style' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {styleOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedStyles.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedStyles, setSelectedStyles)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Sub Category */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('subcat')}
                  className={`flex items-center gap-1.5 px-4 py-3 hover:text-nova-gold transition-colors tracking-wide ${
                    openFilter === 'subcat' ? 'text-nova-gold border-b-2 border-nova-gold' : 'text-white/80'
                  } ${selectedSubCategories.length > 0 ? 'font-medium text-nova-gold' : ''}`}
                >
                  <span>Sub Category</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === 'subcat' ? 'rotate-180' : ''}`} />
                </button>
                {openFilter === 'subcat' && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f121d] border border-white/10 rounded-xl p-4 shadow-2xl z-30 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2.5">
                      {subCategoryOptions.map(opt => (
                        <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedSubCategories.includes(opt.value)} 
                              onChange={() => toggleSelection(opt.value, selectedSubCategories, setSelectedSubCategories)}
                              className="accent-nova-gold w-4 h-4 rounded border-white/10" 
                            />
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] text-white/30">({opt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right: Sort by Dropdown */}
            <div className="relative z-30 flex items-center gap-2">
              <span className="text-white/40 font-light">Sort by:</span>
              <button 
                onClick={() => toggleFilterDropdown('sort')}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#181c2b] border border-white/10 hover:border-nova-gold/40 rounded-lg text-white/95 transition-colors cursor-pointer"
              >
                <span>{
                  sortBy === "best-selling" ? "Best selling" :
                  sortBy === "price-low" ? "Price: Low to High" :
                  sortBy === "price-high" ? "Price: High to Low" : "New Arrivals"
                }</span>
                <ChevronDown className={`w-3.5 h-3.5 text-nova-gold transition-transform ${openFilter === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === 'sort' && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f121d] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden text-xs">
                  <button 
                    onClick={() => { setSortBy("best-selling"); setOpenFilter(null); }}
                    className={`w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors ${sortBy === 'best-selling' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                  >
                    Best selling
                  </button>
                  <button 
                    onClick={() => { setSortBy("price-low"); setOpenFilter(null); }}
                    className={`w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors ${sortBy === 'price-low' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                  >
                    Price: Low to High
                  </button>
                  <button 
                    onClick={() => { setSortBy("price-high"); setOpenFilter(null); }}
                    className={`w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors ${sortBy === 'price-high' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                  >
                    Price: High to Low
                  </button>
                  <button 
                    onClick={() => { setSortBy("new-arrivals"); setOpenFilter(null); }}
                    className={`w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors ${sortBy === 'new-arrivals' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                  >
                    New Arrivals
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* 2. Mobile Filters Bar (sm and max-md) */}
          <div className="flex md:hidden items-center justify-between gap-3 text-xs w-full relative z-30">
            
            {/* Click-away overlay when a dropdown is open */}
            {openFilter === 'sort-mobile' && (
              <div 
                className="fixed inset-0 z-20 bg-transparent" 
                onClick={() => setOpenFilter(null)}
              ></div>
            )}

            {/* Mobile Sort Dropdown Toggle */}
            <button 
              onClick={() => toggleFilterDropdown('sort-mobile')}
              className="flex-1 flex items-center justify-between gap-1.5 px-4 py-2.5 bg-[#181c2b] border border-white/10 rounded-xl text-white/90 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="truncate">Sort: {
                sortBy === "best-selling" ? "Best selling" :
                sortBy === "price-low" ? "Low to High" :
                sortBy === "price-high" ? "High to Low" : "New Arrivals"
              }</span>
              <ChevronDown className={`w-3.5 h-3.5 text-nova-gold shrink-0 transition-transform ${openFilter === 'sort-mobile' ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#181c2b] border border-white/10 hover:border-nova-gold/30 rounded-xl text-white transition-all active:scale-[0.98] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-nova-gold shrink-0" />
              <span className="font-medium">Filter {activeFilterTags.length > 0 ? `(${activeFilterTags.length})` : ''}</span>
            </button>

            {/* Mobile Sort Dropdown Menu */}
            {openFilter === 'sort-mobile' && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0f121d] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden text-xs animate-fade-in">
                <button 
                  onClick={() => { setSortBy("best-selling"); setOpenFilter(null); }}
                  className={`w-full text-left py-3 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors border-b border-white/5 last:border-b-0 ${sortBy === 'best-selling' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                >
                  Best selling
                </button>
                <button 
                  onClick={() => { setSortBy("price-low"); setOpenFilter(null); }}
                  className={`w-full text-left py-3 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors border-b border-white/5 last:border-b-0 ${sortBy === 'price-low' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                >
                  Price: Low to High
                </button>
                <button 
                  onClick={() => { setSortBy("price-high"); setOpenFilter(null); }}
                  className={`w-full text-left py-3 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors border-b border-white/5 last:border-b-0 ${sortBy === 'price-high' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                >
                  Price: High to Low
                </button>
                <button 
                  onClick={() => { setSortBy("new-arrivals"); setOpenFilter(null); }}
                  className={`w-full text-left py-3 px-4 hover:bg-nova-gold hover:text-nova-darker transition-colors border-b border-white/5 last:border-b-0 ${sortBy === 'new-arrivals' ? 'text-nova-gold font-medium' : 'text-white/70'}`}
                >
                  New Arrivals
                </button>
              </div>
            )}
          </div>

          {/* Active Filter Tags Row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5 animate-fade-in text-xs">
              <span className="text-white/40 font-light uppercase tracking-wider text-[10px]">Active Filters:</span>
              {activeFilterTags.map(tag => (
                <div 
                  key={`${tag.type}-${tag.value}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-nova-gold/10 hover:bg-nova-gold/20 border border-nova-gold/30 rounded-full text-nova-gold transition-colors"
                >
                  <span className="font-light text-[10px] text-white/50">{tag.type}:</span>
                  <span className="font-medium">{tag.label}</span>
                  <button 
                    onClick={tag.clearFn}
                    className="p-0.5 hover:bg-white/10 rounded-full text-nova-gold/75 hover:text-nova-gold transition-colors cursor-pointer"
                    title="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button 
                onClick={clearAllFilters}
                className="text-[10px] uppercase tracking-wider text-nova-gold hover:text-white font-semibold ml-2 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-dark rounded-2xl border border-white/5">
            <span className="text-4xl block mb-4">✨</span>
            <h3 className="font-serif text-xl mb-2">No Products Found</h3>
            <p className="text-white/50 text-sm font-light">Try adjusting your filters or category selections.</p>
          </div>
        )}

      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>
          
          {/* Drawer Body */}
          <div className="relative w-full max-w-md h-full bg-[#0b0e17] border-l border-white/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4.5 h-4.5 text-nova-gold" />
                <h2 className="font-serif text-lg tracking-wide text-white">Filters</h2>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrolling Filters Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              
              {/* Accordions for each filter option */}
              <MobileFilterAccordion title="Product Type" count={selectedProductTypes.length}>
                <div className="space-y-2.5 pt-2">
                  {productTypeOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedProductTypes.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedProductTypes, setSelectedProductTypes)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

              <MobileFilterAccordion title="Price" count={selectedPriceRanges.length}>
                <div className="space-y-2.5 pt-2">
                  {priceRangeOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedPriceRanges.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedPriceRanges, setSelectedPriceRanges)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

              <MobileFilterAccordion title="Shop For" count={selectedShopFor.length}>
                <div className="space-y-2.5 pt-2">
                  {shopForOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedShopFor.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedShopFor, setSelectedShopFor)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

              <MobileFilterAccordion title="Color" count={selectedColors.length}>
                <div className="space-y-2.5 pt-2">
                  {colorOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedColors.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedColors, setSelectedColors)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

              <MobileFilterAccordion title="Metal" count={selectedMetals.length}>
                <div className="space-y-2.5 pt-2">
                  {metalOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedMetals.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedMetals, setSelectedMetals)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

              <MobileFilterAccordion title="Stone" count={selectedStones.length}>
                <div className="space-y-2.5 pt-2">
                  {stoneOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedStones.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedStones, setSelectedStones)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

              <MobileFilterAccordion title="Style" count={selectedStyles.length}>
                <div className="space-y-2.5 pt-2">
                  {styleOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedStyles.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedStyles, setSelectedStyles)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

              <MobileFilterAccordion title="Sub Category" count={selectedSubCategories.length}>
                <div className="space-y-2.5 pt-2">
                  {subCategoryOptions.map(opt => (
                    <label key={opt.value} className="flex items-center justify-between text-white/70 hover:text-white cursor-pointer select-none py-1 text-xs">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedSubCategories.includes(opt.value)} 
                          onChange={() => toggleSelection(opt.value, selectedSubCategories, setSelectedSubCategories)}
                          className="accent-nova-gold w-4.5 h-4.5 rounded border-white/10" 
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-white/30">({opt.count})</span>
                    </label>
                  ))}
                </div>
              </MobileFilterAccordion>

            </div>

            {/* Footer with actions */}
            <div className="px-6 py-5 border-t border-white/10 bg-[#0f121d] flex items-center gap-3">
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="flex-1 py-3 border border-white/10 hover:border-nova-gold hover:text-nova-gold rounded-xl text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-[2] py-3 bg-nova-gold hover:bg-nova-gold-light text-nova-darker rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Show {filtered.length} Results</span>
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

// Helper accordion for mobile filter categories
interface MobileFilterAccordionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

function MobileFilterAccordion({ title, count, children }: MobileFilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 pb-3 last:border-b-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left font-serif text-white hover:text-nova-gold transition-colors text-sm font-medium cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {count > 0 && (
            <span className="px-2 py-0.5 bg-nova-gold/10 text-nova-gold rounded-full text-[9px] font-bold border border-nova-gold/20">
              {count}
            </span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-nova-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="animate-fade-in pl-1">
          {children}
        </div>
      )}
    </div>
  );
}
