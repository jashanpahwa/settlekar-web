import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../firebase';
import { User } from 'firebase/auth';
import { collection, addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PropertyItem } from './types';
import styles from '../../Dashboard.module.css';

interface ListPropertyTabProps {
  user: User;
  userRole: 'broker' | 'owner' | 'firm' | 'tenant';
  editingProperty: PropertyItem | null;
  onSaveSuccess: (updatedOrNewProp: PropertyItem, isEdit: boolean) => void;
  onCancel: () => void;
}

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
      <div className={styles.tabContent}>
        <div className={styles.emptyState} style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className={styles.emptyIcon} style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Tenant Accounts Cannot List Properties</h2>
          <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            You are registered as a tenant. If you are a property owner or a broker, please change your profile type in the top right profile dropdown or settings to list properties.
          </p>
          <button className={styles.emptyStateBtn} onClick={onCancel}>
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
  const [available, setAvailable] = useState(true);
  const [propertyType, setPropertyType] = useState('1 BHK');
  const [isIndependent, setIsIndependent] = useState(false);
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
      setIsIndependent(parsedIndependent);
      setPropertyType(editingProperty.badge || '1 BHK');
      
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
    if (!title || !locationStr || !price) {
      setFormError('Please fill in all required fields (*).');
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
        ownerName: ownerName.trim() || user.displayName || 'Verified Owner',
        ownerContact: ownerContact.trim(),
        ownerProfilePhoto: user.photoURL || '',
        area: parseInt(sqft) || 0,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
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
          ...title.toLowerCase().split(' '),
          ...propertyType.toLowerCase().split(' ')
        ].filter((keyword, idx, arr) => 
          keyword.length > 2 && arr.indexOf(keyword) === idx
        )
      };

      let finalImageUrl = placeholderImg;
      let finalIndoorUrls: string[] = [];
      let finalOutdoorUrls: string[] = [];

      // 1. EDIT MODE
      if (editingProperty) {
        const editingPropId = editingProperty.id.toString();
        setUploadProgress(true);

        // Preserve already uploaded indoor images (non-blobs)
        finalIndoorUrls = [...indoorPreviews.filter(url => !url.startsWith('blob:') && !url.startsWith('data:'))];
        if (indoorFiles.length > 0) {
          const uploadPromises = indoorFiles.map(async (file, idx) => {
            const storageRef = ref(storage, `properties/${editingPropId}/indoor_${idx}_${Date.now()}`);
            const uploadResult = await uploadBytes(storageRef, file);
            return getDownloadURL(uploadResult.ref);
          });
          const newUrls = await Promise.all(uploadPromises);
          finalIndoorUrls = [...finalIndoorUrls, ...newUrls];
        }

        // Preserve already uploaded outdoor images
        finalOutdoorUrls = [...outdoorPreviews.filter(url => !url.startsWith('blob:') && !url.startsWith('data:'))];
        if (outdoorFiles.length > 0) {
          const uploadPromises = outdoorFiles.map(async (file, idx) => {
            const storageRef = ref(storage, `properties/${editingPropId}/outdoor_${idx}_${Date.now()}`);
            const uploadResult = await uploadBytes(storageRef, file);
            return getDownloadURL(uploadResult.ref);
          });
          const newUrls = await Promise.all(uploadPromises);
          finalOutdoorUrls = [...finalOutdoorUrls, ...newUrls];
        }

        const combinedUrls = [...finalIndoorUrls, ...finalOutdoorUrls];
        finalImageUrl = combinedUrls[0] || placeholderImg;

        const updatePayload = {
          title: title.trim(),
          description: description.trim(),
          price: parsedPrice,
          location: mapsLink,
          address: locationStr.trim(),
          available,
          propertyType,
          isIndependent,
          ownerName: ownerName.trim() || user.displayName || 'Verified Owner',
          ownerContact: ownerContact.trim(),
          area: parseInt(sqft) || 0,
          furnishing,
          image: finalImageUrl,
          images: combinedUrls,
          indoorImages: finalIndoorUrls,
          outdoorImages: finalOutdoorUrls,
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
          confidence: neighborhoodConfidence || null
        };

        // Update Firestore document
        await updateDoc(doc(db, 'properties', editingPropId), updatePayload);

        const updatedPropItem: PropertyItem = {
          id: editingPropId,
          title: updatePayload.title,
          city: updatePayload.city,
          location: updatePayload.location,
          address: updatePayload.address,
          price: displayPriceString,
          rating: editingProperty.rating,
          badge: updatePayload.badge,
          features: updatePayload.features,
          image: finalImageUrl,
          indoorImages: finalIndoorUrls,
          outdoorImages: finalOutdoorUrls,
          isUserAdded: true,
          securityFees: parsedSecurity,
          advanceRentMonths,
          brokerage: parsedBrokerage,
          totalAdvance: calculatedTotalAdvance,
          listedByRole: userRole,
          description: updatePayload.description,
          overallscore: neighborhoodScore !== null ? neighborhoodScore : undefined,
          pillars: neighborhoodPillars || undefined,
          meta: neighborhoodMeta || undefined,
          confidence: neighborhoodConfidence || undefined
        };

        onSaveSuccess(updatedPropItem, true);
      } else {
        // 2. CREATE MODE (Post New Property)
        const docRef = await addDoc(collection(db, 'properties'), finalPropertyPayload);

        if (indoorFiles.length > 0 || outdoorFiles.length > 0) {
          setUploadProgress(true);

          // Upload Indoor Images
          if (indoorFiles.length > 0) {
            const indoorPromises = indoorFiles.map(async (file, idx) => {
              const storageRef = ref(storage, `properties/${docRef.id}/indoor_${idx}_${Date.now()}`);
              const uploadResult = await uploadBytes(storageRef, file);
              return getDownloadURL(uploadResult.ref);
            });
            finalIndoorUrls = await Promise.all(indoorPromises);
          }

          // Upload Outdoor Images
          if (outdoorFiles.length > 0) {
            const outdoorPromises = outdoorFiles.map(async (file, idx) => {
              const storageRef = ref(storage, `properties/${docRef.id}/outdoor_${idx}_${Date.now()}`);
              const uploadResult = await uploadBytes(storageRef, file);
              return getDownloadURL(uploadResult.ref);
            });
            finalOutdoorUrls = await Promise.all(outdoorPromises);
          }

          const combinedUrls = [...finalIndoorUrls, ...finalOutdoorUrls];
          if (combinedUrls.length > 0) {
            finalImageUrl = combinedUrls[0];
          }

          // Update Firestore document with all uploaded image URLs
          await updateDoc(doc(db, 'properties', docRef.id), {
            image: finalImageUrl,
            images: combinedUrls,
            indoorImages: finalIndoorUrls,
            outdoorImages: finalOutdoorUrls
          });
        }

        const newPropItem: PropertyItem = {
          id: docRef.id,
          title: finalPropertyPayload.title,
          city: finalPropertyPayload.city,
          location: finalPropertyPayload.location,
          address: finalPropertyPayload.address,
          price: displayPriceString,
          rating: finalPropertyPayload.rating,
          badge: finalPropertyPayload.badge,
          features: finalPropertyPayload.features,
          image: finalImageUrl,
          isUserAdded: true,
          indoorImages: finalIndoorUrls,
          outdoorImages: finalOutdoorUrls,
          securityFees: parsedSecurity,
          advanceRentMonths,
          brokerage: parsedBrokerage,
          totalAdvance: calculatedTotalAdvance,
          listedByRole: userRole,
          description: finalPropertyPayload.description,
          overallscore: neighborhoodScore !== null ? neighborhoodScore : undefined,
          pillars: neighborhoodPillars || undefined,
          meta: neighborhoodMeta || undefined,
          confidence: neighborhoodConfidence || undefined
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
    <div className={styles.tabContent}>
      <div className={styles.listHeaderWrapper}>
        <h2>{editingProperty ? '✏️ Edit Listed Property' : 'List Property'}</h2>
        <p>{editingProperty ? 'Modify and update your listed property configurations inside the live database.' : 'Register your property directly on the SettleKar database live, matching native app configurations.'}</p>
      </div>

      {formSuccess && (
        <div className={styles.formSuccessMsg}>
          🎉 Property {editingProperty ? 'Updated' : 'Listed'} Successfully! Redirecting to My Listings...
        </div>
      )}

      {formError && <div className={styles.formErrorMsg}>{formError}</div>}

      <form onSubmit={handleListProperty} className={styles.listingForm}>
        
        {/* CARD 1: Basic Information */}
        <div className={styles.appCard}>
          <div className={styles.appCardHeader}>
            <span className={styles.appCardIcon}>🏠</span>
            <h3 className={styles.appCardTitle}>Basic Information</h3>
          </div>

          <div className={styles.formGroup}>
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

          <div className={styles.formGroup}>
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

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
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

            <div className={styles.formGroup}>
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
        <div className={styles.appCard}>
          <div className={styles.appCardHeader}>
            <span className={styles.appCardIcon}>💰</span>
            <h3 className={styles.appCardTitle}>Financial Details ({userRole === 'broker' ? 'Broker' : userRole === 'firm' ? 'Firm' : 'Owner'})</h3>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
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

            <div className={styles.formGroup}>
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
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
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
          <div className={styles.financialSummaryCard}>
            <div className={styles.financialSummaryHeader}>
              <span>Calculated Total Advance</span>
              <strong>₹{calculatedTotalAdvance.toLocaleString('en-IN')}</strong>
            </div>
            <div className={styles.financialSummaryFormula}>
              Formula: ({advanceRentMonths} × Rent [₹{(parsedPrice || 0).toLocaleString('en-IN')}]) + Security [₹{(parsedSecurity || 0).toLocaleString('en-IN')}] {userRole === 'broker' ? `+ Brokerage [₹${(parsedBrokerage || 0).toLocaleString('en-IN')}]` : ''}
            </div>
          </div>
        </div>

        {/* CARD 2: Property Details */}
        <div className={styles.appCard}>
          <div className={styles.appCardHeader}>
            <span className={styles.appCardIcon}>⚙️</span>
            <h3 className={styles.appCardTitle}>Property Details</h3>
          </div>

          {/* Toggle Switch 1: Available */}
          <div className={styles.toggleContainer}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleBulletIcon}>{available ? '🟢' : '⚪'}</span>
              <div className={styles.toggleText}>
                <h4>Available for Sale/Rent</h4>
                <span>Property is currently {available ? 'available' : 'not available'}.</span>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* Dropdown: Property Type Selector */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="prop-type">Property Type *</label>
              <select
                id="prop-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
              >
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

            <div className={styles.formGroup}>
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

          {/* Toggle Switch 2: Independent */}
          <div className={styles.toggleContainer}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleBulletIcon}>🏢</span>
              <div className={styles.toggleText}>
                <h4>Independent Property</h4>
                <span>Standalone property with {isIndependent ? 'independent' : 'shared'} access.</span>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isIndependent}
                onChange={(e) => setIsIndependent(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* CARD 3: Location Details */}
        <div className={styles.appCard}>
          <div className={styles.appCardHeader}>
            <span className={styles.appCardIcon}>📍</span>
            <h3 className={styles.appCardTitle}>Property Location</h3>
          </div>

          {/* Single Search Location Input */}
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="prop-search-loc">Search Property Location *</label>
              <div className={styles.mapSearchRow}>
                <input
                  id="prop-search-loc"
                  type="text"
                  className={styles.mapSearchInput}
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
                  className={styles.mapSearchBtn}
                  onClick={() => handleMapSearch()}
                  disabled={searchingMap}
                >
                  {searchingMap ? 'Searching...' : '🔍 Search'}
                </button>
              </div>
            </div>
          </div>

          {locationWarning && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {locationWarning}
            </div>
          )}

          {coords && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              color: '#16a34a',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✅ Resolved Location:</span>
                <strong>{locationStr || 'Unknown location'}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                City Group: <strong>{city}</strong> | Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </div>
            </div>
          )}

          <div className={styles.formGroup} style={{ marginTop: '5px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <span>Select/Adjust on Map *</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={getCurrentLocation}
                  style={{
                    background: 'rgba(37, 99, 235, 0.08)',
                    color: '#2563eb',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  📍 Use My Location
                </button>
                <span className={styles.uploadSubtitle}>
                  {coords ? `📌 Pinned: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : '⚠️ No location pinned yet'}
                </span>
              </div>
            </label>
            <div 
              id="map-picker" 
              style={{ 
                height: '320px', 
                width: '100%', 
                borderRadius: '16px', 
                border: '1px solid #cbd5e1', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                position: 'relative',
                zIndex: 1
              }}
            ></div>
            <span className={styles.uploadSubtitle} style={{ marginTop: '8px', display: 'block', fontStyle: 'italic' }}>
              💡 Search above or click on the map to pin your property. SettleKar will reverse-geocode your pin and auto-fill the search bar!
            </span>

            {/* Neighborhood Score Section */}
            <div style={{ marginTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span className={styles.uploadSubtitle}>
                  {isScoreFetched 
                    ? '✅ Neighborhood rating successfully loaded.' 
                    : coords 
                      ? '⚠️ Neighborhood score not fetched yet.' 
                      : '📍 Select coordinates on the map first.'}
                </span>
                <button
                  type="button"
                  className={`${styles.scoreFetchBtn} ${isScoreFetched ? styles.scoreFetchBtnSuccess : ''}`}
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
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginTop: '12px'
                }}>
                  ❌ {scoreError}
                </div>
              )}

              {fetchingScore && (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: '#94a3b8' }}>
                  <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' }}></div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Querying LivableIndia APIs and mapping compound neighborhood pillars...</p>
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes spin { to { transform: rotate(360deg); } }
                  `}} />
                </div>
              )}

              {!fetchingScore && isScoreFetched && neighborhoodScore !== null && (
                <div className={styles.scoreCard}>
                  <div className={styles.scoreHeader}>
                    <div className={styles.scoreBadgeContainer}>
                      <span className={styles.overallScoreLabel}>LIVABILITY SCORE</span>
                      <span className={styles.overallScoreValue}>{neighborhoodScore}/100</span>
                      <span className={`${styles.scoreIndicatorBadge} ${
                        neighborhoodScore >= 80 
                          ? styles.scoreBadgeHigh 
                          : neighborhoodScore >= 60 
                            ? styles.scoreBadgeMedium 
                            : styles.scoreBadgeLow
                      }`}>
                        {neighborhoodScore >= 80 ? '🟢 Excellent' : neighborhoodScore >= 60 ? '🟡 Moderate' : '🔴 Poor'} Livability
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                      Data source: <strong>LivableIndia API</strong>
                    </div>
                  </div>

                  {neighborhoodPillars && (
                    <div className={styles.scorePillarsGrid}>
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
                          ? styles.scoreTextGreen 
                          : value.score >= 60 
                            ? styles.scoreTextOrange 
                            : styles.scoreTextRed;
                        return (
                          <div key={key} className={styles.scorePillarCard}>
                            <div className={styles.pillarHeader}>
                              <span className={styles.pillarName}>
                                {emojis[key] || '📍'} {key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                              <span className={`${styles.pillarScore} ${scoreColorClass}`}>
                                {value.score}
                              </span>
                            </div>
                            <div className={styles.pillarCategory}>{value.category}</div>
                            <div className={styles.pillarCategory}>{value.geography}</div>
                            <div className={styles.pillarDesc}>{value.description}</div>
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
        <div className={styles.appCard}>
          <div className={styles.appCardHeader}>
            <span className={styles.appCardIcon}>👤</span>
            <h3 className={styles.appCardTitle}>Owner Details</h3>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
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

            <div className={styles.formGroup}>
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
        <div className={styles.appCard}>
          <div className={styles.appCardHeader}>
            <span className={styles.appCardIcon}>🖼️</span>
            <h3 className={styles.appCardTitle}>Property Images</h3>
          </div>

          <div className={styles.multiUploadContainer}>
            {/* 1. Indoor Images Section */}
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Indoor Images</span>
                <span className={styles.uploadSubtitle}>{indoorFiles.length} selected</span>
              </label>
              
              <div className={styles.fileUploadZone}>
                <input
                  type="file"
                  id="prop-indoor-upload"
                  accept="image/*"
                  multiple
                  onChange={handleIndoorFilesChange}
                  className={styles.fileInputHidden}
                />
                <label htmlFor="prop-indoor-upload" className={styles.fileUploadLabel}>
                  <div className={styles.uploadPlaceholder}>
                    <span className={styles.uploadIcon}>🚪</span>
                    <span className={styles.uploadTitle}>Choose Indoor Images</span>
                    <span className={styles.uploadSubtitle}>Upload multiple photos of rooms, kitchen, washrooms</span>
                  </div>
                </label>
              </div>

              {indoorPreviews.length > 0 && (
                <div className={styles.previewsGrid}>
                  {indoorPreviews.map((preview, idx) => (
                    <div key={`indoor-pre-${idx}`} className={styles.previewThumbWrapper}>
                      <img src={preview} alt={`Indoor preview ${idx + 1}`} className={styles.previewThumb} />
                      <button
                        type="button"
                        className={styles.deleteThumbBtn}
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
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Outdoor/Surrounding Images</span>
                <span className={styles.uploadSubtitle}>{outdoorFiles.length} selected</span>
              </label>
              
              <div className={styles.fileUploadZone}>
                <input
                  type="file"
                  id="prop-outdoor-upload"
                  accept="image/*"
                  multiple
                  onChange={handleOutdoorFilesChange}
                  className={styles.fileInputHidden}
                />
                <label htmlFor="prop-outdoor-upload" className={styles.fileUploadLabel}>
                  <div className={styles.uploadPlaceholder}>
                    <span className={styles.uploadIcon}>🌳</span>
                    <span className={styles.uploadTitle}>Choose Outdoor Images</span>
                    <span className={styles.uploadSubtitle}>Upload photos of society, entry gate, surroundings, or building front</span>
                  </div>
                </label>
              </div>

              {outdoorPreviews.length > 0 && (
                <div className={styles.previewsGrid}>
                  {outdoorPreviews.map((preview, idx) => (
                    <div key={`outdoor-pre-${idx}`} className={styles.previewThumbWrapper}>
                      <img src={preview} alt={`Outdoor preview ${idx + 1}`} className={styles.previewThumb} />
                      <button
                        type="button"
                        className={styles.deleteThumbBtn}
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
          <div className={styles.scoreValidationWarning}>
            ⚠️ <strong>Action Required:</strong> Please click "Fetch Neighborhood Score" in the Location Details card above before publishing.
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button 
            type="submit" 
            className={styles.submitFormBtn} 
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
