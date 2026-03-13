import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export interface CategoryCardProps {
  key?: string | number;
  name: string;
  icon: keyof typeof Icons;
  className?: string;
}

export default function CategoryCard({ name, icon, className }: CategoryCardProps) {
  const Icon = Icons[icon] as any;

  return (
    <Link to={`/search/${name.toLowerCase()}`} className={cn(
      "bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#ff6600]/30 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group flex flex-col items-center justify-center gap-6 shadow-sm",
      className
    )}>
      <div className="w-16 h-16 bg-[#ff6600]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#ff6600] transition-colors">
        <Icon className="w-8 h-8 text-[#ff6600] group-hover:text-white transition-colors" />
      </div>
      <span className="text-lg font-bold text-gray-900">{name}</span>
    </Link>
  );
}
