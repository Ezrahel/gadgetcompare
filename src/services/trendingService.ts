import { Product } from "../types";

// Simple in-memory cache
let trendingCache: { data: Product[]; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export async function fetchTrendingProducts(): Promise<Product[]> {
  if (trendingCache && Date.now() - trendingCache.timestamp < CACHE_DURATION) {
    return trendingCache.data;
  }

  try {
    const response = await fetch("/api/trending");
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || "Failed to fetch trending products");
    }

    const data = await response.json();
    trendingCache = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return [];
  }
}

export async function fetchTrendingTags(): Promise<string[]> {
  try {
    const response = await fetch("/api/trending-tags");
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || "Failed to fetch trending tags");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    return ["iPhone 15 Pro", "Samsung S24", "MacBook Air", "Pixel 8"];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${encodeURIComponent(id)}`);
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || "Failed to fetch product details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}
