import { useEffect, useState } from 'react';
import SearchSection from '../components/SearchSection';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { fetchTrendingProducts } from '../services/trendingService';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

export default function HomeScreen() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      setIsLoading(true);
      const products = await fetchTrendingProducts();
      if (products.length > 0) {
        setTrendingProducts(products);
      }
      setIsLoading(false);
    }
    loadTrending();
  }, []);

  return (
    <div className="pb-20 md:pb-0">
      <SearchSection />

      {/* Browse Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} name={cat.name} icon={cat.icon as any} />
          ))}
        </div>

        {/* Promo Banner */}
        <div className="mt-12 relative h-64 sm:h-80 rounded-[2.5rem] overflow-hidden group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200" 
            alt="Gaming Banner" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 sm:px-12">
            <span className="text-[#ff6600] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-3">New Arrival</span>
            <h3 className="text-white text-3xl sm:text-5xl font-black mb-4 leading-tight">The Future <br /> of Gaming</h3>
            <p className="text-gray-300 text-sm sm:text-lg font-medium">Discover the new RTX series laptops</p>
          </div>
        </div>

        {/* Trending Gadgets */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending in Nigeria</h2>
            <Link to="/search/trending" className="text-sm font-bold text-[#ff6600] hover:underline">View all</Link>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#ff6600] animate-spin mb-4" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching real-time trends...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
