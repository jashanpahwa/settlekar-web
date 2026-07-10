import React, { useState, useEffect } from 'react';
import { loadGoogleMaps } from '../utils/googleMapsLoader';
import { propertyService } from '../services/propertyService';
import { SearchInitialForm } from '../components/Search/SearchInitialForm';
import { SearchMapView, getPropertyCoords } from '../components/Search/SearchMapView';
import { SearchSidebar } from '../components/Search/SearchSidebar';
import { FloatingSearchBar } from '../components/Search/FloatingSearchBar';
import { FloatingFilterBar } from '../components/Search/FloatingFilterBar';
import { CompareView } from '../components/Search/CompareView';
import { getRouteDistances, getHaversineDistance } from '../utils/routeDistance';

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
  overallscore?: number;
  petFriendly?: boolean;
}

export const SearchPage: React.FC = () => {
  // Load initial search state from sessionStorage if it exists to preserve across navigation
  const savedState = (() => {
    try {
      const saved = sessionStorage.getItem('settlekar_search_state');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Navigation View State
  const [viewMode, setViewMode] = useState<'form' | 'map'>(savedState?.mode || 'form');

  // Script Load State
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Search Filter and Center States
  const [searchAddress, setSearchAddress] = useState(savedState?.address || '');
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number }>(savedState?.center || {
    lat: 19.0760, // Mumbai Center default
    lng: 72.8777,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filter values
  const [minBudget, setMinBudget] = useState(savedState?.minBudget !== undefined ? savedState.minBudget : 5000);
  const [maxBudget, setMaxBudget] = useState(savedState?.maxBudget !== undefined ? savedState.maxBudget : 120000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(savedState?.selectedTypes || []);
  const [kmRange, setKmRange] = useState<number>(savedState?.kmRange !== undefined ? savedState.kmRange : 15);
  const [isIndependentFilter, setIsIndependentFilter] = useState<boolean | null>(savedState?.isIndependentFilter !== undefined ? savedState.isIndependentFilter : null);
  const [bachelorFriendlyFilter, setBachelorFriendlyFilter] = useState<boolean | null>(savedState?.bachelorFriendlyFilter !== undefined ? savedState.bachelorFriendlyFilter : null);
  const [womenOnlyFilter, setWomenOnlyFilter] = useState<boolean | null>(savedState?.womenOnlyFilter !== undefined ? savedState.womenOnlyFilter : null);
  const [isTopFloorFilter, setIsTopFloorFilter] = useState<boolean | null>(savedState?.isTopFloorFilter !== undefined ? savedState.isTopFloorFilter : null);
  const [petFriendlyFilter, setPetFriendlyFilter] = useState<boolean | null>(savedState?.petFriendlyFilter !== undefined ? savedState.petFriendlyFilter : null);
  const [relocationReadyFilter, setRelocationReadyFilter] = useState<boolean | null>(savedState?.relocationReadyFilter !== undefined ? savedState.relocationReadyFilter : null);
  const [furnishingFilter, setFurnishingFilter] = useState<string | null>(savedState?.furnishingFilter !== undefined ? savedState.furnishingFilter : null);
  const [safetyScoreFilter, setSafetyScoreFilter] = useState<number>(savedState?.safetyScoreFilter !== undefined ? savedState.safetyScoreFilter : 0);

  // Loaded Properties & Computed Route Distances
  const [properties, setProperties] = useState<SearchProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<SearchProperty[]>([]);
  const [propertyDistances, setPropertyDistances] = useState<Record<string, number>>({});
  const [selectedProperty, setSelectedProperty] = useState<SearchProperty | null>(null);

  // UI States
  const [loading, setLoading] = useState(true);
  const [distancesLoading, setDistancesLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Compare States
  const [compareList, setCompareList] = useState<SearchProperty[]>([]);
  const [isCompareViewOpen, setIsCompareViewOpen] = useState(false);

  const handleToggleCompare = (property: SearchProperty) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === property.id);
      if (exists) {
        return prev.filter((item) => item.id !== property.id);
      }
      if (prev.length >= 5) {
        alert('You can compare a maximum of 5 properties.');
        return prev;
      }
      return [...prev, property];
    });
  };

  const handleRemoveCompare = (property: SearchProperty) => {
    setCompareList((prev) => prev.filter((item) => item.id !== property.id));
  };

  // Automatically save state on updates
  useEffect(() => {
    const stateToSave = {
      address: searchAddress,
      center: searchCenter,
      mode: viewMode,
      minBudget,
      maxBudget,
      selectedTypes,
      kmRange,
      isIndependentFilter,
      bachelorFriendlyFilter,
      womenOnlyFilter,
      isTopFloorFilter,
      petFriendlyFilter,
      relocationReadyFilter,
      furnishingFilter,
      safetyScoreFilter,
    };
    sessionStorage.setItem('settlekar_search_state', JSON.stringify(stateToSave));
  }, [
    searchAddress,
    searchCenter,
    viewMode,
    minBudget,
    maxBudget,
    selectedTypes,
    kmRange,
    isIndependentFilter,
    bachelorFriendlyFilter,
    womenOnlyFilter,
    isTopFloorFilter,
    petFriendlyFilter,
    relocationReadyFilter,
    furnishingFilter,
    safetyScoreFilter,
  ]);

  // Load Google Maps Script
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ;
    const unsubscribe = loadGoogleMaps(apiKey, () => {
      setMapsLoaded(true);
    });

    // Try to get user GPS location silently on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.log('Location acquisition declined or failed:', err),
        { timeout: 5000 }
      );
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Reverse-geocode user location once maps load and userLocation is resolved (unless already searched)
  useEffect(() => {
    if (!mapsLoaded || !userLocation || searchAddress) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: userLocation }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const addr = results[0].formatted_address;
        setSearchAddress(addr);
        setSearchCenter(userLocation);
      }
    });
  }, [mapsLoaded, userLocation]);

  // Fetch all properties (live firestore only, with sessionStorage SWR caching)
  useEffect(() => {
    const loadProperties = async () => {
      // 1. Try to load instantly from sessionStorage cache
      const cached = sessionStorage.getItem('settlekar_cached_properties');
      let hasCache = false;
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProperties(parsed);
            setLoading(false);
            hasCache = true;
          }
        } catch (e) {
          console.error('Error parsing cached properties:', e);
        }
      }

      // If no cache, show loader; if we have cache, fetch silently in the background
      if (!hasCache) {
        setLoading(true);
      }

      try {
        // Fetch live properties from Firestore using propertyService
        const liveProps = await propertyService.getAllProperties();
        const formattedLive: SearchProperty[] = liveProps.map((p) => ({
          id: p.id,
          title: p.title || '',
          city: p.city || 'Jaipur',
          location: p.location || '',
          address: p.address || '',
          price: p.price || 0,
          rating: p.rating || '5.0',
          badge: p.badge || p.propertyType || 'Flat',
          features: p.features || `${p.propertyType || 'Flat'} • ${p.area || 0} sq.ft`,
          image:
            p.image ||
            (p.images && p.images[0]) ||
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
          description: p.description || '',
          propertyType: (p.propertyType || '').toLowerCase(),
          furnishing: (p.furnishing || '').toLowerCase(),
          isIndependent: p.isIndependent,
          bachelorFriendly: p.bachelorFriendly,
          womenOnly: p.womenOnly,
          isTopFloor: p.isTopFloor,
          isVerified: p.isVerified,
          verifiedDetails: p.verifiedDetails,
          ratingCount: p.ratingCount,
          overallscore: p.overallscore,
          petFriendly: p.petFriendly,
        }));

        setProperties(formattedLive);
        sessionStorage.setItem('settlekar_cached_properties', JSON.stringify(formattedLive));
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Calculate actual route distances from searchCenter asynchronously using the Google Distance Matrix API
  useEffect(() => {
    if (!searchCenter || properties.length === 0 || viewMode !== 'map') {
      setPropertyDistances({});
      return;
    }

    const fetchRouteDistances = async () => {
      setDistancesLoading(true);
      try {
        // Gather all properties with coordinates
        const validProps = properties.filter((p) => getPropertyCoords(p) !== null);
        const destinations = validProps.map((p) => getPropertyCoords(p)!);

        if (destinations.length > 0) {
          const distances = await getRouteDistances(searchCenter, destinations);
          
          const distanceMap: Record<string, number> = {};
          validProps.forEach((p, index) => {
            distanceMap[p.id] = distances[index];
          });
          setPropertyDistances(distanceMap);
        }
      } catch (error) {
        console.error('Error fetching batch route distances:', error);
      } finally {
        setDistancesLoading(false);
      }
    };

    fetchRouteDistances();
  }, [searchCenter, properties, viewMode]);

  // Filter properties client-side based on route distance, budget, configuration
  useEffect(() => {
    let result = [...properties];

    // 1. Budget Filter
    result = result.filter((p) => {
      const priceVal = typeof p.price === 'number' ? p.price : parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0;
      return priceVal >= minBudget && priceVal <= maxBudget;
    });

    // 2. Configuration (Type) Filter (1 RK, 1 BHK, 2 BHK, 3 BHK, 4 BHK, Villa, Apartment, Studio, PG, Shop)
    if (selectedTypes.length > 0) {
      result = result.filter((p) => {
        const typeLower = (p.propertyType || p.badge || '').toLowerCase();
        const titleLower = (p.title || '').toLowerCase();

        return selectedTypes.some((type) => {
          if (type === '1rk') return typeLower.includes('1 rk') || typeLower.includes('1rk') || titleLower.includes('1 rk') || titleLower.includes('1rk');
          if (type === '1bhk') return typeLower.includes('1 bhk') || typeLower.includes('1bhk') || titleLower.includes('1 bhk') || titleLower.includes('1bhk');
          if (type === '2bhk') return typeLower.includes('2 bhk') || typeLower.includes('2bhk') || titleLower.includes('2 bhk') || titleLower.includes('2bhk');
          if (type === '3bhk') return typeLower.includes('3 bhk') || typeLower.includes('3bhk') || titleLower.includes('3 bhk') || titleLower.includes('3bhk');
          if (type === '4bhk') return typeLower.includes('4 bhk') || typeLower.includes('4bhk') || titleLower.includes('4 bhk') || titleLower.includes('4bhk');
          if (type === 'villa') return typeLower.includes('villa') || titleLower.includes('villa');
          if (type === 'apartment') return typeLower.includes('apartment') || titleLower.includes('apartment') || typeLower.includes('flat') || titleLower.includes('flat');
          if (type === 'studio') return typeLower.includes('studio') || titleLower.includes('studio');
          if (type === 'pg') return typeLower.includes('pg') || typeLower.includes('co-living') || typeLower.includes('coliving') || titleLower.includes('pg');
          if (type === 'shop') return typeLower.includes('shop') || titleLower.includes('shop') || typeLower.includes('commercial') || titleLower.includes('commercial');
          return false;
        });
      });
    }

    // 3. Geolocation Proximity Filter & Distance Sorting (within kmRange of searched center)
    if (searchCenter && viewMode === 'map') {
      result = result
        .map((p) => {
          // Use pre-calculated route distance if available, otherwise Haversine fallback
          let distance = propertyDistances[p.id];
          if (distance === undefined) {
            const coords = getPropertyCoords(p);
            distance = coords ? getHaversineDistance(searchCenter, coords) : 999999;
          }
          return { ...p, distance };
        })
        .filter((p) => p.distance <= kmRange) // Filter by kmRange selected
        .sort((a, b) => a.distance - b.distance); // Sort by distance ascending
    }

    // 4. Independent Property Filter
    if (isIndependentFilter !== null) {
      result = result.filter((p: any) => p.isIndependent === isIndependentFilter);
    }

    // 5. Bachelor Friendly Filter
    if (bachelorFriendlyFilter !== null) {
      result = result.filter((p: any) => p.bachelorFriendly === bachelorFriendlyFilter);
    }

    // 6. Women Only Filter
    if (womenOnlyFilter !== null) {
      result = result.filter((p: any) => p.womenOnly === womenOnlyFilter);
    }

    // 7. Is Top Floor Filter
    if (isTopFloorFilter !== null) {
      result = result.filter((p: any) => p.isTopFloor === isTopFloorFilter);
    }

    // 8. Pet Friendly Filter
    if (petFriendlyFilter !== null) {
      result = result.filter((p: any) => {
        const descLower = (p.description || '').toLowerCase();
        const featuresLower = (p.features || '').toLowerCase();
        const hasPetKeywords = descLower.includes('pet') || descLower.includes('dog') || descLower.includes('cat') || featuresLower.includes('pet');
        return p.petFriendly === petFriendlyFilter || (petFriendlyFilter ? hasPetKeywords : !hasPetKeywords);
      });
    }

    // 9. Relocation Ready Filter (Furnished + Verified + Independent)
    if (relocationReadyFilter !== null) {
      result = result.filter((p: any) => {
        const isFurnished = (p.furnishing || '').toLowerCase().includes('furnished') && !(p.furnishing || '').toLowerCase().includes('unfurnished');
        const isVerified = p.isVerified === true;
        const isIndependent = p.isIndependent !== false;
        return relocationReadyFilter ? (isFurnished && isVerified && isIndependent) : true;
      });
    }

    // 10. Safety Score Filter
    if (safetyScoreFilter > 0) {
      result = result.filter((p: any) => {
        const score = p.overallscore !== undefined ? p.overallscore : parseFloat(p.rating || '0') * 20;
        if (safetyScoreFilter === 2) return score >= 80;
        if (safetyScoreFilter === 1) return score >= 60;
        return true;
      });
    }

    // 11. Furnishing Filter
    if (furnishingFilter !== null) {
      result = result.filter((p: any) => {
        const furn = (p.furnishing || '').toLowerCase();
        if (furnishingFilter === 'fully') return furn.includes('fully') || furn.includes('full');
        if (furnishingFilter === 'semi') return furn.includes('semi');
        if (furnishingFilter === 'unfurnished') return furn.includes('unfurnished') || furn === 'none' || furn === '';
        return true;
      });
    }

    setFilteredProperties(result);
  }, [
    properties,
    searchCenter,
    minBudget,
    maxBudget,
    selectedTypes,
    propertyDistances,
    kmRange,
    viewMode,
    isIndependentFilter,
    bachelorFriendlyFilter,
    womenOnlyFilter,
    isTopFloorFilter,
    petFriendlyFilter,
    relocationReadyFilter,
    furnishingFilter,
    safetyScoreFilter,
  ]);

  // Transition from Initial Form to Map View
  const handleInitialSearchSubmit = (searchData: {
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
  }) => {
    setSearchAddress(searchData.address);
    setSearchCenter({ lat: searchData.lat, lng: searchData.lng });
    setMinBudget(searchData.minBudget);
    setMaxBudget(searchData.maxBudget);
    setSelectedTypes(searchData.selectedTypes);
    setKmRange(searchData.kmRange);
    setBachelorFriendlyFilter(searchData.bachelorFriendly);
    setPetFriendlyFilter(searchData.petFriendly);
    setRelocationReadyFilter(searchData.relocationReady);
    setIsIndependentFilter(searchData.isIndependent);
    setViewMode('map');
  };

  // Re-run search from Floating Bar
  const handleFloatingSearchSubmit = (address: string, lat: number, lng: number) => {
    setSearchAddress(address);
    setSearchCenter({ lat, lng });
    setSelectedProperty(null); // Clear selected property on new search
  };

  if (viewMode === 'form') {
    return (
      <SearchInitialForm
        mapsLoaded={mapsLoaded}
        initialAddress={searchAddress}
        onSearch={handleInitialSearchSubmit}
      />
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden font-sans relative">
      {/* Sidebar - shows matches */}
      <SearchSidebar
        properties={filteredProperties}
        selectedProperty={selectedProperty}
        onSelectProperty={(p) => setSelectedProperty(p)}
        loading={loading || distancesLoading}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        searchAddress={searchAddress}
        compareList={compareList}
        onToggleCompare={handleToggleCompare}
        onOpenCompareView={() => setIsCompareViewOpen(true)}
      />

      {/* Map Content Area */}
      <div className="flex-1 h-full relative bg-slate-100">
        {/* Floating search control */}
        <FloatingSearchBar
          mapsLoaded={mapsLoaded}
          initialAddress={searchAddress}
          onSearchLocation={handleFloatingSearchSubmit}
          onBackToForm={() => setViewMode('form')}
        />

        {/* Floating Quick Filters */}
        <FloatingFilterBar
          minBudget={minBudget}
          maxBudget={maxBudget}
          selectedTypes={selectedTypes}
          kmRange={kmRange}
          isIndependent={isIndependentFilter}
          bachelorFriendly={bachelorFriendlyFilter}
          womenOnly={womenOnlyFilter}
          isTopFloor={isTopFloorFilter}
          petFriendly={petFriendlyFilter}
          relocationReady={relocationReadyFilter}
          furnishingFilter={furnishingFilter}
          safetyScoreFilter={safetyScoreFilter}
          onBudgetChange={(min, max) => {
            setMinBudget(min);
            setMaxBudget(max);
          }}
          onTypesChange={(types) => setSelectedTypes(types)}
          onKmRangeChange={(km) => setKmRange(km)}
          onIndependentChange={setIsIndependentFilter}
          onBachelorFriendlyChange={setBachelorFriendlyFilter}
          onWomenOnlyChange={setWomenOnlyFilter}
          onTopFloorChange={setIsTopFloorFilter}
          onPetFriendlyChange={setPetFriendlyFilter}
          onRelocationReadyChange={setRelocationReadyFilter}
          onFurnishingFilterChange={setFurnishingFilter}
          onSafetyScoreFilterChange={setSafetyScoreFilter}
        />

        {/* Google Map component */}
        {mapsLoaded ? (
          <SearchMapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={(p) => setSelectedProperty(p)}
            center={searchCenter}
            userLocation={userLocation}
            selectedLocation={searchCenter}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-500">Initializing interactive maps...</span>
          </div>
        )}
      </div>

      {isCompareViewOpen && (
        <CompareView
          properties={compareList}
          onRemove={handleRemoveCompare}
          onClose={() => setIsCompareViewOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchPage;
