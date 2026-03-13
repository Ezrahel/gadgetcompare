import { useState } from 'react';
import { cn, getBrandLogo } from '../lib/utils';

interface GadgetImageProps {
  src: string;
  alt: string;
  brand: string;
  className?: string;
  containerClassName?: string;
}

export default function GadgetImage({ src, alt, brand, className, containerClassName }: GadgetImageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <img 
        src={imgError ? getBrandLogo(brand) : src} 
        alt={alt} 
        onError={() => setImgError(true)}
        className={cn(
          "w-full h-full object-contain transition-all duration-500",
          imgError ? "p-12 opacity-50" : "p-6",
          className
        )}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
