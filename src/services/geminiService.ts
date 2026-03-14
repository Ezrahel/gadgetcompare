import { Deal, Product } from "../types";
import { getPlatformLogo } from "../lib/utils";

export async function searchGadgetPrices(query: string): Promise<{ product: Product; deals: Deal[] }> {
  const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Failed to fetch gadget prices from OpenAI");
  }

  const data = await response.json();

  return {
    product: data.product,
    deals: (data.deals ?? []).map((deal: any, index: number) => ({
      ...deal,
      id: deal.id?.toString() || `deal-${index}`,
      platformLogo: getPlatformLogo(deal.platform)
    }))
  };
}
