import { Deal } from '../types';
import { CheckCircle2, MapPin, Info, ExternalLink, Calculator, MessageSquare, ShieldCheck, ShoppingBag, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface DealCardProps {
  key?: string | number;
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const isInstallment = deal.type === 'Installment Plan';
  const isOfficial = deal.type === 'Official Store';
  const isMarketplace = deal.type === 'Marketplace';

  const typeConfig = {
    'Official Store': {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-700',
      icon: ShieldCheck,
      badge: 'bg-green-100 text-green-700'
    },
    'Installment Plan': {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      icon: Calculator,
      badge: 'bg-blue-100 text-blue-700'
    },
    'Marketplace': {
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      text: 'text-orange-700',
      icon: ShoppingBag,
      badge: 'bg-orange-100 text-orange-700'
    }
  }[deal.type] || {
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    text: 'text-gray-700',
    icon: Info,
    badge: 'bg-gray-100 text-gray-700'
  };

  const Icon = typeConfig.icon;

  return (
    <div className={cn(
      "bg-white rounded-3xl p-6 border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6 group",
      "hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.01]",
      isOfficial ? "hover:border-green-500" : 
      isInstallment ? "hover:border-blue-500" : 
      "hover:border-[#ff6600]"
    )}>
      {/* Platform Info */}
      <div className="flex items-center gap-4 min-w-[220px]">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100 group-hover:bg-white transition-colors">
          <img src={deal.platformLogo} alt={deal.platform} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-black text-gray-900">{deal.platform}</h4>
            {isOfficial && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
              typeConfig.badge
            )}>
              <Icon className="w-3 h-3" />
              {deal.type}
            </span>
            {deal.details && (
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                {deal.details}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex-1 flex flex-col sm:items-end">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900">
            ₦{deal.price.toLocaleString()}
            {isInstallment && <span className="text-sm font-bold text-gray-400"> /mo</span>}
          </span>
          {deal.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₦{deal.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            deal.status === 'In Stock' ? "bg-green-500" :
            deal.status === 'Approved' ? "bg-blue-500" :
            "bg-orange-500"
          )} />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{deal.status}</span>
          {deal.location && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                {deal.location}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
        <button
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title: `Check out this deal on ${deal.platform}`,
                  text: `I found a great deal for ${deal.price.toLocaleString()} on ${deal.platform}!`,
                  url: deal.url,
                });
              } catch (err) {
                console.error('Error sharing:', err);
              }
            } else {
              // Fallback: Copy to clipboard
              navigator.clipboard.writeText(deal.url);
              alert('Link copied to clipboard!');
            }
          }}
          className="w-full sm:w-12 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#ff6600] hover:border-[#ff6600]/20 transition-all"
          title="Share Deal"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <a 
          href={deal.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex-1 sm:w-44 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg",
            isOfficial ? "bg-green-600 hover:bg-green-700 shadow-green-600/20 text-white" :
            isInstallment ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 text-white" :
            "bg-[#ff6600] hover:bg-[#e65c00] shadow-[#ff6600]/20 text-white"
          )}
        >
          {isInstallment ? 'Apply Now' : 'View Deal'}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
