import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  auth, 
  db, 
  googleProvider,
  storage
} from './firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import styles from './Dashboard.module.css';
import logoImage from '/logo.png';

// Define structures
interface PropertyItem {
  id: string | number;
  title: string;
  city: string;
  location: string;
  address?: string;
  price: string;
  rating: string;
  badge: string;
  features: string;
  image: string;
  isUserAdded?: boolean;
  indoorImages?: string[];
  outdoorImages?: string[];
}

interface InquiryItem {
  id: string;
  propertyId: string | number;
  propertyTitle: string;
  propertyPrice: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  message: string;
  createdAt: string;
}


const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'properties' | 'inquiries'>('overview');
  
  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data States
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  
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
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('+91');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [indoorFiles, setIndoorFiles] = useState<File[]>([]);
  const [indoorPreviews, setIndoorPreviews] = useState<string[]>([]);
  const [outdoorFiles, setOutdoorFiles] = useState<File[]>([]);
  const [outdoorPreviews, setOutdoorPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  
  // Leaflet Map Picker States
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);

  // Feedback States
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // 1. Listen to Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      // Autofill owner name from authenticated user details
      if (firebaseUser) {
        setOwnerName(firebaseUser.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

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

  // 1.5 Initialize Leaflet map dynamically
  useEffect(() => {
    if (activeTab !== 'list') {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      return;
    }

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
  }, [activeTab]);

  // 1.8 Fetch current GPS location and update Leaflet map picker
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
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

  // 1.9 Search location by address using Nominatim geocoder API
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

  // 1.95 Populate form fields and switch tab to Edit a Property
  const triggerEditProperty = (propId: string | number) => {
    const prop = properties.find((p) => p.id === propId);
    if (!prop) return;

    setEditingPropId(propId.toString());
    
    setTitle(prop.title);
    
    // Clear specs
    setPrice(prop.price ? prop.price.replace(/[^\d.]/g, '') : '');
    
    let parsedSqft = '500';
    let parsedFurnishing = 'Semi-Furnished';
    let parsedIndependent = false;

    if (prop.features) {
      const parts = prop.features.split('•');
      const sqftPart = parts.find(p => p.includes('sq.ft'));
      if (sqftPart) {
        parsedSqft = sqftPart.replace(/[^\d]/g, '').trim();
      }
      
      const furnPart = parts.find(p => p.includes('Furnished') || p.includes('Unfurnished'));
      if (furnPart) {
        parsedFurnishing = furnPart.trim();
      }

      parsedIndependent = prop.features.includes('Independent');
    }

    setSqft(parsedSqft);
    setFurnishing(parsedFurnishing);
    setIsIndependent(parsedIndependent);
    setPropertyType(prop.badge || '1 BHK');
    
    // Address & City
    setCity(prop.city || 'Mumbai');
    setLocationStr(prop.address || '');
    setSearchQuery(prop.address || '');

    // Map pin Coordinates
    if (prop.location && prop.location.includes('q=')) {
      try {
        const coordsStr = prop.location.split('q=')[1];
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
    setIndoorPreviews(prop.indoorImages || (prop.image ? [prop.image] : []));
    setOutdoorPreviews(prop.outdoorImages || []);
    setIndoorFiles([]);
    setOutdoorFiles([]);

    // Open Form tab
    setActiveTab('list');
  };

  // 2. Fetch Owner Properties & Inquiries from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchLandlordData = async () => {
      try {
        const propQuery = query(
          collection(db, 'properties'),
          where('createdBy', '==', user.uid)
        );
        const propSnapshot = await getDocs(propQuery);
        const loadedProps: PropertyItem[] = [];
        propSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedProps.push({
            id: docSnap.id,
            title: data.title || '',
            city: data.city || 'Mumbai',
            location: data.location || '',
            address: data.address || '',
            price: typeof data.price === 'number' ? `₹${data.price.toLocaleString('en-IN')}` : data.price || '',
            rating: data.rating || '5.0',
            badge: data.badge || data.propertyType || '1 BHK',
            features: data.features || `${data.propertyType} • ${data.area || 0} sq.ft • ${data.furnishing || 'Semi-Furnished'}`,
            image: data.image || (data.images && data.images.length > 0 ? data.images[0] : '') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
            isUserAdded: true
          });
        });
        setProperties(loadedProps);

        const inqQuery = query(
          collection(db, 'inquiries'),
          where('ownerId', '==', user.uid)
        );
        const inqSnapshot = await getDocs(inqQuery);
        const loadedInqs: InquiryItem[] = [];
        inqSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedInqs.push({
            id: docSnap.id,
            propertyId: data.propertyId || '',
            propertyTitle: data.propertyTitle || '',
            propertyPrice: data.propertyPrice || '',
            tenantName: data.tenantName || data.inquirerName || 'Anonymous',
            tenantEmail: data.tenantEmail || data.inquirerEmail || '',
            tenantPhone: data.tenantPhone || data.inquirerPhone || '',
            message: data.message || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
          });
        });
        
        loadedInqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInquiries(loadedInqs);

      } catch (err) {
        console.error('Error fetching landlord Firestore data:', err);
      }
    };

    fetchLandlordData();
  }, [user, activeTab]);

  // Auth Handlers
  const handleSignIn = async () => {
    setAuthSubmitting(true);
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setAuthError('Authentication failed. Please verify browser popup permissions.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) {
      return;
    }
    try {
      await signOut(auth);
      setProperties([]);
      setInquiries([]);
      setActiveTab('overview');
    } catch (err) {
      console.error('Error signing out:', err);
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

  // Form Submission (Add to Firestore matching SettleKar Mobile App structure)
  const handleListProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationStr || !price || !user) {
      setFormError('Please fill in all required fields (*).');
      return;
    }

    setFormError('');
    setFormSuccess(false);
    setUploadProgress(false);

    try {
      // Parse numeric rent price matching mobile app parseFloat(price)
      const parsedPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0;
      let displayPriceString = `₹${parsedPrice.toLocaleString('en-IN')}`;

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
        price: parsedPrice, // Saved as real number matching SettleKar mobile
        location: mapsLink, // Coordinate maps link for mobile app compatibility
        address: locationStr.trim(), // User-friendly neighborhood/address text
        available, // Boolean flag matching available switch
        propertyType, // Selected BHK config
        isIndependent, // Boolean flag matching independent switch
        ownerName: ownerName.trim() || user.displayName || 'Verified Owner',
        ownerContact: ownerContact.trim(),
        ownerProfilePhoto: user.photoURL || '',
        area: parseInt(sqft) || 0, // Saved as area integer matching SettleKar mobile
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: 'Available', // Add status field matching mobile app
        furnishing, // Keep track of furnishing status
        image: placeholderImg,
        images: [] as string[],
        indoorImages: [] as string[],
        outdoorImages: [] as string[],
        // Backwards compatibility keys for standard MockExplorer UI
        city,
        badge: propertyType,
        features: featuresStr,
        rating: '5.0',
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
      if (editingPropId) {
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
          // Compatibility
          city,
          badge: propertyType,
          features: featuresStr
        };

        // Update Firestore document
        await updateDoc(doc(db, 'properties', editingPropId), updatePayload);

        // Update properties state locally
        setProperties(
          properties.map((p) =>
            p.id === editingPropId
              ? {
                  ...p,
                  title: updatePayload.title,
                  city: updatePayload.city,
                  location: updatePayload.location,
                  address: updatePayload.address,
                  price: displayPriceString,
                  badge: updatePayload.badge,
                  features: updatePayload.features,
                  image: finalImageUrl,
                  indoorImages: finalIndoorUrls,
                  outdoorImages: finalOutdoorUrls
                }
              : p
          )
        );

        setEditingPropId(null);
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

        // Prepend to current state properties
        setProperties([
          {
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
            outdoorImages: finalOutdoorUrls
          },
          ...properties
        ]);
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
      setCoords(null); // Clear coordinates
      setIndoorFiles([]);
      setIndoorPreviews([]);
      setOutdoorFiles([]);
      setOutdoorPreviews([]);

      // Redirect to properties tab
      setTimeout(() => {
        setFormSuccess(false);
        setActiveTab('properties');
      }, 1500);

    } catch (err) {
      console.error('Firestore save error:', err);
      setFormError('Could not save property to Firebase. Please try again.');
      setUploadProgress(false);
    }
  };

  // Delete listed property from Firestore
  const handleDeleteProperty = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to remove this property? This will also remove it from the live home page explorer.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'properties', id as string));
      setProperties(properties.filter((p: PropertyItem) => p.id !== id));
    } catch (err) {
      console.error('Error deleting property document:', err);
      alert('Failed to delete property. Please check connection and try again.');
    }
  };

  // Dismiss inquiry from Firestore
  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm('Are you sure you want to dismiss this inquiry?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'inquiries', inqId));
      setInquiries(inquiries.filter((i: InquiryItem) => i.id !== inqId));
    } catch (err) {
      console.error('Error dismissing inquiry:', err);
      alert('Failed to dismiss inquiry. Please check connection and try again.');
    }
  };

  // Helper: Format Dates nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  // Loading Splash Screen
  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Connecting to SettleKar...</p>
      </div>
    );
  }

  // Google Authentication Gate
  if (!user) {
    return (
      <div className={styles.signInContainer}>
        <div className={styles.signInCard}>
          <div className={styles.signInHeader}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.signInLogo} />
            </Link>
            <span className={styles.signInBadge}>Owner Portal</span>
          </div>
          
          <h2>Manage Your Listings Hassle-Free</h2>
          <p>
            Sign in with your Google account to list apartments, review incoming inquiries from tenants in real-time, and settle deals directly without middle-men.
          </p>

          <div className={styles.bullets}>
            <div className={styles.bulletItem}>
              <span className={styles.bulletIcon}>⚡</span>
              <div>
                <h4>Direct Connections</h4>
                <p>Chat directly with verified tenants—no brokers, zero brokerage fees.</p>
              </div>
            </div>
            <div className={styles.bulletItem}>
              <span className={styles.bulletIcon}>🌐</span>
              <div>
                <h4>Multi-Platform Sync</h4>
                <p>Your listed properties and inquiries sync directly to SettleKar mobile apps instantly.</p>
              </div>
            </div>
          </div>

          {authError && <div className={styles.authError}>{authError}</div>}

          <button onClick={handleSignIn} className={styles.googleSignInBtn} disabled={authSubmitting}>
            {authSubmitting ? (
              <span className={styles.submittingSpan}>Signing in...</span>
            ) : (
              <>
                <span className={styles.googleIcon}>G</span> Sign In with Google
              </>
            )}
          </button>
          
          <Link to="/" className={styles.backHomeLink}>
            ← Back to SettleKar Home
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated Portal View
  return (
    <div className={styles.dashboardLayout}>
      {/* Side Navigation Bar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logoLink}>
            <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
          </Link>
          <span className={styles.portalBadge}>Owner Portal</span>
        </div>
        
        <nav className={styles.menu}>
          <button
            className={`${styles.menuItem} ${activeTab === 'overview' ? styles.activeMenu : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.icon}>📊</span> Overview
          </button>
          <button
            className={`${styles.menuItem} ${activeTab === 'list' ? styles.activeMenu : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <span className={styles.icon}>➕</span> List Property
          </button>
          <button
            className={`${styles.menuItem} ${activeTab === 'properties' ? styles.activeMenu : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <span className={styles.icon}>🏠</span> My Properties
            {properties.length > 0 && <span className={styles.badgeCount}>{properties.length}</span>}
          </button>
          <button
            className={`${styles.menuItem} ${activeTab === 'inquiries' ? styles.activeMenu : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <span className={styles.icon}>✉️</span> Inquiries
            {inquiries.length > 0 && <span className={styles.badgeCountBlue}>{inquiries.length}</span>}
          </button>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleSignOut} className={styles.backHomeBtn}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top bar header */}
        <header className={styles.topHeader}>
          <div className={styles.headerInfo}>
            <h1>Welcome Back, {user.displayName ? user.displayName.split(' ')[0] : 'Landlord'}!</h1>
            <p>Manage your properties, handle direct inquiries, and see coverage growth.</p>
          </div>
          <div className={styles.ownerProfile}>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Profile'} className={styles.profileAvatarImg} />
            ) : (
              <div className={styles.profileAvatar}>
                {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'SK'}
              </div>
            )}
            <div className={styles.profileDetails}>
              <h4>{user.displayName || 'SettleKar Owner'}</h4>
              <span>Google Verified</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className={styles.container}>
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className={styles.tabContent}>
              <div className={styles.gridStats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#EEF2FF', color: '#4F46E5' }}>🏢</div>
                  <div className={styles.statData}>
                    <h3>{properties.length}</h3>
                    <p>Listed Properties</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>✉️</div>
                  <div className={styles.statData}>
                    <h3>{inquiries.length}</h3>
                    <p>Active Inquiries</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#FEF3C7', color: '#D97706' }}>📍</div>
                  <div className={styles.statData}>
                    <h3>3 Cities</h3>
                    <p>Mumbai, BLR, Pune</p>
                  </div>
                </div>
              </div>

              {/* Welcome Section */}
              <div className={styles.overviewHero}>
                <div className={styles.overviewHeroText}>
                  <h2>List your properties directly. Skip the broker completely.</h2>
                  <p>
                    With SettleKar, you connect directly with verified tenants. Post your BHK apartments or studio rooms, receive direct inquiries, and finalize agreements completely hassle-free.
                  </p>
                  <button className={styles.listPromoBtn} onClick={() => setActiveTab('list')}>
                    ➕ List a New Property
                  </button>
                </div>
                <div className={styles.overviewHeroGraphic}>🛋️</div>
              </div>

              {/* Recent Inquiries Quick Preview */}
              <div className={styles.recentActivity}>
                <div className={styles.sectionHeader}>
                  <h2>Recent Inquiries</h2>
                  <button className={styles.viewAllBtn} onClick={() => setActiveTab('inquiries')}>
                    View All Inquiries →
                  </button>
                </div>
                
                {inquiries.length === 0 ? (
                  <div className={styles.emptyCard}>
                    <p>No active inquiries received yet. Once tenants request your listed properties, they will appear here!</p>
                  </div>
                ) : (
                  <div className={styles.inquiriesList}>
                    {inquiries.slice(0, 2).map((inq: InquiryItem) => (
                      <div key={inq.id} className={styles.inquiryCard}>
                        <div className={styles.inquiryHeader}>
                          <div className={styles.inquirerInfo}>
                            <h3>{inq.tenantName}</h3>
                            <span>Applied for: <strong>{inq.propertyTitle}</strong> ({inq.propertyPrice})</span>
                          </div>
                          <span className={styles.timeBadge}>{formatDate(inq.createdAt)}</span>
                        </div>
                        <p className={styles.inquiryMsg}>"{inq.message}"</p>
                        <div className={styles.inquiryActions}>
                          <a href={`mailto:${inq.tenantEmail}`} className={styles.contactBtn}>
                            ✉️ Email ({inq.tenantEmail})
                          </a>
                          <a href={`tel:${inq.tenantPhone}`} className={styles.contactBtn}>
                            📞 Call ({inq.tenantPhone})
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: List Property Form (Restructured to mirror the Mobile App Cards Layout) */}
          {activeTab === 'list' && (
            <div className={styles.tabContent}>
              <div className={styles.listHeaderWrapper}>
                <h2>{editingPropId ? '✏️ Edit Listed Property' : 'List Property'}</h2>
                <p>{editingPropId ? 'Modify and update your listed property configurations inside the live database.' : 'Register your property directly on the SettleKar database live, matching native app configurations.'}</p>
              </div>

              {formSuccess && (
                <div className={styles.formSuccessMsg}>
                  🎉 Property {editingPropId ? 'Updated' : 'Listed'} Successfully! Redirecting to My Listings...
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

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <button type="submit" className={styles.submitFormBtn} disabled={formSuccess || uploadProgress} style={{ flex: 1 }}>
                    {uploadProgress 
                      ? '📤 Uploading Images to Storage...' 
                      : (formSuccess 
                          ? (editingPropId ? 'Saving Changes...' : 'Publishing Listing...') 
                          : (editingPropId ? '💾 Save Changes & Update' : '➕ Publish Property Listing'))}
                  </button>
                  {editingPropId && (
                    <button
                      type="button"
                      onClick={() => {
                        // Reset all editing states
                        setEditingPropId(null);
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
                        // Switch back to properties tab
                        setActiveTab('properties');
                      }}
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
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: My Properties */}
          {activeTab === 'properties' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>My Listed Properties</h2>
                <p>Verify or remove property advertisements currently live on SettleKar.</p>
              </div>

              {properties.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🏢</div>
                  <h2>No Properties Listed Yet</h2>
                  <p>You haven't listed any property yet. Open the "List Property" tab to post your first rental!</p>
                  <button className={styles.emptyStateBtn} onClick={() => setActiveTab('list')}>
                    Post Listing Now
                  </button>
                </div>
              ) : (
                <div className={styles.listedPropertiesGrid}>
                  {properties.map((prop: PropertyItem) => (
                    <div key={prop.id} className={styles.listedCard}>
                      <button 
                        type="button"
                        onClick={() => triggerEditProperty(prop.id)}
                        className={styles.listedCardImgLink}
                        title="✏️ Edit Property"
                      >
                        <img src={prop.image} alt={prop.title} className={styles.listedCardImg} />
                      </button>
                      <div className={styles.listedCardBody}>
                        <div className={styles.listedCardHead}>
                          <h3>
                            <button 
                              type="button"
                              onClick={() => triggerEditProperty(prop.id)}
                              className={styles.listedCardTitleLink}
                              title="✏️ Edit Property"
                            >
                              {prop.title}
                            </button>
                          </h3>
                          <span className={styles.listedCardBadge}>{prop.badge}</span>
                        </div>
                        <p className={styles.listedCardAddr}>
                          📍 {prop.address || (prop.location && !prop.location.startsWith('http') ? prop.location : '') || prop.city}
                          {prop.location && prop.location.startsWith('http') && (
                            <a 
                              href={prop.location} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={styles.mapLinkBadge}
                              title="Open Google Maps"
                            >
                              🌐 Maps
                            </a>
                          )}
                        </p>
                        <p className={styles.listedCardFeat}>{prop.features}</p>
                        <div className={styles.listedCardFooter}>
                          <span className={styles.listedCardPrice}>{prop.price}</span>
                          <div className={styles.actionBtns}>
                            <button
                              type="button"
                              className={styles.editPropBtn}
                              onClick={() => triggerEditProperty(prop.id)}
                              aria-label={`Edit ${prop.title}`}
                            >
                              ✏️ Edit Property
                            </button>
                            <button
                              type="button"
                              className={styles.deletePropBtn}
                              onClick={() => handleDeleteProperty(prop.id)}
                              aria-label={`Delete ${prop.title}`}
                            >
                              🗑️ Delete Listing
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Inquiries Panel */}
          {activeTab === 'inquiries' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>Tenant Inquiries Panel</h2>
                <p>See genuine inquiry letters sent directly by prospective renters on your properties.</p>
              </div>

              {inquiries.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>✉️</div>
                  <h2>No Inquiries Received</h2>
                  <p>No tenant inquiries received yet. When users submit contact forms on SettleKar, they'll pop up here!</p>
                </div>
              ) : (
                <div className={styles.inquiriesContainer}>
                  {inquiries.map((inq: InquiryItem) => (
                    <div key={inq.id} className={styles.inquiryDetailsCard}>
                      <div className={styles.inquiryDetailsHead}>
                        <div className={styles.inqTitle}>
                          <h3>{inq.tenantName}</h3>
                          <span>Inquired on: <strong>{inq.propertyTitle}</strong> ({inq.propertyPrice})</span>
                        </div>
                        <div className={styles.inqMeta}>
                          <span className={styles.inqTime}>{formatDate(inq.createdAt)}</span>
                          <button
                            className={styles.dismissInqBtn}
                            onClick={() => handleDeleteInquiry(inq.id)}
                            title="Dismiss Inquiry"
                          >
                            ✕ Dismiss
                          </button>
                        </div>
                      </div>
                      
                      <div className={styles.inquiryDetailsMsg}>
                        <p>"{inq.message}"</p>
                      </div>

                      <div className={styles.inquiryContactStrip}>
                        <h4>Contact Prospective Tenant:</h4>
                        <div className={styles.contactButtons}>
                          <a href={`mailto:${inq.tenantEmail}`} className={styles.contactEmailBtn}>
                            📧 Email: {inq.tenantEmail}
                          </a>
                          <a href={`tel:${inq.tenantPhone}`} className={styles.contactPhoneBtn}>
                            📞 Call/WhatsApp: {inq.tenantPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
