import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, ArrowLeft, X } from 'lucide-react';
import logoImage from '/logo.png';

interface FloatingSearchBarProps {
  mapsLoaded: boolean;
  initialAddress: string;
  onSearchLocation: (address: string, lat: number, lng: number) => void;
  onBackToForm: () => void;
}

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({
  mapsLoaded,
  initialAddress,
  onSearchLocation,
  onBackToForm,
}) => {
  const [address, setAddress] = useState(initialAddress);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  // Sync address when parent updates it
  useEffect(() => {
    setAddress(initialAddress);
  }, [initialAddress]);

  // Hook Autocomplete
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
        onSearchLocation(formattedAddress, lat, lng);
      }
    });

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
  }, [mapsLoaded, onSearchLocation]);

  return (
    <div className="absolute top-4 left-4 right-4 md:right-auto md:w-[480px] z-30 flex items-center space-x-2">
      {/* Back button to return to onboarding form */}
      <button
        onClick={onBackToForm}
        className="bg-white border border-slate-200 text-slate-700 p-3 rounded-2xl shadow-lg hover:text-primary hover:bg-slate-50 transition-all duration-200 cursor-pointer shrink-0"
        title="Back to filters"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Floating search input */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-lg flex items-center px-4 py-1.5 hover:border-slate-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
        <a href="/" className="shrink-0 mr-3 flex items-center" title="SettleKar Home">
          <img src={logoImage} alt="SettleKar Logo" className="h-7 w-7 object-contain" />
        </a>
        
        <div className="h-5 w-px bg-slate-200 mr-3"></div>

        <MapPin className="h-4.5 w-4.5 text-slate-400 mr-2 shrink-0" />
        <input
          ref={autocompleteInputRef}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={mapsLoaded ? 'Search location...' : 'Loading Maps...'}
          disabled={!mapsLoaded}
          className="w-full bg-transparent border-none outline-none text-slate-800 text-xs md:text-sm font-semibold placeholder:text-slate-400 py-2"
        />

        {address && (
          <button
            type="button"
            onClick={() => setAddress('')}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 cursor-pointer mr-1 shrink-0"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <Search className="h-4.5 w-4.5 text-slate-400 ml-2 shrink-0 cursor-pointer hover:text-primary transition-colors duration-200" />
      </div>
    </div>
  );
};
export default FloatingSearchBar;
