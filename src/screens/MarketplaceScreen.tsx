import { motion } from 'motion/react';
import { ShoppingBag, ShieldCheck, Zap, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

const MARKETPLACES = [
  {
    name: 'Jumia Nigeria',
    description: 'Nigeria\'s largest e-commerce platform with official brand stores and express delivery.',
    logo: 'https://picsum.photos/seed/jumia/200/200',
    url: 'https://www.jumia.com.ng',
    color: 'bg-orange-500',
    features: ['Official Stores', 'Jumia Express', 'Pay on Delivery']
  },
  {
    name: 'Slot Systems',
    description: 'The leading retail chain for mobile phones and gadgets in Nigeria with physical stores nationwide.',
    logo: 'https://picsum.photos/seed/slot/200/200',
    url: 'https://slot.ng',
    color: 'bg-red-600',
    features: ['Physical Stores', 'Warranty', 'Trade-in']
  },
  {
    name: 'Jiji Nigeria',
    description: 'The largest classifieds marketplace for new and pre-owned gadgets from verified sellers.',
    logo: 'https://picsum.photos/seed/jiji/200/200',
    url: 'https://jiji.ng',
    color: 'bg-green-600',
    features: ['Pre-owned Deals', 'Direct Contact', 'Local Pickup']
  },
  {
    name: 'CDCare',
    description: 'Buy gadgets and pay in small installments with zero interest and zero stress.',
    logo: 'https://picsum.photos/seed/cdcare/200/200',
    url: 'https://cdcare.ng',
    color: 'bg-blue-600',
    features: ['Zero Interest', 'Monthly Payments', 'No Deposit']
  },
  {
    name: 'Easybuy',
    description: 'Get your dream phone today and pay later with flexible mobile financing plans.',
    logo: 'https://picsum.photos/seed/easybuy/200/200',
    url: 'https://easybuy.africa',
    color: 'bg-yellow-500',
    features: ['Instant Approval', 'Low Deposit', 'Flexible Plans']
  },
  {
    name: 'Konga',
    description: 'A trusted marketplace for original electronics and home appliances with KongaPay rewards.',
    logo: 'https://picsum.photos/seed/konga/200/200',
    url: 'https://www.konga.com',
    color: 'bg-pink-600',
    features: ['Original Items', 'KongaPay', 'Fast Delivery']
  }
];

export default function MarketplaceScreen() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-black text-gray-400 uppercase tracking-widest mb-8 border border-gray-100"
        >
          <ShoppingBag className="w-3 h-3" />
          Supported Marketplaces
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8"
        >
          All your favorite stores. <br />
          <span className="text-[#ff6600]">One search.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed"
        >
          We aggregate data from Nigeria's most trusted retailers and financing platforms 
           to ensure you always get the best value for your money.
        </motion.p>
      </section>

      {/* Marketplaces Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MARKETPLACES.map((market, index) => (
            <motion.div
              key={market.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gray-50 rounded-[40px] p-10 border border-gray-100 hover:border-[#ff6600]/20 transition-all hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-20 h-20 rounded-3xl bg-white p-4 shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center border border-gray-100">
                  <img src={market.logo} alt={market.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <a 
                  href={market.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-[#ff6600] border border-gray-100 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4">{market.name}</h3>
              <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
                {market.description}
              </p>

              <div className="space-y-3">
                {market.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6600]" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200/50">
                <a 
                  href={market.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-black text-[#ff6600] uppercase tracking-widest hover:gap-4 transition-all"
                >
                  Visit Store
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-gray-900 rounded-[64px] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-[#ff6600] blur-[150px] rounded-full" />
          </div>

          <div className="max-w-2xl relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
              Verified for your <br />
              <span className="text-[#ff6600]">peace of mind.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              We only partner with platforms that have a proven track record of 
              reliability in Nigeria. Every price you see is verified in real-time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <ShieldCheck className="w-6 h-6 text-[#ff6600]" />
                </div>
                <span className="font-bold text-lg">Verified Sellers</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Zap className="w-6 h-6 text-[#ff6600]" />
                </div>
                <span className="font-bold text-lg">Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
