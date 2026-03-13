/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import HomeScreen from './screens/HomeScreen';
import ProductDealsScreen from './screens/ProductDealsScreen';
import CompareScreen from './screens/CompareScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import WishlistScreen from './screens/WishlistScreen';
import { ScrollToTop } from './components/ScrollToTop';

import { CompareProvider } from './context/CompareContext';
import { WishlistProvider } from './context/WishlistContext';

export default function App() {
  return (
    <WishlistProvider>
      <CompareProvider>
        <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#ff6600]/30 selection:text-gray-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search/:query" element={<SearchResultsScreen />} />
              <Route path="/product/:productId" element={<ProductDealsScreen />} />
              <Route path="/compare" element={<CompareScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/contact" element={<ContactScreen />} />
              <Route path="/marketplaces" element={<MarketplaceScreen />} />
              <Route path="/wishlist" element={<WishlistScreen />} />
              {/* Fallback for other routes in screenshots */}
              <Route path="/phones" element={<ProductDealsScreen />} />
              <Route path="/deals" element={<ProductDealsScreen />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CompareProvider>
  </WishlistProvider>
  );
}
