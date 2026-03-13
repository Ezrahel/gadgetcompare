import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, ShieldCheck, Smartphone, Cpu, Camera, Battery, HardDrive, Info, Plus, Check, Loader2, ChevronDown, X, Bell } from 'lucide-react';
import { PRODUCTS, DEALS } from '../constants';
import DealCard from '../components/DealCard';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useCompare } from '../context/CompareContext';
import { fetchProductById } from '../services/trendingService';
import { Product } from '../types';
import GadgetImage from '../components/GadgetImage';
import PriceAlertModal from '../components/PriceAlertModal';

export default function ProductDealsScreen() {
  const { productId } = useParams();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState(2500000);
  const [activeTab, setActiveTab] = useState<'prices' | 'specs'>('prices');
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'platform-az'>('price-asc');
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      
      // Try static list first
      const staticProduct = PRODUCTS.find(p => p.id === productId);
      if (staticProduct) {
        setProduct(staticProduct);
        setSelectedStorage(staticProduct.specs.storage?.[0]);
        setIsLoading(false);
        return;
      }

      // If not in static list, fetch from API
      if (productId) {
        const dynamicProduct = await fetchProductById(productId);
        if (dynamicProduct) {
          setProduct(dynamicProduct);
          setSelectedStorage(dynamicProduct.specs.storage?.[0]);
        }
      }
      setIsLoading(false);
    }
    loadProduct();
  }, [productId]);

  const filteredDeals = DEALS
    .filter(deal => deal.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'platform-az') return a.platform.localeCompare(b.platform);
      return 0;
    });

  const clearFilters = () => {
    if (product) {
      setSelectedStorage(product.specs.storage?.[0]);
    }
    setMaxPrice(2500000);
  };

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#ff6600] animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">We couldn't find the gadget you're looking for.</p>
        <Link to="/" className="px-8 py-4 bg-[#ff6600] text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-12">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Link to="/" className="hover:text-[#ff6600]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/phones" className="hover:text-[#ff6600]">Phones</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* Product Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 aspect-square bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 overflow-hidden">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full"
            >
              <GadgetImage 
                src={product.image} 
                alt={product.name} 
                brand={product.brand}
                containerClassName="w-full h-full"
              />
            </motion.div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.brand}</span>
              <div className="px-3 py-1 bg-green-100 rounded-full">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">In Stock</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">{product.name}</h1>
              <button
                onClick={() => isInCompare(product.id) ? removeFromCompare(product.id) : addToCompare(product)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border",
                  isInCompare(product.id)
                    ? "bg-green-50 border-green-200 text-green-600"
                    : "bg-white border-gray-200 text-gray-400 hover:border-[#ff6600] hover:text-[#ff6600]"
                )}
              >
                {isInCompare(product.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isInCompare(product.id) ? "In Compare" : "Compare"}
              </button>
              <button
                onClick={() => setIsPriceAlertOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border bg-white border-gray-200 text-gray-400 hover:border-[#ff6600] hover:text-[#ff6600]"
              >
                <Bell className="w-5 h-5" />
                Price Alert
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Smartphone className="w-5 h-5 text-[#ff6600] mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Display</p>
                <p className="text-xs font-bold text-gray-900 truncate">{product.specs.display.split(' ')[0]}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Cpu className="w-5 h-5 text-[#ff6600] mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Chipset</p>
                <p className="text-xs font-bold text-gray-900 truncate">{product.specs.chipset.split(' ')[0]}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Camera className="w-5 h-5 text-[#ff6600] mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Camera</p>
                <p className="text-xs font-bold text-gray-900 truncate">{product.specs.camera.split(' ')[0]}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Battery className="w-5 h-5 text-[#ff6600] mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Battery</p>
                <p className="text-xs font-bold text-gray-900 truncate">{product.specs.battery.split(' ')[0]}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                <p className="text-3xl font-black text-gray-900">₦{product.startingPrice.toLocaleString()}</p>
              </div>
              <div className="h-12 w-px bg-gray-100 hidden sm:block" />
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/40/40`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white">
                  +12k
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400">Comparing prices for 12,000+ users today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('prices')}
            className={cn(
              "pb-4 text-sm font-black uppercase tracking-widest transition-all relative",
              activeTab === 'prices' ? "text-[#ff6600]" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Marketplace Deals
            {activeTab === 'prices' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6600] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={cn(
              "pb-4 text-sm font-black uppercase tracking-widest transition-all relative",
              activeTab === 'specs' ? "text-[#ff6600]" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Full Specifications
            {activeTab === 'specs' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6600] rounded-full" />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'prices' ? (
            <motion.div 
              key="prices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-72 space-y-6">
                {/* Mobile Filter Toggle */}
                <button 
                  onClick={() => setIsFiltersVisible(true)}
                  className="w-full lg:hidden p-6 flex items-center justify-between bg-white rounded-3xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#ff6600]" />
                    <h3 className="text-lg font-black text-gray-900">Filters</h3>
                  </div>
                  <ChevronDown className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isFiltersVisible && (
                    <motion.div 
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:translate-x-0 bg-white lg:bg-transparent lg:block"
                    >
                      <div className="h-full flex flex-col lg:block overflow-y-auto lg:overflow-visible">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 lg:hidden">
                          <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-[#ff6600]" />
                            <h3 className="text-lg font-black text-gray-900">Filters</h3>
                          </div>
                          <button 
                            onClick={() => setIsFiltersVisible(false)}
                            className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-8 space-y-8 bg-white lg:rounded-3xl lg:border lg:border-gray-100 lg:shadow-sm">
                          <div className="hidden lg:flex items-center gap-2 mb-8">
                            <Filter className="w-5 h-5 text-[#ff6600]" />
                            <h3 className="text-lg font-black text-gray-900">Filters</h3>
                          </div>

                          <div className="space-y-8">
                            {/* Price Range */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Max Price (₦)</h4>
                              <input 
                                type="range" 
                                min="100000" 
                                max="3000000" 
                                step="50000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#ff6600] mb-4"
                              />
                              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                <span>₦100k</span>
                                <span className="text-[#ff6600] text-xs">₦{(maxPrice / 1000).toLocaleString()}k</span>
                                <span>₦3M</span>
                              </div>
                            </div>

                            {/* Condition */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Condition</h4>
                              <div className="space-y-3">
                                {['Brand New', 'Used (Foreign)', 'Used (Local)'].map((c) => (
                                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={cn(
                                      "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                      c === 'Brand New' ? "bg-[#ff6600] border-[#ff6600]" : "border-gray-200 group-hover:border-[#ff6600]"
                                    )}>
                                      {c === 'Brand New' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">{c}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Storage */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Storage</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {product.specs.storage?.map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => setSelectedStorage(s)}
                                    className={cn(
                                      "py-2.5 rounded-xl text-xs font-bold border transition-all",
                                      selectedStorage === s 
                                        ? "bg-white border-[#ff6600] text-[#ff6600] shadow-md shadow-[#ff6600]/10" 
                                        : "border-gray-100 text-gray-400 hover:border-gray-200"
                                    )}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                clearFilters();
                                if (window.innerWidth < 1024) setIsFiltersVisible(false);
                              }}
                              className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl text-sm font-bold transition-colors"
                            >
                              Clear All Filters
                            </button>

                            <button 
                              onClick={() => setIsFiltersVisible(false)}
                              className="w-full py-4 bg-[#ff6600] text-white rounded-2xl text-sm font-bold transition-colors lg:hidden"
                            >
                              Apply Filters
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Insurance Promo */}
                <div className="bg-[#ff6600] rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2 block">Exclusive Deal</span>
                    <h3 className="text-2xl font-black mb-4 leading-tight">Get Gadget Insurance for ₦2,500/mo</h3>
                    <button className="bg-white text-[#ff6600] px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                  <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Available Deals</h2>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-500 italic">Showing {filteredDeals.length} offers for {product.name}</p>
                      <div className="h-4 w-px bg-gray-200" />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort by:</span>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="bg-transparent text-xs font-bold text-gray-900 border-none focus:ring-0 cursor-pointer hover:text-[#ff6600] transition-colors"
                        >
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="platform-az">Platform: A-Z</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-orange-100 rounded-full">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Live Prices</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse">
                          <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-gray-100 rounded w-1/4" />
                              <div className="h-6 bg-gray-100 rounded w-1/2" />
                            </div>
                            <div className="w-32 h-12 bg-gray-100 rounded-xl" />
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-[#ff6600] animate-spin mb-4" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching best deals...</p>
                      </div>
                    </div>
                  ) : filteredDeals.length > 0 ? (
                    filteredDeals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))
                  ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                      <p className="text-gray-500 font-medium">No deals found within this price range.</p>
                      <button 
                        onClick={clearFilters}
                        className="mt-4 text-[#ff6600] font-bold hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-12 text-center">
                  <button className="text-sm font-bold text-gray-500 hover:text-[#ff6600] flex items-center gap-2 mx-auto">
                    Load more platforms
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </main>
            </motion.div>
          ) : (
            <motion.div 
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <Info className="w-6 h-6 text-[#ff6600]" />
                    Technical Specifications
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <Smartphone className="w-6 h-6 text-[#ff6600] mt-1" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Display</p>
                        <p className="text-sm font-bold text-gray-900">{product.specs.display}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <Cpu className="w-6 h-6 text-[#ff6600] mt-1" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Processor</p>
                        <p className="text-sm font-bold text-gray-900">{product.specs.chipset}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <Camera className="w-6 h-6 text-[#ff6600] mt-1" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Camera System</p>
                        <p className="text-sm font-bold text-gray-900">{product.specs.camera}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 md:mt-16">
                  <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <Battery className="w-6 h-6 text-[#ff6600] mt-1" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Battery & Charging</p>
                      <p className="text-sm font-bold text-gray-900">{product.specs.battery}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <HardDrive className="w-6 h-6 text-[#ff6600] mt-1" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Memory & Storage</p>
                      <p className="text-sm font-bold text-gray-900">{product.specs.ram} RAM / {product.specs.storage?.join(', ')}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-orange-50 rounded-[32px] border border-orange-100">
                    <h4 className="text-sm font-black text-orange-900 mb-2">Expert Review Summary</h4>
                    <p className="text-xs text-orange-800 leading-relaxed opacity-80">
                      The {product.name} continues to be a top choice for Nigerian users looking for {product.brand === 'Apple' ? 'premium performance and ecosystem integration' : 'cutting-edge hardware and display technology'}. Its {product.specs.chipset} ensures smooth multitasking even with heavy local apps.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PriceAlertModal 
        isOpen={isPriceAlertOpen}
        onClose={() => setIsPriceAlertOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          startingPrice: product.startingPrice
        }}
      />
    </div>
  );
}
