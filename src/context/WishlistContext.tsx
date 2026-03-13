import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  id: number;
  email: string;
  product_id: string;
  target_price: number | null;
  name: string;
  brand: string;
  starting_price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productId: string, email: string, targetPrice?: number) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>;
  fetchWishlist: (email: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const fetchWishlist = async (email: string) => {
    try {
      const response = await fetch(`/api/wishlist/${email}`);
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const addToWishlist = async (productId: string, email: string, targetPrice?: number) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId, targetPrice }),
      });
      if (response.ok) {
        await fetchWishlist(email);
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (id: number) => {
    try {
      const item = wishlist.find(i => i.id === id);
      const response = await fetch(`/api/wishlist/${id}`, { method: 'DELETE' });
      if (response.ok && item) {
        await fetchWishlist(item.email);
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
