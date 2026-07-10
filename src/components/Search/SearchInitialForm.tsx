import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Home, Search, Navigation, X } from 'lucide-react';
import { DualRangeSlider } from './DualRangeSlider';
import logoImage from '/logo.png';

interface SearchInitialFormProps {
  mapsLoaded: boolean;
  initialAddress: string;
  onSearch: (searchData: {
    address: string;
    lat: number;
    lng: number;
    minBudget: number;
    maxBudget: number;
    selectedTypes: string[];
    kmRange: number;
    bachelorFriendly: boolean | null;
    petFriendly: boolean | null;
    relocationReady: boolean | null;
    isIndependent: boolean | null;
    lifestyleId: string | null;
  }) => void;
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

const LIFESTYLES = [
  {
    id: 'office',
    label: 'Office Commute',
    description: 'Close to hubs, low transit time',
    icon: '💼',
    presets: {
      kmRange: 5,
      selectedTypes: ['1bhk', '2bhk', 'studio'],
      bachelorFriendly: null,
      petFriendly: null,
      relocationReady: null,
      independent: null,
    }
  },
  {
    id: 'family',
    label: 'Family-Friendly',
    description: 'Safe areas, spacious configurations',
    icon: '👨‍👩‍👧‍👦',
    presets: {
      kmRange: 15,
      selectedTypes: ['2bhk', '3bhk', '4bhk', 'villa'],
      bachelorFriendly: false,
      petFriendly: null,
      relocationReady: null,
      independent: true,
    }
  },
  {
    id: 'bachelor',
    label: 'Bachelor-Friendly',
    description: 'Societies open to single renters',
    icon: '🙋‍♂️',
    presets: {
      kmRange: 10,
      selectedTypes: ['1rk', '1bhk', 'studio', 'pg'],
      bachelorFriendly: true,
      petFriendly: null,
      relocationReady: null,
      independent: null,
    }
  },
  {
    id: 'pet',
    label: 'Pet-Friendly',
    description: 'Homes with pets allowed policies',
    icon: '🐾',
    presets: {
      kmRange: 15,
      selectedTypes: ['2bhk', '3bhk', 'villa', 'apartment'],
      bachelorFriendly: null,
      petFriendly: true,
      relocationReady: null,
      independent: null,
    }
  },
  {
    id: 'relocation',
    label: 'Relocation Ready',
    description: 'Verified direct owners, fully furnished',
    icon: '📦',
    presets: {
      kmRange: 15,
      selectedTypes: ['1bhk', '2bhk', 'apartment', 'studio'],
      bachelorFriendly: null,
      petFriendly: null,
      relocationReady: true,
      independent: null,
    }
  },
  {
    id: 'student',
    label: 'Student / College',
    description: 'Budget-friendly studio/PGs near campuses',
    icon: '🎓',
    presets: {
      kmRange: 8,
      selectedTypes: ['1rk', '1bhk', 'studio', 'pg'],
      bachelorFriendly: true,
      petFriendly: null,
      relocationReady: null,
      independent: null,
      maxBudget: 25000,
    }
  }
];

export const SearchInitialForm: React.FC<SearchInitialFormProps> = ({
  mapsLoaded,
  initialAddress,
  onSearch,
}) => {
  const [address, setAddress] = useState(initialAddress || '');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [minBudget, setMinBudget] = useState(10000);
  const [maxBudget, setMaxBudget] = useState(60000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['1bhk', '2bhk']);
  const [kmRange, setKmRange] = useState(15);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  // Lifestyle Presets States
  const [selectedLifestyle, setSelectedLifestyle] = useState<string | null>(null);
  const [bachelorFriendly, setBachelorFriendly] = useState<boolean | null>(null);
  const [petFriendly, setPetFriendly] = useState<boolean | null>(null);
  const [relocationReady, setRelocationReady] = useState<boolean | null>(null);
  const [isIndependent, setIsIndependent] = useState<boolean | null>(null);

  // Sync address with initialAddress from parent (e.g. silent GPS resolution)
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Autocomplete
  useEffect(() => {
    if (!mapsLoaded || !autocompleteInputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(autocompleteInputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'in' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || place.name || '';
        setAddress(formattedAddress);
        setCoords({ lat, lng });
        setError('');
      }
    });

    // Prevent enter key from submitting parent forms on autocomplete selection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };

    const input = autocompleteInputRef.current;
    input.addEventListener('keydown', handleKeyDown);

    return () => {
      input.removeEventListener('keydown', handleKeyDown);
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [mapsLoaded]);

  // Handle current location GPS fetch
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        // Reverse geocode if google maps is loaded
        if (mapsLoaded && typeof google !== 'undefined') {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
            setLocating(false);
            if (status === 'OK' && results && results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              setAddress(`Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            }
          });
        } else {
          setLocating(false);
          setAddress(`Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        }
      },
      (err) => {
        setLocating(false);
        setError('Unable to retrieve your location. Please type an address.');
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleLifestyleSelect = (life: typeof LIFESTYLES[number]) => {
    if (selectedLifestyle === life.id) {
      setSelectedLifestyle(null);
      setBachelorFriendly(null);
      setPetFriendly(null);
      setRelocationReady(null);
      setIsIndependent(null);
    } else {
      setSelectedLifestyle(life.id);
      
      // Apply presets
      if (life.presets.kmRange !== undefined) setKmRange(life.presets.kmRange);
      if (life.presets.selectedTypes !== undefined) setSelectedTypes(life.presets.selectedTypes);
      if (life.presets.bachelorFriendly !== undefined) setBachelorFriendly(life.presets.bachelorFriendly);
      if (life.presets.petFriendly !== undefined) setPetFriendly(life.presets.petFriendly);
      if (life.presets.relocationReady !== undefined) setRelocationReady(life.presets.relocationReady);
      if (life.presets.independent !== undefined) setIsIndependent(life.presets.independent);
      if (life.id === 'student' && life.presets.maxBudget !== undefined) {
        setMinBudget(5000);
        setMaxBudget(life.presets.maxBudget);
      }
    }
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
    setSelectedLifestyle(null); // Clear lifestyle preset if user manually deviates
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setError('Please enter a location or use your current location.');
      return;
    }

    // If coordinates are not resolved yet (user typed but didn't select from dropdown), geocode it
    if (!coords && mapsLoaded && typeof google !== 'undefined') {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0] && results[0].geometry?.location) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          onSearch({
            address: results[0].formatted_address,
            lat,
            lng,
            minBudget,
            maxBudget,
            selectedTypes,
            kmRange,
            bachelorFriendly,
            petFriendly,
            relocationReady,
            isIndependent,
            lifestyleId: selectedLifestyle,
          });
        } else {
          setError('Could not verify this address. Please select one from the dropdown.');
        }
      });
      return;
    }

    // Default coordinates in case geocoding fails (e.g. Mumbai center)
    const finalCoords = coords || { lat: 19.0760, lng: 72.8777 };

    onSearch({
      address,
      lat: finalCoords.lat,
      lng: finalCoords.lng,
      minBudget,
      maxBudget,
      selectedTypes,
      kmRange,
      bachelorFriendly,
      petFriendly,
      relocationReady,
      isIndependent,
      lifestyleId: selectedLifestyle,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/20 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 group">
            <img src={logoImage} alt="SettleKar Logo" className="h-9 w-9 object-contain transform group-hover:scale-105 transition-transform duration-300" />
            <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary">
              SettleKar
            </span>
          </a>
          <a
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors duration-200"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 max-w-4xl mx-auto w-full">
        {/* Intro */}
        <div className="text-center mb-10 max-w-2xl">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-4">
            Where would you like to <span className="text-primary">Settle</span>?
          </h1>
          <p className="text-base text-slate-600 font-medium">
            Find verified rentals with realistic nearby travel estimates and transparent pricing.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-10 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-200/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Lifestyle Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-800">
                  Select your Lifestyle Focus
                </label>
                {selectedLifestyle && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLifestyle(null);
                      setBachelorFriendly(null);
                      setPetFriendly(null);
                      setRelocationReady(null);
                      setIsIndependent(null);
                    }}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    Reset Preset
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {LIFESTYLES.map((life) => {
                  const isSelected = selectedLifestyle === life.id;
                  return (
                    <button
                      type="button"
                      key={life.id}
                      onClick={() => handleLifestyleSelect(life)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col items-start space-y-2 group active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#0A2540] border-[#0A2540] text-white shadow-lg shadow-[#0A2540]/20'
                          : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{life.icon}</span>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{life.label}</div>
                        <div className={`text-[10px] leading-tight font-medium mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{life.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address Search Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-slate-800">
                Enter Locality, Landmark, or City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  ref={autocompleteInputRef}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (!e.target.value) {
                      setCoords(null);
                    }
                  }}
                  placeholder={
                    mapsLoaded
                      ? 'Search for a society, locality, or landmark in India...'
                      : 'Loading location autocomplete...'
                  }
                  disabled={!mapsLoaded && !locating}
                  className="w-full pl-12 pr-32 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-slate-800 text-sm font-medium transition-all duration-300 placeholder:text-slate-400 shadow-sm"
                />

                {address && (
                  <button
                    type="button"
                    onClick={() => {
                      setAddress('');
                      setCoords(null);
                    }}
                    className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 cursor-pointer"
                    title="Clear address"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-xs font-semibold text-slate-700 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`h-3 w-3 ${locating ? 'animate-spin' : ''}`} />
                  <span>{locating ? 'Locating...' : 'GPS'}</span>
                </button>
              </div>
            </div>

            {/* Price Slider Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  Monthly Rental Budget
                </label>
                <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10 shadow-sm">
                  ₹{minBudget.toLocaleString('en-IN')} - ₹{maxBudget.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="px-1.5">
                <DualRangeSlider
                  min={5000}
                  max={120000}
                  step={1000}
                  minValue={minBudget}
                  maxValue={maxBudget}
                  onChange={(minVal, maxVal) => {
                    setMinBudget(minVal);
                    setMinBudget(minVal);
                    setMaxBudget(maxVal);
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-400 font-medium px-0.5">
                <span>Min: ₹5,000</span>
                <span>Max: ₹1,20,000+</span>
              </div>
            </div>

            {/* Search Radius Slider Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  Search Radius (Distance)
                </label>
                <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10 shadow-sm">
                  {kmRange} km
                </span>
              </div>

              <div className="px-1.5">
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={kmRange}
                  onChange={(e) => setKmRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0A2540]"
                />
              </div>

              <div className="flex justify-between text-xs text-slate-400 font-medium px-0.5">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Property Types Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">
                Property Configuration
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PROPERTY_TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type.id);
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => handleTypeToggle(type.id)}
                      className={`px-4.5 py-2.5 rounded-2xl text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer flex items-center space-x-1.5 shadow-sm ${
                        isSelected
                          ? 'bg-primary border-primary text-white shadow-primary/20 shadow-md'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Home className="h-3.5 w-3.5 opacity-80" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4.5 rounded-2xl bg-primary hover:bg-primary/95 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Search className="h-4.5 w-4.5" />
                <span>Search Matches</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
