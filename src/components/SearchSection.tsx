import { Search, TrendingUp, X, ArrowRight, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, FormEvent, useEffect, useRef, KeyboardEvent } from 'react';
import { cn } from '../lib/utils';
import { fetchTrendingTags } from '../services/trendingService';

const POPULAR_SUGGESTIONS = [
  'iPhone 15 Pro Max',
  'Samsung Galaxy S24 Ultra',
  'Infinix Note 40 Pro',
  'Tecno Camon 30 Premier',
  'MacBook Air M3',
  'Sony WH-1000XM5',
  'Oraimo FreePods 4',
  'Google Pixel 8 Pro',
  'PlayStation 5',
  'Redmi Note 13 Pro',
  'iPad Pro M2',
  'Samsung Galaxy A55'
];

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [trendingTags, setTrendingTags] = useState<string[]>(['iPhone 15 Pro', 'MacBook Air M3', 'Sony WH-1000XM5', 'Pixel 8']);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadTrendingTags() {
      const tags = await fetchTrendingTags();
      if (tags.length > 0) {
        setTrendingTags(tags);
      }
    }
    loadTrendingTags();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        try {
          // Fetch from backend (previous searches)
          const response = await fetch(`/api/suggestions?query=${encodeURIComponent(query)}`);
          const historySuggestions = await response.json();

          // Filter popular suggestions
          const filteredPopular = POPULAR_SUGGESTIONS.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
          );

          // Combine and remove duplicates
          const combined = Array.from(new Set([...historySuggestions, ...filteredPopular])).slice(0, 8);
          
          setSuggestions(combined);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          // Fallback to popular suggestions only
          const filtered = POPULAR_SUGGESTIONS.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        }
      } else if (query.trim().length === 0) {
        // Fetch recent searches when empty
        try {
          const response = await fetch(`/api/suggestions?query=`);
          const recentSearches = await response.json();
          setSuggestions(recentSearches.slice(0, 5));
          // Only show if we have recent searches
          if (recentSearches.length > 0) {
            setShowSuggestions(true);
          }
        } catch (error) {
          setSuggestions([]);
        }
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const finalQuery = selectedIndex >= 0 ? suggestions[selectedIndex] : query;
    if (finalQuery.trim()) {
      navigate(`/search/${encodeURIComponent(finalQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    navigate(`/search/${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-4xl mx-auto text-center py-12 sm:py-20 px-4">
      <div className="inline-block px-4 py-1.5 bg-[#ff6600]/10 rounded-full mb-6">
        <span className="text-[10px] sm:text-xs font-bold text-[#ff6600] uppercase tracking-widest">
          Smart shopping starts here
        </span>
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
        Find the best gadgets
      </h1>
      <p className="text-gray-500 text-sm sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
        Compare prices, specs, and reviews across thousands of products.
      </p>

      <div className="relative max-w-3xl mx-auto" ref={dropdownRef}>
        <form 
          onSubmit={handleSearch} 
          className={cn(
            "flex items-center bg-white/80 backdrop-blur-2xl rounded-full p-1.5 border transition-all duration-300 relative z-20",
            "shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-gray-200/50",
            "focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-within:border-[#ff6600]/30 focus-within:bg-white"
          )}
        >
          <div className="pl-3 sm:pl-5 pr-2 text-gray-400 shrink-0">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search gadgets..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-gray-900 text-sm sm:text-base placeholder:text-gray-400 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 mr-1 text-gray-300 hover:text-gray-500 transition-colors rounded-full hover:bg-gray-100 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            type="submit"
            className="bg-[#ff6600] text-white px-5 sm:px-10 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-[#e65c00] transition-all active:scale-95 shadow-lg shadow-[#ff6600]/20 shrink-0"
          >
            Search
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 origin-top">
            <div className="p-3">
              <div className="px-4 py-2 mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {query.trim() === '' ? 'Recent Searches' : 'Suggestions'}
                </span>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left group",
                    selectedIndex === index ? "bg-[#ff6600]/10" : "hover:bg-[#ff6600]/5"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    selectedIndex === index ? "bg-white" : "bg-gray-50 group-hover:bg-white"
                  )}>
                    {query.trim() === '' ? (
                      <Clock className={cn(
                        "w-3.5 h-3.5 transition-colors",
                        selectedIndex === index ? "text-[#ff6600]" : "text-gray-400 group-hover:text-[#ff6600]"
                      )} />
                    ) : (
                      <Search className={cn(
                        "w-3.5 h-3.5 transition-colors",
                        selectedIndex === index ? "text-[#ff6600]" : "text-gray-400 group-hover:text-[#ff6600]"
                      )} />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    selectedIndex === index ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                  )}>{suggestion}</span>
                  <ArrowRight className={cn(
                    "w-4 h-4 ml-auto transition-all transform",
                    selectedIndex === index ? "text-[#ff6600] opacity-100 translate-x-0" : "text-gray-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-widest">
          <TrendingUp className="w-4 h-4 text-[#ff6600]" />
          <span>Trending Now</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {trendingTags.map((tag) => (
            <Link
              key={tag}
              to={`/search/${encodeURIComponent(tag)}`}
              className="px-4 py-2 bg-white border border-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium transition-colors shadow-sm hover:border-[#ff6600]/30 hover:text-[#ff6600]"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
