import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { PropertyItem } from './types';
import { propertyService } from '../../services/propertyService';

interface ListPropertyTabProps {
  user: User;
  userRole: 'broker' | 'owner' | 'firm' | 'tenant';
  editingProperty: PropertyItem | null;
  onSaveSuccess: (updatedOrNewProp: PropertyItem, isEdit: boolean) => void;
  onCancel: () => void;
}

interface SegmentedControlProps {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
  options: { label: string; value: boolean }[];
  required?: boolean;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  label,
  value,
  onChange,
  options,
  required = false
}) => {
  return (
    <div className="mb-5">
      <label className="block text-[0.85rem] font-semibold text-[#475569] mb-2">
        {label} {required && '*'}
      </label>
      <div className="flex bg-[#19191c] rounded-xl p-1 border border-white/8">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 py-2.5 px-3.5 rounded-lg text-[0.85rem] font-semibold text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
                  : 'bg-transparent text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ListPropertyTab: React.FC<ListPropertyTabProps> = ({
  user,
  userRole,
  editingProperty,
  onSaveSuccess,
  onCancel,
}) => {
  // Check if tenant
  if (userRole === 'tenant') {
    return (
      <div className="tabContent">
        <div className="emptyState" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="emptyIcon" style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Tenant Accounts Cannot List Properties</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            You are registered as a tenant. If you are a property owner or a broker, please change your profile type in the top right profile dropdown or settings to list properties.
          </p>
          <button className="emptyStateBtn" onClick={onCancel}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Form States (Aligned with SettleKar Mobile App list-property.js)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sqft, setSqft] = useState('500');
  const [available, setAvailable] = useState<boolean | null>(null);
  const [propertyType, setPropertyType] = useState('');
  const [isIndependent, setIsIndependent] = useState<boolean | null>(null);
  const [bachelorFriendly, setBachelorFriendly] = useState<boolean | null>(null);
  const [womenOnly, setWomenOnly] = useState<boolean | null>(null);
  const [isTopFloor, setIsTopFloor] = useState<boolean | null>(null);
  const [city, setCity] = useState<string>('Mumbai');
  const [locationStr, setLocationStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchingMap, setSearchingMap] = useState(false);
  const [locationWarning, setLocationWarning] = useState('');
  const [ownerName, setOwnerName] = useState(user.displayName || '');
  const [ownerContact, setOwnerContact] = useState('+91');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [indoorFiles, setIndoorFiles] = useState<File[]>([]);
  const [indoorPreviews, setIndoorPreviews] = useState<string[]>([]);
  const [outdoorFiles, setOutdoorFiles] = useState<File[]>([]);
  const [outdoorPreviews, setOutdoorPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  
  // New role-based financial fields
  const [securityFees, setSecurityFees] = useState('');
  const [advanceRentMonths, setAdvanceRentMonths] = useState<number>(1);
  const [brokerage, setBrokerage] = useState('');
  
  // Leaflet Map Picker States
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Neighborhood score States
  const [neighborhoodScore, setNeighborhoodScore] = useState<number | null>(null);
  const [neighborhoodPillars, setNeighborhoodPillars] = useState<any | null>(null);
  const [neighborhoodMeta, setNeighborhoodMeta] = useState<any | null>(null);
  const [neighborhoodConfidence, setNeighborhoodConfidence] = useState<any | null>(null);
  const [fetchingScore, setFetchingScore] = useState(false);
  const [isScoreFetched, setIsScoreFetched] = useState(false);
  const [scoreError, setScoreError] = useState('');

  const fetchNeighborhoodScore = async () => {
    if (!coords) {
      setScoreError('Please pin a location on the map first.');
      return;
    }
    setFetchingScore(true);
    setScoreError('');
    try {
      const apiKey = import.meta.env.VITE_LIVABLE_INDIA_API_KEY ;
      const url = `https://us-central1-liveableindia-314ce.cloudfunctions.net/getNeighborhoodScore?lat=${coords.lat}&lng=${coords.lng}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.overallScore !== undefined) {
        setNeighborhoodScore(data.overallScore);
        setNeighborhoodPillars(data.pillars);
        setNeighborhoodMeta(data.meta);
        setNeighborhoodConfidence(data.config || null);
        setIsScoreFetched(true);
      } else {
        throw new Error('Invalid response payload from neighborhood score API');
      }
    } catch (err: any) {
      console.error('Error fetching neighborhood score:', err);
      setScoreError(err.message || 'Failed to fetch neighborhood score. Please try again.');
      setIsScoreFetched(false);
    } finally {
      setFetchingScore(false);
    }
  };

  // Feedback States
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Helper to extract resolved city name from Nominatim address details
  const resolveCityFromAddress = (address: any): string => {
    if (!address) return 'Mumbai';
    const cityFields = [
      address.city,
      address.town,
      address.village,
      address.municipality,
      address.county,
      address.state_district,
      address.suburb
    ];

    for (const field of cityFields) {
      if (!field) continue;
      const fLower = field.toLowerCase();
      if (fLower.includes('mumbai') || fLower.includes('bombay') || fLower.includes('thane') || fLower.includes('navi mumbai')) {
        return 'Mumbai';
      }
      if (fLower.includes('bangalore') || fLower.includes('bengaluru')) {
        return 'Bangalore';
      }
      if (fLower.includes('pune') || fLower.includes('poona')) {
        return 'Pune';
      }
      
      // Return any other geocoded city name, capitalized nicely
      const cleanCity = field.replace(/(City|District)$/i, '').trim();
      if (cleanCity) {
        return cleanCity.charAt(0).toUpperCase() + cleanCity.slice(1);
      }
    }
    return address.state ? address.state.replace(/(State|Union Territory)$/i, '').trim() : 'Mumbai';
  };

  // 1. Initialize Leaflet map dynamically on mount
  useEffect(() => {
    const initMap = () => {
      const L = (window as any).L;
      if (!L || mapRef.current) return;

      const centers = {
        Mumbai: [19.0760, 72.8777] as [number, number],
        Bangalore: [12.9716, 77.5946] as [number, number],
        Pune: [18.5204, 73.8567] as [number, number]
      };
      // Center map on existing coordinates or default to Mumbai (primary service city)
      const center = coords ? [coords.lat, coords.lng] as [number, number] : centers.Mumbai;
      const zoom = coords ? 15 : 11;

      const map = L.map('map-picker').setView(center, zoom);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      if (coords) {
        const marker = L.marker([coords.lat, coords.lng]).addTo(map);
        markerRef.current = marker;
      }

      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lng });
        setIsScoreFetched(false);
        setNeighborhoodScore(null);
        setNeighborhoodPillars(null);
        setNeighborhoodMeta(null);
        setNeighborhoodConfidence(null);
        setScoreError('');
        setLocationWarning('');

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng]).addTo(map);
          markerRef.current = marker;
        }

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            const address = data.address;
            
            // Auto-resolve city
            const resolvedCity = resolveCityFromAddress(address);
            setCity(resolvedCity);

            const neighborhood = address.suburb || address.neighbourhood || address.residential || address.city_district || address.road || '';
            const shortAddr = neighborhood 
              ? `${neighborhood}, ${resolvedCity}` 
              : data.display_name.split(',').slice(0, 3).join(',').trim();
            
            setLocationStr(shortAddr);
            setSearchQuery(shortAddr);
          }
        } catch (err) {
          console.error('Error reverse geocoding:', err);
        }
      });
    };

    if (!(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setTimeout(initMap, 300);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(initMap, 100);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // 2. Populate form fields when editingProperty changes
  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      
      // Extract numeric rent price
      setPrice(editingProperty.price ? editingProperty.price.replace(/[^\d.]/g, '') : '');
      
      let parsedSqft = '500';
      let parsedFurnishing = 'Semi-Furnished';
      let parsedIndependent = false;

      if (editingProperty.features) {
        const parts = editingProperty.features.split('•');
        const sqftPart = parts.find(p => p.includes('sq.ft'));
        if (sqftPart) {
          parsedSqft = sqftPart.replace(/[^\d]/g, '').trim();
        }
        
        const furnPart = parts.find(p => p.includes('Furnished') || p.includes('Unfurnished'));
        if (furnPart) {
          parsedFurnishing = furnPart.trim();
        }

        parsedIndependent = editingProperty.features.includes('Independent');
      }

      setSqft(parsedSqft);
      setFurnishing(parsedFurnishing);
      setAvailable(editingProperty.available !== undefined ? editingProperty.available : null);
      setIsIndependent(editingProperty.isIndependent !== undefined ? editingProperty.isIndependent : parsedIndependent);
      setBachelorFriendly(editingProperty.bachelorFriendly !== undefined ? editingProperty.bachelorFriendly : null);
      setWomenOnly(editingProperty.womenOnly !== undefined ? editingProperty.womenOnly : null);
      setIsTopFloor(editingProperty.isTopFloor !== undefined ? editingProperty.isTopFloor : null);
      setPropertyType(editingProperty.badge || '');
      
      // Address & City
      setCity(editingProperty.city || 'Mumbai');
      setLocationStr(editingProperty.address || '');
      setSearchQuery(editingProperty.address || '');

      // Map pin Coordinates
      if (editingProperty.location && editingProperty.location.includes('q=')) {
        try {
          const coordsStr = editingProperty.location.split('q=')[1];
          const [cLat, cLng] = coordsStr.split(',');
          const lat = parseFloat(cLat);
          const lng = parseFloat(cLng);
          setCoords({ lat, lng });

          // Move active Leaflet marker if map is initialized
          const L = (window as any).L;
          if (L && mapRef.current) {
            mapRef.current.setView([lat, lng], 15);
            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng]);
            } else {
              const marker = L.marker([lat, lng]).addTo(mapRef.current);
              markerRef.current = marker;
            }
          }
        } catch (e) {
          console.error("Error parsing coords on edit:", e);
        }
      } else {
        setCoords(null);
      }

      // Preserve images
      setIndoorPreviews(editingProperty.indoorImages || (editingProperty.image ? [editingProperty.image] : []));
      setOutdoorPreviews(editingProperty.outdoorImages || []);
      setIndoorFiles([]);
      setOutdoorFiles([]);

      // Populate financial fields
      setSecurityFees(editingProperty.securityFees !== undefined ? editingProperty.securityFees.toString() : '');
      setAdvanceRentMonths(editingProperty.advanceRentMonths !== undefined ? editingProperty.advanceRentMonths : 1);
      setBrokerage(editingProperty.brokerage !== undefined ? editingProperty.brokerage.toString() : '');

      // Populate neighborhood score fields
      const dbScore = editingProperty.overallscore ;
      const dbPillars = editingProperty.pillars;
      const dbMeta = editingProperty.meta ;
      const dbConfidence = editingProperty.confidence ;

      setNeighborhoodScore(dbScore !== undefined ? dbScore : null);
      setNeighborhoodPillars(dbPillars);
      setNeighborhoodMeta(dbMeta);
      setNeighborhoodConfidence(dbConfidence);
      setIsScoreFetched(dbScore !== undefined && dbScore !== null);
      setScoreError('');
    } else {
      // Clear form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setSqft('500');
      setAvailable(null);
      setPropertyType('');
      setIsIndependent(null);
      setBachelorFriendly(null);
      setWomenOnly(null);
      setIsTopFloor(null);
      setLocationStr('');
      setSearchQuery('');
      setLocationWarning('');
      setCoords(null);
      setIndoorFiles([]);
      setIndoorPreviews([]);
      setOutdoorFiles([]);
      setOutdoorPreviews([]);

      // Reset financial fields
      setSecurityFees('');
      setAdvanceRentMonths(1);
      setBrokerage('');

      // Reset neighborhood score fields
      setNeighborhoodScore(null);
      setNeighborhoodPillars(null);
      setNeighborhoodMeta(null);
      setNeighborhoodConfidence(null);
      setIsScoreFetched(false);
      setScoreError('');
    }
  }, [editingProperty]);

  // Fetch current GPS location and update Leaflet map picker
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setIsScoreFetched(false);
        setNeighborhoodScore(null);
        setNeighborhoodPillars(null);
        setNeighborhoodMeta(null);
        setScoreError('');
        setLocationWarning('');

        const L = (window as any).L;
        if (L && mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);

          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
            markerRef.current = marker;
          }
        }

        // Reverse geocode to get neighborhood string
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          if (data && data.display_name) {
            const address = data.address;
            
            // Auto-resolve city
            const resolvedCity = resolveCityFromAddress(address);
            setCity(resolvedCity);

            const neighborhood = address.suburb || address.neighbourhood || address.residential || address.city_district || address.road || '';
            const shortAddr = neighborhood 
              ? `${neighborhood}, ${resolvedCity}` 
              : data.display_name.split(',').slice(0, 3).join(',').trim();
            
            setLocationStr(shortAddr);
            setSearchQuery(shortAddr);
          }
        } catch (err) {
          console.error('Error reverse geocoding:', err);
        }
      },
      (error) => {
        console.error('Error getting geolocation:', error);
        alert('Could not retrieve your current location. Please verify device location settings and browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Search location by address using Nominatim geocoder API
  const handleMapSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchingMap(true);
    setLocationWarning('');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&addressdetails=1&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name, address } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        setCoords({ lat: latitude, lng: longitude });
        setIsScoreFetched(false);
        setNeighborhoodScore(null);
        setNeighborhoodPillars(null);
        setNeighborhoodMeta(null);
        setNeighborhoodConfidence(null);
        setScoreError('');

        const L = (window as any).L;
        if (L && mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);

          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
            markerRef.current = marker;
          }
        }

        // Auto-resolve city
        const resolvedCity = resolveCityFromAddress(address);
        setCity(resolvedCity);

        // Auto-fill neighborhood field
        const neighborhood = address.suburb || address.neighbourhood || address.residential || address.city_district || address.road || '';
        const shortAddr = neighborhood 
          ? `${neighborhood}, ${resolvedCity}` 
          : display_name.split(',').slice(0, 3).join(',').trim();
        
        setLocationStr(shortAddr);
        setSearchQuery(shortAddr);
      } else {
        alert(`Location "${searchQuery}" not found. Please try a different landmark or street name.`);
      }
    } catch (err) {
      console.error('Error searching location on map:', err);
      alert('Error searching for location. Please try again.');
    } finally {
      setSearchingMap(false);
    }
  };

  const handleIndoorFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setIndoorFiles(prev => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setIndoorPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleOutdoorFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setOutdoorFiles(prev => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setOutdoorPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeIndoorImage = (indexToRemove: number) => {
    setIndoorFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setIndoorPreviews(prev => {
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const removeOutdoorImage = (indexToRemove: number) => {
    setOutdoorFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setOutdoorPreviews(prev => {
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // Form Submission
  const handleListProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationStr || !price || !propertyType || available === null || isIndependent === null || bachelorFriendly === null || womenOnly === null || isTopFloor === null) {
      setFormError('Please fill in all required fields (*), including all property details.');
      return;
    }

    if (coords && !isScoreFetched) {
      setFormError('Please fetch the neighborhood score for the pinned location first.');
      return;
    }

    setFormError('');
    setFormSuccess(false);
    setUploadProgress(false);

    try {
      // Parse numeric rent price matching mobile app parseFloat(price)
      const parsedPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0;
      let displayPriceString = `₹${parsedPrice.toLocaleString('en-IN')}`;

      // Financial calculations
      const parsedSecurity = parseFloat(securityFees.replace(/[^\d.]/g, '')) || 0;
      const parsedBrokerage = userRole === 'broker' ? (parseFloat(brokerage.replace(/[^\d.]/g, '')) || 0) : 0;
      const calculatedTotalAdvance = (advanceRentMonths * parsedPrice) + parsedSecurity + parsedBrokerage;

      // Generate property features string
      const featuresStr = `${propertyType} • ${sqft} sq.ft • ${furnishing}`;

      // Base payload with default placeholder images
      const placeholderImg = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';

      // Format Google Maps coordinate link for mobile app compatibility
      const mapsLink = coords 
        ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
        : `https://www.google.com/maps?q=${city === 'Mumbai' ? '19.0760,72.8777' : city === 'Bangalore' ? '12.9716,77.5946' : '18.5204,73.8567'}`;

      const finalPropertyPayload = {
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        location: mapsLink,
        address: locationStr.trim(),
        available,
        propertyType,
        isIndependent,
        bachelorFriendly,
        womenOnly,
        isTopFloor,
        ownerName: ownerName.trim() || user.displayName || 'Verified Owner',
        ownerContact: ownerContact.trim(),
        ownerProfilePhoto: user.photoURL || '',
        area: parseInt(sqft) || 0,
        createdBy: user.uid,
        createdAt: new Date(),
        status: 'Available',
        furnishing,
        image: placeholderImg,
        images: [] as string[],
        indoorImages: [] as string[],
        outdoorImages: [] as string[],
        city,
        badge: propertyType,
        features: featuresStr,
        rating: '5.0',
        securityFees: parsedSecurity,
        advanceRentMonths,
        brokerage: parsedBrokerage,
        totalAdvance: calculatedTotalAdvance,
        listedByRole: userRole,
        overallscore: neighborhoodScore !== null ? neighborhoodScore : null,
        pillars: neighborhoodPillars || null,
        meta: neighborhoodMeta || null,
        confidence: neighborhoodConfidence || null,
        keywords: [
          title.toLowerCase(),
          propertyType.toLowerCase(),
          isIndependent ? 'independent' : '',
          available ? 'available' : '',
          bachelorFriendly ? 'bachelor friendly' : '',
          womenOnly ? 'women only' : '',
          isTopFloor ? 'top floor' : '',
          ...title.toLowerCase().split(' '),
          ...propertyType.toLowerCase().split(' ')
        ].filter((keyword, idx, arr) => 
          keyword.length > 2 && arr.indexOf(keyword) === idx
        )
      };

      // 1. EDIT MODE
      if (editingProperty) {
        const editingPropId = editingProperty.id.toString();
        setUploadProgress(true);

        // Identify deleted images
        const originalIndoor = editingProperty.indoorImages || [];
        const originalOutdoor = editingProperty.outdoorImages || [];
        const deletedIndoor = originalIndoor.filter(url => !indoorPreviews.includes(url));
        const deletedOutdoor = originalOutdoor.filter(url => !outdoorPreviews.includes(url));
        const imagesToDelete = [...deletedIndoor, ...deletedOutdoor];

        // Prepare base payload
        const updatePayload = {
          title: title.trim(),
          description: description.trim(),
          price: parsedPrice,
          location: mapsLink,
          address: locationStr.trim(),
          available,
          propertyType,
          isIndependent,
          bachelorFriendly,
          womenOnly,
          isTopFloor,
          ownerName: ownerName.trim() || user.displayName || 'Verified Owner',
          ownerContact: ownerContact.trim(),
          area: parseInt(sqft) || 0,
          furnishing,
          city,
          badge: propertyType,
          features: featuresStr,
          securityFees: parsedSecurity,
          advanceRentMonths,
          brokerage: parsedBrokerage,
          totalAdvance: calculatedTotalAdvance,
          listedByRole: userRole,
          overallscore: neighborhoodScore !== null ? neighborhoodScore : null,
          pillars: neighborhoodPillars || null,
          meta: neighborhoodMeta || null,
          confidence: neighborhoodConfidence || null,
          // Pass existing images so the service knows what to keep
          indoorImages: originalIndoor.filter(url => !imagesToDelete.includes(url)),
          outdoorImages: originalOutdoor.filter(url => !imagesToDelete.includes(url))
        };

        // Update using propertyService
        await propertyService.updateProperty(
          editingPropId,
          updatePayload,
          indoorFiles,
          outdoorFiles,
          imagesToDelete
        );

        // Retrieve full updated property from Firestore to get final image URLs
        const updatedProp = await propertyService.getPropertyById(editingPropId);

        const updatedPropItem: PropertyItem = {
          id: editingPropId,
          title: updatedProp.title,
          city: updatedProp.city,
          location: updatedProp.location,
          address: updatedProp.address,
          price: displayPriceString,
          rating: editingProperty.rating,
          badge: updatedProp.badge,
          features: updatedProp.features,
          image: updatedProp.image,
          indoorImages: updatedProp.indoorImages || [],
          outdoorImages: updatedProp.outdoorImages || [],
          isUserAdded: true,
          securityFees: updatedProp.securityFees,
          advanceRentMonths: updatedProp.advanceRentMonths,
          brokerage: updatedProp.brokerage,
          totalAdvance: updatedProp.totalAdvance,
          listedByRole: updatedProp.listedByRole,
          description: updatedProp.description,
          overallscore: updatedProp.overallscore !== null ? updatedProp.overallscore : undefined,
          pillars: updatedProp.pillars || undefined,
          meta: updatedProp.meta || undefined,
          confidence: updatedProp.confidence || undefined,
          available: updatedProp.available,
          isIndependent: updatedProp.isIndependent,
          bachelorFriendly: updatedProp.bachelorFriendly,
          womenOnly: updatedProp.womenOnly,
          isTopFloor: updatedProp.isTopFloor
        };

        onSaveSuccess(updatedPropItem, true);
      } else {
        // 2. CREATE MODE (Post New Property)
        setUploadProgress(true);
        const addedProp = await propertyService.addProperty(finalPropertyPayload, indoorFiles, outdoorFiles);

        const newPropItem: PropertyItem = {
          id: addedProp.id,
          title: addedProp.title,
          city: addedProp.city,
          location: addedProp.location,
          address: addedProp.address,
          price: displayPriceString,
          rating: addedProp.rating,
          badge: addedProp.badge,
          features: addedProp.features,
          image: addedProp.image,
          isUserAdded: true,
          indoorImages: addedProp.indoorImages || [],
          outdoorImages: addedProp.outdoorImages || [],
          securityFees: addedProp.securityFees,
          advanceRentMonths: addedProp.advanceRentMonths,
          brokerage: addedProp.brokerage,
          totalAdvance: addedProp.totalAdvance,
          listedByRole: addedProp.listedByRole,
          description: addedProp.description,
          overallscore: addedProp.overallscore !== null ? addedProp.overallscore : undefined,
          pillars: addedProp.pillars || undefined,
          meta: addedProp.meta || undefined,
          confidence: addedProp.confidence || undefined,
          available: addedProp.available,
          isIndependent: addedProp.isIndependent,
          bachelorFriendly: addedProp.bachelorFriendly,
          womenOnly: addedProp.womenOnly,
          isTopFloor: addedProp.isTopFloor
        };

        onSaveSuccess(newPropItem, false);
      }

      setFormSuccess(true);
      setUploadProgress(false);
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setSqft('500');
      setAvailable(true);
      setPropertyType('1 BHK');
      setIsIndependent(false);
      setLocationStr('');
      setSearchQuery('');
      setLocationWarning('');
      setCoords(null);
      setIndoorFiles([]);
      setIndoorPreviews([]);
      setOutdoorFiles([]);
      setOutdoorPreviews([]);

      // Redirect to properties tab after showing message
      setTimeout(() => {
        setFormSuccess(false);
        onCancel();
      }, 1500);

    } catch (err) {
      console.error('Firestore save error:', err);
      setFormError('Could not save property to Firebase. Please try again.');
      setUploadProgress(false);
    }
  };

  // Derive numeric values for calculations
  const parsedPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0;
  const parsedSecurity = parseFloat(securityFees.replace(/[^\d.]/g, '')) || 0;
  const parsedBrokerage = userRole === 'broker' ? (parseFloat(brokerage.replace(/[^\d.]/g, '')) || 0) : 0;
  const calculatedTotalAdvance = (advanceRentMonths * parsedPrice) + parsedSecurity + parsedBrokerage;

  return (
    <div className="tabContent">
      <div className="listHeaderWrapper">
        <h2>{editingProperty ? '✏️ Edit Listed Property' : 'List Property'}</h2>
        <p>{editingProperty ? 'Modify and update your listed property configurations inside the live database.' : 'Register your property directly on the SettleKar database live, matching native app configurations.'}</p>
      </div>

      {formSuccess && (
        <div className="formSuccessMsg">
          🎉 Property {editingProperty ? 'Updated' : 'Listed'} Successfully! Redirecting to My Listings...
        </div>
      )}

      {formError && <div className="formErrorMsg">{formError}</div>}

      <form onSubmit={handleListProperty} className="listingForm">
        
        {/* CARD 1: Basic Information */}
        <div className="appCard">
          <div className="appCardHeader">
            <span className="appCardIcon">🏠</span>
            <h3 className="appCardTitle">Basic Information</h3>
          </div>

          <div className="formGroup">
            <label htmlFor="prop-title">Property Title *</label>
            <input
              id="prop-title"
              type="text"
              placeholder="e.g. Modern 1 BHK Apartment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="prop-desc">Description</label>
            <textarea
              id="prop-desc"
              placeholder="Property highlights (each new line will automatically become a bullet point)"
              value={description}
              onChange={(e) => {
                const text = e.target.value;
                const formatted = text
                  .split('\n')
                  .map((line) => line.startsWith('•') ? line : (line.trim() ? `• ${line}` : ''))
                  .join('\n');
                setDescription(formatted);
              }}
              rows={5}
            />
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="prop-price">Rent Per Month *</label>
              <input
                id="prop-price"
                type="text"
                placeholder="e.g. 20000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="prop-sqft">Area (sq ft)</label>
              <input
                id="prop-sqft"
                type="number"
                placeholder="500"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CARD 1.5: Financial Details */}
        <div className="appCard">
          <div className="appCardHeader">
            <span className="appCardIcon">💰</span>
            <h3 className="appCardTitle">Financial Details ({userRole === 'broker' ? 'Broker' : userRole === 'firm' ? 'Firm' : 'Owner'})</h3>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="prop-security">Security Deposit / Fees (₹) *</label>
              <input
                id="prop-security"
                type="text"
                placeholder="e.g. 40000"
                value={securityFees}
                onChange={(e) => setSecurityFees(e.target.value)}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="prop-advance-months">Advance Rent (Months) *</label>
              <select
                id="prop-advance-months"
                value={advanceRentMonths}
                onChange={(e) => setAdvanceRentMonths(parseInt(e.target.value))}
                required
              >
                <option value={1}>1 Month Rent</option>
                <option value={2}>2 Months Rent</option>
              </select>
            </div>
          </div>

          {userRole === 'broker' && (
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="prop-brokerage">Brokerage Fees (₹) *</label>
                <input
                  id="prop-brokerage"
                  type="text"
                  placeholder="e.g. 10000"
                  value={brokerage}
                  onChange={(e) => setBrokerage(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Real-time Calculated Total Advance Panel */}
          <div className="financialSummaryCard">
            <div className="financialSummaryHeader">
              <span>Calculated Total Advance</span>
              <strong>₹{calculatedTotalAdvance.toLocaleString('en-IN')}</strong>
            </div>
            <div className="financialSummaryFormula">
              Formula: ({advanceRentMonths} × Rent [₹{(parsedPrice || 0).toLocaleString('en-IN')}]) + Security [₹{(parsedSecurity || 0).toLocaleString('en-IN')}] {userRole === 'broker' ? `+ Brokerage [₹${(parsedBrokerage || 0).toLocaleString('en-IN')}]` : ''}
            </div>
          </div>
        </div>

        {/* CARD 2: Property Details */}
        <div className="appCard">
          <div className="appCardHeader">
            <span className="appCardIcon">⚙️</span>
            <h3 className="appCardTitle">Property Details</h3>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="prop-type">Property Type *</label>
              <select
                id="prop-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
              >
                <option value="">Select Property Type *</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Studio">Studio</option>
                <option value="PG">PG</option>
                <option value="Shop">Shop</option>
              </select>
            </div>

            <div className="formGroup">
              <label htmlFor="prop-furnish">Furnishing Status</label>
              <select
                id="prop-furnish"
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
              >
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Furnished">Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-2.5 ">
            <SegmentedControl
              label="Available for Rent"
              value={available}
              onChange={setAvailable}
              options={[
                { label: 'Available', value: true },
                { label: 'Not Available', value: false }
              ]}
              required
            />

            <SegmentedControl
              label="Independent Property"
              value={isIndependent}
              onChange={setIsIndependent}
              options={[
                { label: 'Independent', value: true },
                { label: 'Shared', value: false }
              ]}
              required
            />

            <SegmentedControl
              label="Bachelor Friendly"
              value={bachelorFriendly}
              onChange={setBachelorFriendly}
              options={[
                { label: 'Bachelor Friendly', value: true },
                { label: 'Family Only', value: false }
              ]}
              required
            />

            <SegmentedControl
              label="Women Only"
              value={womenOnly}
              onChange={setWomenOnly}
              options={[
                { label: 'Women Only', value: true },
                { label: 'Open to All', value: false }
              ]}
              required
            />

            <SegmentedControl
              label="Is Top Floor"
              value={isTopFloor}
              onChange={setIsTopFloor}
              options={[
                { label: 'Top Floor', value: true },
                { label: 'Other Floor', value: false }
              ]}
              required
            />
          </div>
        </div>

        {/* CARD 3: Location Details */}
        <div className="appCard">
          <div className="appCardHeader">
            <span className="appCardIcon">📍</span>
            <h3 className="appCardTitle">Property Location</h3>
          </div>

          {/* Single Search Location Input */}
          <div className="formRow">
            <div className={`formGroup flex-1`}>
              <label htmlFor="prop-search-loc">Search Property Location *</label>
              <div className="mapSearchRow">
                <input
                  id="prop-search-loc"
                  type="text"
                  className="mapSearchInput"
                  placeholder="e.g. Phoenix Marketcity Pune or Indiranagar Bangalore"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleMapSearch();
                    }
                  }}
                  required
                />
                <button
                  type="button"
                  className="mapSearchBtn"
                  onClick={() => handleMapSearch()}
                  disabled={searchingMap}
                >
                  {searchingMap ? 'Searching...' : '🔍 Search'}
                </button>
              </div>
            </div>
          </div>

          {locationWarning && (
            <div className="bg-red-500/8 border border-red-500/15 text-red-500 py-2.5 px-3.5 rounded-lg text-[0.85rem] font-semibold mb-4 flex items-center gap-2">
              {locationWarning}
            </div>
          )}

          {coords && (
            <div className="bg-green-500/8 border border-green-500/15 text-green-600 py-2.5 px-3.5 rounded-lg text-[0.85rem] font-semibold mb-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span>✅ Resolved Location:</span>
                <strong>{locationStr || 'Unknown location'}</strong>
              </div>
              <div className="text-[0.8rem] opacity-85">
                City Group: <strong>{city}</strong> | Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </div>
            </div>
          )}

          <div className="formGroup" style={{ marginTop: '5px' }}>
            <label className="flex justify-between items-center mb-2 flex-wrap gap-2">
              <span>Select/Adjust on Map *</span>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={getCurrentLocation}
                  className="bg-blue-600/8 text-blue-600 border border-blue-600/15 rounded-lg py-1.5 px-3 text-[0.8rem] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-200"
                >
                  📍 Use My Location
                </button>
                <span className="uploadSubtitle">
                  {coords ? `📌 Pinned: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : '⚠️ No location pinned yet'}
                </span>
              </div>
            </label>
            <div 
              id="map-picker" 
              className="h-[320px] w-full rounded-2xl border border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative z-1"
            ></div>
            <span className={`uploadSubtitle mt-2 block italic`}>
              💡 Search above or click on the map to pin your property. SettleKar will reverse-geocode your pin and auto-fill the search bar!
            </span>

            {/* Neighborhood Score Section */}
            {/* Neighborhood Score Section */}
            <div className="mt-5 border-t border-dashed border-white/8 pt-3.5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="uploadSubtitle">
                  {isScoreFetched 
                    ? '✅ Neighborhood rating successfully loaded.' 
                    : coords 
                      ? '⚠️ Neighborhood score not fetched yet.' 
                      : '📍 Select coordinates on the map first.'}
                </span>
                <button
                  type="button"
                  className={`scoreFetchBtn ${isScoreFetched ? 'scoreFetchBtnSuccess' : ''}`}
                  onClick={fetchNeighborhoodScore}
                  disabled={!coords || fetchingScore}
                >
                  {fetchingScore 
                    ? '⚡ Fetching Score...' 
                    : isScoreFetched 
                      ? '🔄 Refresh Neighborhood Score' 
                      : '🔍 Fetch Neighborhood Score'}
                </button>
              </div>

              {scoreError && (
                <div className="bg-red-500/8 border border-red-500/15 text-red-500 py-2.5 px-3.5 rounded-lg text-[0.85rem] font-semibold mt-3">
                  ❌ {scoreError}
                </div>
              )}

              {fetchingScore && (
                <div className="text-center py-7 px-5 text-slate-400">
                  <div className="inline-block w-7.5 h-7.5 border-3 border-slate-800/10 border-t-primary rounded-full animate-spin mb-3"></div>
                  <p className="text-[0.9rem] m-0">Querying LivableIndia APIs and mapping compound neighborhood pillars...</p>
                </div>
              )}

              {!fetchingScore && isScoreFetched && neighborhoodScore !== null && (
                <div className="scoreCard">
                  <div className="scoreHeader">
                    <div className="scoreBadgeContainer">
                      <span className="overallScoreLabel">LIVABILITY SCORE</span>
                      <span className="overallScoreValue">{neighborhoodScore}/100</span>
                      <span className={`scoreIndicatorBadge ${
                        neighborhoodScore >= 80 
                          ? 'scoreBadgeHigh' 
                          : neighborhoodScore >= 60 
                            ? 'scoreBadgeMedium' 
                            : 'scoreBadgeLow'
                      }`}>
                        {neighborhoodScore >= 80 ? '🟢 Excellent' : neighborhoodScore >= 60 ? '🟡 Moderate' : '🔴 Poor'} Livability
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                      Data source: <strong>LivableIndia API</strong>
                    </div>
                  </div>

                  {neighborhoodPillars && (
                    <div className="scorePillarsGrid">
                      {Object.entries(neighborhoodPillars).map(([key, value]: [string, any]) => {
                        const emojis: Record<string, string> = {
                          water: '💧',
                          power: '⚡',
                          safety: '🛡️',
                          sanitation: '🧹',
                          climate: '☁️',
                          healthcare: '🏥',
                          air: '💨',
                          transit: '🚇',
                          greenery: '🌲',
                          grocery: '🛒',
                          dining: '🍔'
                        };
                        const scoreColorClass = value.score >= 80 
                          ? 'scoreTextGreen' 
                          : value.score >= 60 
                            ? 'scoreTextOrange' 
                            : 'scoreTextRed';
                        return (
                          <div key={key} className="scorePillarCard">
                            <div className="pillarHeader">
                              <span className="pillarName">
                                {emojis[key] || '📍'} {key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                              <span className={`pillarScore ${scoreColorClass}`}>
                                {value.score}
                              </span>
                            </div>
                            <div className="pillarCategory">{value.category}</div>
                            <div className="pillarCategory">{value.geography}</div>
                            <div className="pillarDesc">{value.description}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD 4: Owner Details */}
        <div className="appCard">
          <div className="appCardHeader">
            <span className="appCardIcon">👤</span>
            <h3 className="appCardTitle">Owner Details</h3>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="prop-owner-name">Owner Name *</label>
              <input
                id="prop-owner-name"
                type="text"
                placeholder="Full Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="prop-owner-contact">Owner Contact Number *</label>
              <input
                id="prop-owner-contact"
                type="tel"
                placeholder="+91 98765 43210"
                value={ownerContact}
                onChange={(e) => {
                  let text = e.target.value;
                  if (!text.startsWith("+91")) {
                    text = "+91" + text.replace(/^\+91/, "");
                  }
                  setOwnerContact(text.substring(0, 13));
                }}
                maxLength={13}
                required
              />
            </div>
          </div>
        </div>

        {/* CARD 5: Property Images */}
        <div className="appCard">
          <div className="appCardHeader">
            <span className="appCardIcon">🖼️</span>
            <h3 className="appCardTitle">Property Images</h3>
          </div>

          <div className="multiUploadContainer">
            {/* 1. Indoor Images Section */}
            <div className="formGroup">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Indoor Images</span>
                <span className="uploadSubtitle">{indoorFiles.length} selected</span>
              </label>
              
              <div className="fileUploadZone">
                <input
                  type="file"
                  id="prop-indoor-upload"
                  accept="image/*"
                  multiple
                  onChange={handleIndoorFilesChange}
                  className="fileInputHidden"
                />
                <label htmlFor="prop-indoor-upload" className="fileUploadLabel">
                  <div className="uploadPlaceholder">
                    <span className="uploadIcon">🚪</span>
                    <span className="uploadTitle">Choose Indoor Images</span>
                    <span className="uploadSubtitle">Upload multiple photos of rooms, kitchen, washrooms</span>
                  </div>
                </label>
              </div>

              {indoorPreviews.length > 0 && (
                <div className="previewsGrid">
                  {indoorPreviews.map((preview, idx) => (
                    <div key={`indoor-pre-${idx}`} className="previewThumbWrapper">
                      <img src={preview} alt={`Indoor preview ${idx + 1}`} className="previewThumb" />
                      <button
                        type="button"
                        className="deleteThumbBtn"
                        onClick={() => removeIndoorImage(idx)}
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Outdoor Images Section */}
            <div className="formGroup">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Outdoor/Surrounding Images</span>
                <span className="uploadSubtitle">{outdoorFiles.length} selected</span>
              </label>
              
              <div className="fileUploadZone">
                <input
                  type="file"
                  id="prop-outdoor-upload"
                  accept="image/*"
                  multiple
                  onChange={handleOutdoorFilesChange}
                  className="fileInputHidden"
                />
                <label htmlFor="prop-outdoor-upload" className="fileUploadLabel">
                  <div className="uploadPlaceholder">
                    <span className="uploadIcon">🌳</span>
                    <span className="uploadTitle">Choose Outdoor Images</span>
                    <span className="uploadSubtitle">Upload photos of society, entry gate, surroundings, or building front</span>
                  </div>
                </label>
              </div>

              {outdoorPreviews.length > 0 && (
                <div className="previewsGrid">
                  {outdoorPreviews.map((preview, idx) => (
                    <div key={`outdoor-pre-${idx}`} className="previewThumbWrapper">
                      <img src={preview} alt={`Outdoor preview ${idx + 1}`} className="previewThumb" />
                      <button
                        type="button"
                        className="deleteThumbBtn"
                        onClick={() => removeOutdoorImage(idx)}
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {coords && !isScoreFetched && (
          <div className="scoreValidationWarning">
            ⚠️ <strong>Action Required:</strong> Please click "Fetch Neighborhood Score" in the Location Details card above before publishing.
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button 
            type="submit" 
            className="submitFormBtn" 
            disabled={formSuccess || uploadProgress || (coords !== null && !isScoreFetched)} 
            style={{ flex: 1 }}
          >
            {uploadProgress 
              ? '📤 Uploading Images to Storage...' 
              : (formSuccess 
                  ? (editingProperty ? 'Saving Changes...' : 'Publishing Listing...') 
                  : (editingProperty ? '💾 Save Changes & Update' : '➕ Publish Property Listing'))}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListPropertyTab;
