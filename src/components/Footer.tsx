import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#ff6600] rounded-md flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">GadgetCompare</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              We help Nigerians find the best gadget deals across all popular e-commerce and installment platforms.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/ditechinc_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#ff6600] border border-gray-100 transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">@ditechinc_</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm text-gray-500 hover:text-[#ff6600] transition-colors">
                  About Us
                </Link>
              </li>
              {['Privacy Policy', 'Terms of Service', 'Partner with Us'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-500 hover:text-[#ff6600] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-[#ff6600] transition-colors">
                  Contact Support
                </Link>
              </li>
              {['Help Center', 'How it works'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-500 hover:text-[#ff6600] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 GadgetCompare Nigeria. Prices are updated every 15 minutes. | Built By Di-Tech Inc.
          </p>
          <div className="flex gap-8">
            {['PRIVACY POLICY', 'TERMS OF SERVICE', 'HELP CENTER'].map((item) => (
              <Link key={item} to="#" className="text-[10px] font-bold text-gray-400 hover:text-[#ff6600] tracking-wider">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
