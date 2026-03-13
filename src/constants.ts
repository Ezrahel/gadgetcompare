import { Product, Deal, Category } from './types';
import { getPlatformLogo } from './lib/utils';

export const CATEGORIES: Category[] = [
  { id: 'phones', name: 'Phones', icon: 'Smartphone' },
  { id: 'computers', name: 'Computers', icon: 'Monitor' },
  { id: 'audio', name: 'Audio', icon: 'Headphones' },
  { id: 'cameras', name: 'Cameras', icon: 'Camera' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    image: 'https://picsum.photos/seed/iphone15/400/400',
    startingPrice: 850000,
    specs: {
      display: '6.1" Super Retina XDR',
      chipset: 'A16 Bionic (4nm)',
      camera: '48MP Main + 12MP Ultra',
      battery: '3,349 mAh / 20W Charge',
      ram: '6 GB',
      storage: ['128GB', '256GB', '512GB', '1TB']
    }
  },
  {
    id: 'samsung-s23',
    name: 'Samsung Galaxy S23',
    brand: 'Samsung',
    image: 'https://picsum.photos/seed/s23/400/400',
    startingPrice: 720000,
    specs: {
      display: '6.1" Dynamic AMOLED 2X 120Hz',
      chipset: 'Snapdragon 8 Gen 2 (4nm)',
      camera: '50MP Main + 10MP Tele + 12MP',
      battery: '3,900 mAh / 25W Charge',
      ram: '8 GB',
      storage: ['128GB', '256GB', '512GB']
    }
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    image: 'https://picsum.photos/seed/iphone15promax/400/400',
    startingPrice: 1550000,
    specs: {
      display: '6.7" Super Retina XDR',
      chipset: 'A17 Pro (3nm)',
      camera: '48MP Main + 12MP Tele + 12MP Ultra',
      battery: '4,441 mAh / 20W Charge',
      ram: '8 GB',
      storage: ['256GB', '512GB', '1TB']
    }
  }
];

export const DEALS: Deal[] = [
  {
    id: '1',
    platform: 'Jumia Nigeria',
    platformLogo: getPlatformLogo('Jumia'),
    price: 1245000,
    originalPrice: 1350000,
    status: 'In Stock',
    type: 'Official Store',
    details: 'Official Store',
    url: 'https://www.jumia.com.ng'
  },
  {
    id: '2',
    platform: 'Slot Systems',
    platformLogo: getPlatformLogo('Slot'),
    price: 1250000,
    status: 'In Stock',
    type: 'Official Store',
    details: 'Pickup Available',
    url: 'https://slot.ng'
  },
  {
    id: '3',
    platform: 'Easybuy',
    platformLogo: getPlatformLogo('Easybuy'),
    price: 245500,
    status: 'Approved',
    type: 'Installment Plan',
    installment: {
      monthly: 245500,
      duration: '6 months',
      deposit: 350000
    },
    url: 'https://easybuy.africa'
  },
  {
    id: '4',
    platform: 'CDCare',
    platformLogo: getPlatformLogo('CDCare'),
    price: 108300,
    status: 'Approved',
    type: 'Installment Plan',
    installment: {
      monthly: 108300,
      duration: '12 Months',
      deposit: 0
    },
    details: 'Zero Interest',
    url: 'https://cdcare.ng'
  },
  {
    id: '5',
    platform: 'Jiji Nigeria',
    platformLogo: getPlatformLogo('Jiji'),
    price: 890000,
    status: 'Pre-owned',
    type: 'Marketplace',
    location: 'Lagos Island',
    url: 'https://jiji.ng'
  }
];
