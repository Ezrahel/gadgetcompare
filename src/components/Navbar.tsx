import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Repeat } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useCompare } from '../context/CompareContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { compareList } = useCompare();

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Marketplaces', href: '/marketplaces' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Gadget<span className="text-[#ff6600]">Compare</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#ff6600] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
              to="/compare"
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-100 transition-all relative"
            >
              <Repeat className="w-4 h-4 text-[#ff6600]" />
              Compare
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6600] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {compareList.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link 
              to="/compare"
              className="relative p-2 text-gray-900"
            >
              <Repeat className="w-6 h-6" />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff6600] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                  {compareList.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 relative z-50"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-base font-medium text-gray-600 hover:text-[#ff6600]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
