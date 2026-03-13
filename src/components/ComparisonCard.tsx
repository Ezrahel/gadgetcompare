import { Product } from '../types';
import { Smartphone, Cpu, Camera, Battery, Database, HardDrive } from 'lucide-react';
import GadgetImage from './GadgetImage';

interface ComparisonCardProps {
  product: Product;
}

export default function ComparisonCard({ product }: ComparisonCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
      <div className="aspect-square bg-gray-50 rounded-2xl mb-8 overflow-hidden flex items-center justify-center border border-gray-100">
        <GadgetImage 
          src={product.image} 
          alt={product.name} 
          brand={product.brand}
          containerClassName="w-full h-full"
        />
      </div>
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h3>
        <p className="text-[#ff6600] font-bold">Starting from ₦{product.startingPrice.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1">
        <SpecItem icon={Smartphone} label="Display" value={product.specs.display} />
        <SpecItem icon={Cpu} label="Chipset" value={product.specs.chipset} />
        <SpecItem icon={Camera} label="Camera" value={product.specs.camera} />
        <SpecItem icon={Battery} label="Battery" value={product.specs.battery} />
        {product.specs.ram && (
          <SpecItem icon={Database} label="RAM" value={product.specs.ram} />
        )}
        {product.specs.storage && product.specs.storage.length > 0 && (
          <SpecItem 
            icon={HardDrive} 
            label="Storage Options" 
            value={product.specs.storage.join(' / ')} 
          />
        )}
      </div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-colors">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-[#ff6600]" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
