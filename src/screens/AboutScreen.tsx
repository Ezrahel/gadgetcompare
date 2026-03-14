import { motion } from 'motion/react';
import { ShieldCheck, Zap, Globe, Heart } from 'lucide-react';

export default function AboutScreen() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-32">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8"
        >
          Transparency for the <br />
          <span className="text-[#ff6600]">Nigerian Tech Market.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed"
        >
          GadgetPrice is built to solve the fragmentation in Nigeria's gadget market. 
          We provide real-time price comparisons, verified deals, and transparent data 
          to help you make the best buying decisions.
        </motion.p>
      </section>

      {/* Values Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Zap,
              title: "Real-time Data",
              description: "We fetch live prices from Jumia, Slot, Jiji, and more using advanced AI grounding."
            },
            {
              icon: ShieldCheck,
              title: "Verified Deals",
              description: "Our system highlights official stores and verified sellers to ensure your safety."
            },
            {
              icon: Globe,
              title: "Local Context",
              description: "Prices are in Naira, with local shipping and installment plans like CDCare and Easybuy."
            },
            {
              icon: Heart,
              title: "User First",
              description: "We don't sell gadgets. We provide the data so you can buy from the best source."
            }
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 hover:border-[#ff6600]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <value.icon className="w-6 h-6 text-[#ff6600]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-500 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <div className="space-y-12">
          <div className="border-l-4 border-[#ff6600] pl-8 py-2">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              In Nigeria, finding the best price for a gadget often means visiting multiple websites, 
              checking social media pages, and calling physical stores. GadgetPrice centralizes this 
              experience, bringing the entire market to your fingertips.
            </p>
          </div>
          <div className="border-l-4 border-gray-200 pl-8 py-2">
            <h2 className="text-3xl font-black text-gray-900 mb-6">How it Works</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We use OpenAI-powered web search to scan the web for the latest prices, specs, and availability. 
              Our algorithms analyze the data to find the best value, factoring in installment options 
              and seller reputation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <div className="bg-gray-900 rounded-[48px] p-12 md:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff6600] blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Ready to find your next gadget?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of Nigerians making smarter tech purchases every day.
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-10 py-5 bg-[#ff6600] text-white rounded-full font-black text-lg hover:bg-[#e65c00] transition-all hover:scale-105 relative z-10"
          >
            Start Searching
          </a>
        </div>
      </section>
    </div>
  );
}
