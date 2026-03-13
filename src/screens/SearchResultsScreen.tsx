import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, ShieldCheck, Loader2, AlertCircle, ArrowLeft, Share2, Star, ExternalLink, Search, Plus, Check, X, ChevronDown } from 'lucide-react';
import { searchGadgetPrices } from '../services/geminiService';
import { Product, Deal } from '../types';
import DealCard from '../components/DealCard';
import { cn, getPlatformLogo } from '../lib/utils';
import { useCompare } from '../context/CompareContext';
import { motion, AnimatePresence } from 'motion/react';

export default function SearchResultsScreen() {
  const { query } = useParams();
  const navigate = useNavigate();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ product: Product; deals: Deal[] } | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedPlatformType, setSelectedPlatformType] = useState<string | null>(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'platform-az'>('price-asc');

  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        const result = await searchGadgetPrices(query);
        setData(result);
        setSelectedStorage(result.product.specs.storage?.[0]);

        // Fetch analysis
        const analysisRes = await fetch(`/api/analysis/${result.product.id}`);
        if (analysisRes.ok) {
          const analysisData = await analysisRes.json();
          setAnalysis(analysisData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch gadget prices. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#ff6600] animate-spin" />
        <p className="text-gray-500 font-medium">Searching for the best deals on "{query}"...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">Oops! Something went wrong</h2>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 bg-[#ff6600] text-white rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { product, deals = [] } = data;

  const getStorageMultiplier = (storage: string | undefined) => {
    if (!storage || !product.specs.storage) return 0;
    const index = product.specs.storage.indexOf(storage);
    const baseIndex = 0;
    return (index - baseIndex) * 85000; // ₦85,000 increase per storage step
  };

  const filteredDeals = deals
    .map(deal => ({
      ...deal,
      price: deal.price + getStorageMultiplier(selectedStorage),
      platformLogo: getPlatformLogo(deal.platform)
    }))
    .filter(deal => {
      const matchesPrice = deal.price <= maxPrice;
      const matchesPlatform = !selectedPlatformType || deal.type === selectedPlatformType;
      return matchesPrice && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'platform-az') return a.platform.localeCompare(b.platform);
      return 0;
    });

  const clearFilters = () => {
    setSelectedStorage(product.specs.storage?.[0]);
    setMaxPrice(3000000);
    setSelectedPlatformType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Link to="/" className="hover:text-[#ff6600]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900">Search Results</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
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
                            max="5000000" 
                            step="50000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#ff6600] mb-4"
                          />
                          <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>₦100k</span>
                            <span className="text-[#ff6600] text-xs">₦{(maxPrice / 1000).toLocaleString()}k</span>
                            <span>₦5M</span>
                          </div>
                        </div>

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

                        <div>
                          <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Platform Type</h4>
                          <div className="space-y-2">
                            {['Official Store', 'Marketplace', 'Installment Plan'].map((type) => (
                              <button
                                key={type}
                                onClick={() => setSelectedPlatformType(selectedPlatformType === type ? null : type)}
                                className={cn(
                                  "w-full text-left px-4 py-3 rounded-xl text-xs font-bold border transition-all",
                                  selectedPlatformType === type 
                                    ? "bg-white border-[#ff6600] text-[#ff6600] shadow-sm" 
                                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                                )}
                              >
                                {type}
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

            <div className="bg-[#ff6600] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2 block">Exclusive Deal</span>
                <h3 className="text-2xl font-black mb-4 leading-tight">Get Gadget Insurance for ₦2,500/mo</h3>
                <button className="bg-white text-[#ff6600] px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {/* Analysis Section */}
            {analysis && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Market Avg</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-gray-900">₦{Math.round(analysis.avgPrice).toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Best Value</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-[#ff6600]">{analysis.bestPlatform}</span>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Price Trend</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xl font-black uppercase",
                      analysis.trend === 'down' ? "text-green-500" : analysis.trend === 'up' ? "text-red-500" : "text-blue-500"
                    )}>
                      {analysis.trend}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
              <div className="flex-1 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.brand}/200/200`;
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
                    <button
                      onClick={() => isInCompare(product.id) ? removeFromCompare(product.id) : addToCompare(product)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        isInCompare(product.id)
                          ? "bg-green-50 border-green-200 text-green-600"
                          : "bg-white border-gray-200 text-gray-400 hover:border-[#ff6600] hover:text-[#ff6600]"
                      )}
                    >
                      {isInCompare(product.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {isInCompare(product.id) ? "In Compare" : "Compare"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.specs.display}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.specs.chipset}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.specs.camera}</span>
                    {product.specs.ram && <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.specs.ram} RAM</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500 italic">Comparing prices across {filteredDeals.length} platforms</p>
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
              </div>
              <div className="px-4 py-1.5 bg-orange-100 rounded-full">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Live Prices</span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredDeals.length > 0 ? (
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
          </main>
        </div>
      </div>
    </div>
  );
}
