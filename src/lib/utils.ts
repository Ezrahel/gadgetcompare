import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlatformLogo(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('jumia')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Jumia_Logo.svg/1200px-Jumia_Logo.svg.png';
  if (p.includes('konga')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Konga_Logo.svg/1200px-Konga_Logo.svg.png';
  if (p.includes('slot')) return 'https://slot.ng/wp-content/uploads/2021/11/slot-logo.png';
  if (p.includes('jiji')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Jiji_Logo.svg/1200px-Jiji_Logo.svg.png';
  if (p.includes('easybuy')) return 'https://easybuy.africa/wp-content/uploads/2023/05/easybuy-logo.png';
  if (p.includes('cdcare')) return 'https://cdcare.com/assets/images/logo.png';
  if (p.includes('pointek')) return 'https://pointekonline.com/wp-content/uploads/2020/06/Pointek-Logo.png';
  if (p.includes('kara')) return 'https://www.kara.com.ng/pub/media/logo/stores/1/kara-logo.png';
  return `https://picsum.photos/seed/${encodeURIComponent(platform)}/40/40`;
}

export function getBrandLogo(brand: string) {
  const b = brand.toLowerCase();
  if (b.includes('apple')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png';
  if (b.includes('samsung')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png';
  if (b.includes('google')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png';
  if (b.includes('xiaomi')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1200px-Xiaomi_logo_%282021-%29.svg.png';
  if (b.includes('infinix')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Infinix_Logo.svg/1200px-Infinix_Logo.svg.png';
  if (b.includes('tecno')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tecno_Mobile_logo.svg/1200px-Tecno_Mobile_logo.svg.png';
  if (b.includes('hp')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1200px-HP_logo_2012.svg.png';
  if (b.includes('dell')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dell_logo_2016.svg/1200px-Dell_logo_2016.svg.png';
  if (b.includes('lenovo')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/1200px-Lenovo_logo_2015.svg.png';
  if (b.includes('sony')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1200px-Sony_logo.svg.png';
  return `https://picsum.photos/seed/${encodeURIComponent(brand)}/200/200`;
}
