import { Link } from 'react-router-dom';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCompare } from '../context/CompareContext';
import { cn } from '../lib/utils';
import GadgetImage from './GadgetImage';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isComparing = isInCompare(product.id);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
      <Link to={`/product/${product.id}`} className="block aspect-square mb-6">
        <GadgetImage 
          src={product.image} 
          alt={product.name} 
          brand={product.brand}
          containerClassName="rounded-2xl bg-gray-50 h-full"
          className="group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-widest shadow-sm">
            {product.brand}
          </span>
        </div>
      </Link>

      <div className="space-y-4">
        <div>
          <Link to={`/product/${product.id}`} className="text-lg font-black text-gray-900 hover:text-[#ff6600] transition-colors line-clamp-1">
            {product.name}
          </Link>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Starting from ₦{product.startingPrice.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to={`/product/${product.id}`}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-[#ff6600] transition-colors flex items-center justify-center gap-2"
          >
            View Deals
            <ArrowRight className="w-3 h-3" />
          </Link>
          
          <button
            onClick={() => isComparing ? removeFromCompare(product.id) : addToCompare(product)}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all border",
              isComparing 
                ? "bg-green-50 border-green-200 text-green-600" 
                : "bg-white border-gray-100 text-gray-400 hover:border-[#ff6600] hover:text-[#ff6600]"
            )}
            title={isComparing ? "Remove from compare" : "Add to compare"}
          >
            {isComparing ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
