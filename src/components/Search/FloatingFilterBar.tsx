import React, { useState, useRef, useEffect } from 'react';
import { IndianRupee, Home, MapPin, Users, UserCheck, Layers, Shield, Heart, Package, Armchair } from 'lucide-react';
import { DualRangeSlider } from './DualRangeSlider';

interface FloatingFilterBarProps {
  minBudget: number;
  maxBudget: number;
  selectedTypes: string[];
  kmRange: number;
  isIndependent: boolean | null;
  bachelorFriendly: boolean | null;
  womenOnly: boolean | null;
  isTopFloor: boolean | null;
  petFriendly: boolean | null;
  relocationReady: boolean | null;
  furnishingFilter: string | null;
  safetyScoreFilter: number;
  onBudgetChange: (min: number, max: number) => void;
  onTypesChange: (types: string[]) => void;
  onKmRangeChange: (km: number) => void;
  onIndependentChange: (val: boolean | null) => void;
  onBachelorFriendlyChange: (val: boolean | null) => void;
  onWomenOnlyChange: (val: boolean | null) => void;
  onTopFloorChange: (val: boolean | null) => void;
  onPetFriendlyChange: (val: boolean | null) => void;
  onRelocationReadyChange: (val: boolean | null) => void;
  onFurnishingFilterChange: (val: string | null) => void;
  onSafetyScoreFilterChange: (val: number) => void;
}

const PROPERTY_TYPES = [
  { id: '1rk', label: '1 RK' },
  { id: '1bhk', label: '1 BHK' },
  { id: '2bhk', label: '2 BHK' },
  { id: '3bhk', label: '3 BHK' },
  { id: '4bhk', label: '4 BHK' },
  { id: 'villa', label: 'Villa' },
  { id: 'apartment', label: 'Apartment' },
  { id: 'studio', label: 'Studio' },
  { id: 'pg', label: 'PG' },
  { id: 'shop', label: 'Shop' },
];

export const FloatingFilterBar: React.FC<FloatingFilterBarProps> = ({
  minBudget,
  maxBudget,
  selectedTypes,
  kmRange,
  isIndependent,
  bachelorFriendly,
  womenOnly,
  isTopFloor,
  petFriendly,
  relocationReady,
  furnishingFilter,
  safetyScoreFilter,
  onBudgetChange,
  onTypesChange,
  onKmRangeChange,
  onIndependentChange,
  onBachelorFriendlyChange,
  onWomenOnlyChange,
  onTopFloorChange,
  onPetFriendlyChange,
  onRelocationReadyChange,
  onFurnishingFilterChange,
  onSafetyScoreFilterChange,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'budget' | 'bhk' | 'distance' | 'furnishing' | 'safety' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeToggle = (typeId: string) => {
    onTypesChange(
      selectedTypes.includes(typeId)
        ? selectedTypes.filter((id) => id !== typeId)
        : [...selectedTypes, typeId]
    );
  };

  const isFilterActive = (type: 'budget' | 'bhk' | 'distance' | 'furnishing' | 'safety') => {
    if (type === 'budget') {
      return minBudget !== 5000 || maxBudget !== 120000;
    }
    if (type === 'bhk') {
      return selectedTypes.length > 0;
    }
    if (type === 'distance') {
      return kmRange !== 15;
    }
    if (type === 'furnishing') {
      return furnishingFilter !== null;
    }
    if (type === 'safety') {
      return safetyScoreFilter > 0;
    }
    return false;
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-20 left-4 z-30 flex flex-wrap gap-2 max-w-[calc(100vw-2rem)] md:max-w-none"
    >
      {/* 1. Budget Pill */}
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
            isFilterActive('budget') || activeDropdown === 'budget'
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <IndianRupee className="h-3.5 w-3.5" />
          <span>
            {minBudget === 5000 && maxBudget === 120000
              ? 'Budget'
              : `₹${(minBudget / 1000).toFixed(0)}k - ₹${(maxBudget / 1000).toFixed(0)}k`}
          </span>
        </button>

        {activeDropdown === 'budget' && (
          <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl border border-slate-100 shadow-xl p-5 z-50">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Rent Budget</h4>
            <DualRangeSlider
              min={5000}
              max={120000}
              step={1000}
              minValue={minBudget}
              maxValue={maxBudget}
              onChange={onBudgetChange}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-slate-500 font-bold">
                ₹{minBudget.toLocaleString('en-IN')} - ₹{maxBudget.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => onBudgetChange(5000, 120000)}
                className="text-xs text-primary hover:text-primary/80 font-bold transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. BHK configuration Pill */}
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(activeDropdown === 'bhk' ? null : 'bhk')}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
            isFilterActive('bhk') || activeDropdown === 'bhk'
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Home className="h-3.5 w-3.5" />
          <span>
            {selectedTypes.length === 0
              ? 'BHK Type'
              : selectedTypes.length === 1
              ? PROPERTY_TYPES.find((t) => t.id === selectedTypes[0])?.label
              : `${selectedTypes.length} Selected`}
          </span>
        </button>

        {activeDropdown === 'bhk' && (
          <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 z-50 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">Configuration</h4>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {PROPERTY_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeToggle(type.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <button
                onClick={() => onTypesChange([])}
                className="text-[11px] text-slate-500 hover:text-slate-600 font-bold cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => setActiveDropdown(null)}
                className="text-[11px] text-primary hover:text-primary/80 font-bold cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Distance Pill */}
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(activeDropdown === 'distance' ? null : 'distance')}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
            isFilterActive('distance') || activeDropdown === 'distance'
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>{kmRange === 15 ? 'Distance' : `< ${kmRange} km`}</span>
        </button>

        {activeDropdown === 'distance' && (
          <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 z-50 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">Search Radius</h4>
            <div className="space-y-1.5">
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={kmRange}
                onChange={(e) => onKmRangeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0A2540] mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <span className="text-xs font-bold text-primary">{kmRange} km</span>
              <button
                onClick={() => {
                  onKmRangeChange(15);
                  setActiveDropdown(null);
                }}
                className="text-xs text-primary hover:text-primary/80 font-bold cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
      {/* 4. Independent Property Pill */}
      <button
        onClick={() => onIndependentChange(isIndependent === null ? true : isIndependent ? false : null)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
          isIndependent !== null
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Home className="h-3.5 w-3.5" />
        <span>{isIndependent === null ? 'Independent' : isIndependent ? 'Independent' : 'Shared'}</span>
      </button>

      {/* 5. Bachelor Friendly Pill */}
      <button
        onClick={() => onBachelorFriendlyChange(bachelorFriendly === null ? true : bachelorFriendly ? false : null)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
          bachelorFriendly !== null
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Users className="h-3.5 w-3.5" />
        <span>{bachelorFriendly === null ? 'Bachelors' : bachelorFriendly ? 'Bachelor Friendly' : 'Family Only'}</span>
      </button>

      {/* 6. Women Only Pill */}
      <button
        onClick={() => onWomenOnlyChange(womenOnly === null ? true : womenOnly ? false : null)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
          womenOnly !== null
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <UserCheck className="h-3.5 w-3.5" />
        <span>{womenOnly === null ? 'Women' : womenOnly ? 'Women Only' : 'Open to All'}</span>
      </button>

      {/* 7. Is Top Floor Pill */}
      <button
        onClick={() => onTopFloorChange(isTopFloor === null ? true : isTopFloor ? false : null)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
          isTopFloor !== null
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        <span>{isTopFloor === null ? 'Floor' : isTopFloor ? 'Top Floor' : 'Other Floor'}</span>
      </button>

      {/* 8. Pet Friendly Pill */}
      <button
        onClick={() => onPetFriendlyChange(petFriendly === null ? true : petFriendly ? false : null)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
          petFriendly !== null
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Heart className="h-3.5 w-3.5" />
        <span>{petFriendly === null ? 'Pets Allowed' : petFriendly ? 'Pet Friendly' : 'No Pets'}</span>
      </button>

      {/* 9. Relocation Ready Pill */}
      <button
        onClick={() => onRelocationReadyChange(relocationReady === null ? true : relocationReady ? false : null)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
          relocationReady !== null
            ? 'bg-primary border-primary text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Package className="h-3.5 w-3.5" />
        <span>{relocationReady === null ? 'Relocation-Ready' : relocationReady ? 'Ready to Move' : 'Standard'}</span>
      </button>

      {/* 10. Furnishing Dropdown */}
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(activeDropdown === 'furnishing' ? null : 'furnishing')}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
            isFilterActive('furnishing') || activeDropdown === 'furnishing'
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Armchair className="h-3.5 w-3.5" />
          <span>
            {furnishingFilter === null
              ? 'Furnishing'
              : furnishingFilter === 'fully'
              ? 'Fully Furnished'
              : furnishingFilter === 'semi'
              ? 'Semi Furnished'
              : 'Unfurnished'}
          </span>
        </button>

        {activeDropdown === 'furnishing' && (
          <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-60 bg-white rounded-2xl border border-slate-100 shadow-xl p-3.5 z-50 space-y-1 flex flex-col">
            <h4 className="font-bold text-slate-800 text-sm px-2 pb-1.5 border-b border-slate-50">Furnishing Status</h4>
            {[
              { id: null, label: 'Any Furnishing' },
              { id: 'fully', label: 'Fully Furnished' },
              { id: 'semi', label: 'Semi Furnished' },
              { id: 'unfurnished', label: 'Unfurnished' },
            ].map((option) => {
              const isSelected = furnishingFilter === option.id;
              return (
                <button
                  key={option.label || 'any'}
                  onClick={() => {
                    onFurnishingFilterChange(option.id);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-primary/5 text-primary font-bold'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 11. Safety/Score Dropdown */}
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(activeDropdown === 'safety' ? null : 'safety')}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-md flex items-center space-x-1.5 active:scale-95 ${
            isFilterActive('safety') || activeDropdown === 'safety'
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>
            {safetyScoreFilter === 0
              ? 'Livability'
              : safetyScoreFilter === 2
              ? 'Highly Safe (80+)'
              : 'Safe (60+)'}
          </span>
        </button>

        {activeDropdown === 'safety' && (
          <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 bg-white rounded-2xl border border-slate-100 shadow-xl p-3.5 z-50 space-y-1 flex flex-col">
            <h4 className="font-bold text-slate-800 text-sm px-2 pb-1.5 border-b border-slate-50">Safety & Livability Score</h4>
            {[
              { id: 0, label: 'Any Rating' },
              { id: 1, label: 'Standard Safe (60+ Score)' },
              { id: 2, label: 'Premium Safe (80+ Score)' },
            ].map((option) => {
              const isSelected = safetyScoreFilter === option.id;
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    onSafetyScoreFilterChange(option.id);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-primary/5 text-primary font-bold'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default FloatingFilterBar;
