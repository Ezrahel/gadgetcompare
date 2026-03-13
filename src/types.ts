export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  startingPrice: number;
  specs: {
    display: string;
    chipset: string;
    camera: string;
    battery: string;
    ram?: string;
    storage?: string[];
  };
}

export interface Deal {
  id: string;
  platform: string;
  platformLogo: string;
  price: number;
  originalPrice?: number;
  status: 'In Stock' | 'Pre-owned' | 'Approved';
  type: 'Official Store' | 'Marketplace' | 'Installment Plan';
  details?: string;
  installment?: {
    monthly: number;
    duration: string;
    deposit: number;
  };
  location?: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
