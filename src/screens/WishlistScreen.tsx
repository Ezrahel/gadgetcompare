import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Bell, ExternalLink, Loader2, ArrowRight, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import GadgetImage from '../components/GadgetImage';

export default function WishlistScreen() {
  const { wishlist, fetchWishlist, removeFromWishlist } = useWishlist();
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [isChecking, setIsChecking] = useState(false);

  const handleCheckPrices = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/wishlist/check-prices', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        alert(`Price check complete! ${data.notificationsSent.length} notifications sent.`);
      }
    } catch (error) {
      console.error('Failed to check prices:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSearching(true);
    await fetchWishlist(email);
    setIsSearching(false);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-[#ff6600]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Your Wishlist</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Track your favorite gadgets and get email notifications when prices drop.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="email"
              placeholder="Enter your email to view wishlist"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-all pr-16"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 px-4 bg-[#ff6600] text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <button
            onClick={handleCheckPrices}
            disabled={isChecking}
            className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
            Check for Price Drops Now
          </button>
        </div>

        <AnimatePresence mode="wait">
          {hasSearched ? (
            wishlist.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                        <GadgetImage 
                          src={item.image} 
                          alt={item.name} 
                          brand={item.brand}
                          containerClassName="w-full h-full"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.brand}</span>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting Price</p>
                          <p className="text-xl font-black text-gray-900">₦{item.starting_price.toLocaleString()}</p>
                        </div>
                        {item.target_price && (
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-[#ff6600] uppercase tracking-widest mb-1">Target Price</p>
                            <p className="text-sm font-bold text-gray-900">₦{item.target_price.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex gap-3">
                        <Link
                          to={`/product/${item.product_id}`}
                          className="flex-1 py-3 bg-gray-50 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                          View Deals
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <div className="px-4 py-3 bg-orange-50 text-[#ff6600] rounded-xl flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500">You haven't added any items to your wishlist with this email.</p>
              </motion.div>
            )
          ) : (
            <div className="text-center py-20 opacity-50">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Enter your email above to see your tracked items</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
