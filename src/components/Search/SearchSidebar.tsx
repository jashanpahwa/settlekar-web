import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Star, MapPin, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

interface SearchProperty {
  id: string;
  title: string;
  city: string;
  location: string;
  address: string;
  price: number | string;
  rating: string;
  badge: string;
  features: string;
  image: string;
  description?: string;
  propertyType?: string;
  furnishing?: string;
  isIndependent?: boolean;
  bachelorFriendly?: boolean;
  womenOnly?: boolean;
  isTopFloor?: boolean;
  isVerified?: boolean;
  verifiedDetails?: string[];
  ratingCount?: number;
}

interface SearchSidebarProps {
  properties: SearchProperty[];
  selectedProperty: SearchProperty | null;
  onSelectProperty: (property: SearchProperty) => void;
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  searchAddress: string;
  compareList: SearchProperty[];
  onToggleCompare: (property: SearchProperty) => void;
  onOpenCompareView: () => void;
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  loading,
  isOpen,
  onToggle,
  searchAddress,
  compareList,
  onToggleCompare,
  onOpenCompareView,
}) => {
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-scroll selected card into view
  useEffect(() => {
    if (selectedProperty && cardRefs.current[selectedProperty.id]) {
      cardRefs.current[selectedProperty.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedProperty]);

  const getCleanedAddress = (addr: string) => {
    if (!addr) return '';
    // Shorten long google maps addresses for the badge
    const parts = addr.split(',');
    return parts.slice(0, 2).join(',');
  };

  return (
    <div
      className={`h-full flex relative z-40 bg-white border-r border-slate-200 transition-all duration-300 ${
        isOpen ? 'w-full md:w-[420px]' : 'w-0'
      }`}
    >
      {/* Toggle Button Container - positioned on the edge of the sidebar */}
      <button
        onClick={onToggle}
        className={`absolute top-1/2 -translate-y-1/2 bg-[#0A2540] border border-slate-200 text-slate-700 h-10 w-8 flex items-center justify-center rounded-xl md:rounded-r-xl md:rounded-l-none shadow-md hover:text-primary hover:bg-slate-50 transition-all duration-200 cursor-pointer z-50 ${
          isOpen ? 'right-4 md:-right-4' : '-right-12'
        }`}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4 text-white" /> : <ChevronRight className="h-4 w-4 text-white" />}
      </button>

      {/* Sidebar Contents */}
      <div className={`w-full flex flex-col h-full overflow-hidden ${!isOpen ? 'opacity-0 pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <h2 className="font-bold text-lg text-slate-900 leading-snug">
            {loading ? 'Searching properties...' : `${properties.length} matches found`}
          </h2>
          {searchAddress && (
            <p className="text-xs text-slate-500 font-medium truncate mt-1 flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-slate-400 shrink-0" />
              <span>near {getCleanedAddress(searchAddress)}</span>
            </p>
          )}
        </div>

        {/* List of Properties */}
        <div ref={sidebarContentRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-500">Retrieving rental matches...</span>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-4">
              <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                <Home className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">No Properties Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                  Try expanding your budget range, altering BHK preferences, or widening your search area.
                </p>
              </div>
            </div>
          ) : (
            properties.map((p) => {
              const isSelected = selectedProperty && selectedProperty.id === p.id;
              const displayPrice = typeof p.price === 'number'
                ? `₹${p.price.toLocaleString('en-IN')}/mo`
                : p.price;

              return (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardRefs.current[p.id] = el;
                  }}
                  onClick={() => onSelectProperty(p)}
                  className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden group ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/10 shadow-md'
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex h-36">
                    {/* Thumbnail Image */}
                    <div className="w-1/3 relative bg-slate-100 shrink-0 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {p.badge}
                      </span>
                      {p.isVerified && (
                        <span className="absolute bottom-2 left-2 bg-[#10b981] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="w-2/3 p-3.5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate max-w-[90px]">
                            {p.propertyType || p.badge}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {p.isVerified && (
                              <span className="text-[9px] font-bold text-[#10b981] flex items-center shrink-0">
                                🛡️ Verified
                              </span>
                            )}
                            <span className="flex items-center text-[10px] font-bold text-amber-500 shrink-0">
                              <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                              {p.rating || '4.8'}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-800 text-xs md:text-sm line-clamp-1 group-hover:text-primary transition-colors duration-200">
                          {p.title}
                        </h3>
                       
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          {p.features}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.isIndependent !== undefined && p.isIndependent !== null && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {p.isIndependent ? 'Independent' : 'Shared'}
                            </span>
                          )}
                          {p.bachelorFriendly !== undefined && p.bachelorFriendly !== null && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {p.bachelorFriendly ? 'Bachelor Friendly' : 'Family Only'}
                            </span>
                          )}
                          {p.womenOnly !== undefined && p.womenOnly !== null && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {p.womenOnly ? 'Women Only' : 'Open to All'}
                            </span>
                          )}
                          {p.isTopFloor !== undefined && p.isTopFloor !== null && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {p.isTopFloor ? 'Top Floor' : 'Other Floor'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                        <span className="font-bold text-sm text-slate-900">{displayPrice}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCompare(p);
                            }}
                            className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all active:scale-95 cursor-pointer ${
                              compareList.some((item) => item.id === p.id)
                                ? 'bg-[#0a2540] border-[#0a2540] text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {compareList.some((item) => item.id === p.id) ? '✓ Added' : '+ Compare'}
                          </button>
                          <Link
                            to={`/property/${p.id.toString().replace('mock-', '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white text-[10px] font-bold transition-all duration-200"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Compare Bar */}
        {compareList.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">{compareList.length} selected</span>
              <span className="text-[10px] text-slate-400 font-medium">Select 2 to 5</span>
            </div>
            <button
              onClick={onOpenCompareView}
              disabled={compareList.length < 2}
              className="px-4 py-2 bg-[#0A2540] text-white hover:bg-[#0A2540]/90 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Compare Side-by-Side →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchSidebar;
