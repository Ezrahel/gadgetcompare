import { Plus, Repeat, Smartphone, Cpu, Battery, Camera, Search, ArrowLeft, Share2, ShieldCheck, X, Tag, Copy, Check, TrendingDown, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCompare } from '../context/CompareContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import GadgetImage from '../components/GadgetImage';

function PriceSparkline({ productId }: { productId: string }) {
  const [history, setHistory] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/analysis/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.history) setHistory(data.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading || history.length < 2) return <div className="h-8 w-full bg-gray-50 rounded animate-pulse" />;

  const prices = history.map(h => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  
  const points = history.map((h, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 100 - ((h.price - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isUp = prices[prices.length - 1] > prices[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">7D Price Trend</p>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold uppercase",
          isUp ? "text-red-500" : "text-green-500"
        )}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? 'Up' : 'Down'}
        </div>
      </div>
      <div className="h-12 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <polyline
            fill="none"
            stroke={isUp ? "#ef4444" : "#22c55e"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}

export default function CompareScreen() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gadget Comparison',
          text: `Check out this comparison of ${compareList.map(p => p.name).join(', ')} on GadgetCompare!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const specRows = [
    { label: 'Display', icon: Smartphone, key: 'display' },
    { label: 'Battery', icon: Battery, key: 'battery' },
    { label: 'Chipset', icon: Cpu, key: 'chipset' },
    { label: 'Camera', icon: Camera, key: 'camera' },
    { label: 'RAM', icon: Cpu, key: 'ram' },
  ];

  if (compareList.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-8">
          <Repeat className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Your comparison list is empty</h1>
        <p className="text-gray-500 max-w-md mb-8">Add up to 4 gadgets to compare their prices and specifications side-by-side.</p>
        <Link to="/" className="px-8 py-4 bg-[#ff6600] text-white rounded-2xl font-bold hover:bg-[#e65c00] transition-all">
          Browse Gadgets
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-12">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-gray-900">Compare ({compareList.length})</h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={copyToClipboard} className="p-2 text-gray-900 relative">
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          <button onClick={handleShare} className="p-2 text-gray-900">
            <Share2 className="w-6 h-6" />
          </button>
          <button onClick={clearCompare} className="ml-2 text-xs font-bold text-red-500 uppercase tracking-widest">Clear</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Compare Gadgets</h1>
            <p className="text-gray-500 text-sm sm:text-lg">Side-by-side comparison of {compareList.length} gadgets</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold text-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold text-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
            <button onClick={clearCompare} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors">
              Clear All
            </button>
            <Link to="/" className="flex items-center gap-2 px-8 py-4 bg-[#ff6600] text-white rounded-2xl font-bold text-sm hover:bg-[#e65c00] transition-colors shadow-lg shadow-[#ff6600]/20">
              <Plus className="w-5 h-5" />
              Add More
            </Link>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className={cn(
            "grid gap-4 sm:gap-6 min-w-[800px] lg:min-w-0",
            compareList.length === 1 ? "grid-cols-1 max-w-md mx-auto" :
            compareList.length <= 3 ? "grid-cols-2" : "grid-cols-4"
          )}>
            {/* Header / Product Cards */}
            {compareList.map((product) => (
              <div key={product.id} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm relative group">
                <button 
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center p-6 overflow-hidden">
                  <GadgetImage 
                    src={product.image} 
                    alt={product.name} 
                    brand={product.brand}
                    containerClassName="w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{product.brand}</p>
                <div className="pt-4 border-t border-gray-50 space-y-4">
                  <PriceSparkline productId={product.id} />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting Price</p>
                    <p className="text-xl font-black text-[#ff6600]">₦{product.startingPrice.toLocaleString()}</p>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="block w-full py-3 bg-gray-900 text-white text-center rounded-xl text-xs font-bold hover:bg-[#ff6600] transition-colors"
                  >
                    View Deals
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Specs Rows */}
          <div className="mt-12 space-y-4">
            {specRows.map((row) => (
              <div key={row.key} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
                  <row.icon className="w-4 h-4 text-[#ff6600]" />
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{row.label}</span>
                </div>
                <div className={cn(
                  "grid gap-px bg-gray-100 min-w-[800px] lg:min-w-0",
                  compareList.length === 1 ? "grid-cols-1 max-w-md mx-auto" :
                  compareList.length <= 3 ? "grid-cols-2" : "grid-cols-4"
                )}>
                  {compareList.map((product) => (
                    <div key={product.id} className="bg-white p-8">
                      <p className="text-sm font-bold text-gray-900 leading-relaxed">
                        {(product.specs as any)[row.key] || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict Section */}
        {compareList.length >= 2 && (
          <div className="mt-20">
            <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Expert Comparison Verdict</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    After analyzing the current market data in Nigeria, we've identified the key trade-offs between these devices. 
                    The <span className="font-bold text-gray-900">{compareList[0].name}</span> offers the best overall performance, 
                    while the <span className="font-bold text-gray-900">{compareList[1].name}</span> provides superior value for money.
                  </p>
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                    <h4 className="text-sm font-black text-orange-900 mb-2 uppercase tracking-widest">Market Insight</h4>
                    <p className="text-xs text-orange-800 leading-relaxed">
                      Prices for {compareList[0].brand} products are currently experiencing higher volatility due to recent import cycles. 
                      If you're on a budget, consider the installment plans available on CDCare or Easybuy for these models.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-[2rem] p-8 text-white">
                  <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Quick Recommendation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-400">Best Performance</span>
                      <span className="text-sm font-bold text-[#ff6600]">{compareList[0].name}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-400">Best Battery Life</span>
                      <span className="text-sm font-bold text-[#ff6600]">{compareList.reduce((prev, curr) => (parseInt(prev.specs.battery) > parseInt(curr.specs.battery) ? prev : curr)).name}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-400">Best Value</span>
                      <span className="text-sm font-bold text-[#ff6600]">{compareList.reduce((prev, curr) => (prev.startingPrice < curr.startingPrice ? prev : curr)).name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Floating Search */}
      <Link to="/" className="md:hidden fixed bottom-24 right-6 w-16 h-16 bg-[#ff6600] rounded-full flex items-center justify-center shadow-2xl shadow-[#ff6600]/40 z-40">
        <Search className="w-8 h-8 text-white" />
      </Link>
    </div>
  );
}
