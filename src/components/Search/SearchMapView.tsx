import React, { useEffect, useRef } from 'react';
import { createCustomMarker } from '../../utils/CustomMarker.ts';
import { LocationManager } from '../../utils/searchUtils';

interface SearchMapViewProps {
  properties: any[];
  selectedProperty: any | null;
  onSelectProperty: (property: any) => void;
  center: { lat: number; lng: number };
  userLocation: { lat: number; lng: number } | null;
  selectedLocation: { lat: number; lng: number } | null;
}

// Extract lat/lng coordinates from any format property location might take
export const getPropertyCoords = (property: any): { lat: number; lng: number } | null => {
  if (!property) return null;

  if (property.latitude && property.longitude) {
    return { lat: Number(property.latitude), lng: Number(property.longitude) };
  }

  if (property.coords && typeof property.coords.lat === 'number') {
    return { lat: property.coords.lat, lng: property.coords.lng };
  }

  if (typeof property.location === 'string') {
    if (property.location.includes(',')) {
      const parts = property.location.split(',');
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    const extracted = LocationManager.extractCoordsFromLink(property.location);
    if (extracted) {
      return { lat: extracted.latitude, lng: extracted.longitude };
    }
  }

  return null;
};

const SILVER_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0ecf8' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
];

const JAIPUR_LOCALITIES = [
  {
    name: 'Vaishali Nagar',
    rent: '₹8k - ₹32k',
    center: { lat: 26.9076, lng: 75.7363 },
    coords: [
      { lat: 26.925, lng: 75.715 },
      { lat: 26.925, lng: 75.755 },
      { lat: 26.890, lng: 75.755 },
      { lat: 26.890, lng: 75.715 }
    ]
  },
  {
    name: 'Malviya Nagar',
    rent: '₹9k - ₹38k',
    center: { lat: 26.8531, lng: 75.8041 },
    coords: [
      { lat: 26.870, lng: 75.785 },
      { lat: 26.870, lng: 75.825 },
      { lat: 26.835, lng: 75.825 },
      { lat: 26.835, lng: 75.785 }
    ]
  },
  {
    name: 'Jagatpura',
    rent: '₹7k - ₹28k',
    center: { lat: 26.8239, lng: 75.8647 },
    coords: [
      { lat: 26.840, lng: 75.835 },
      { lat: 26.840, lng: 75.895 },
      { lat: 26.805, lng: 75.895 },
      { lat: 26.805, lng: 75.835 }
    ]
  },
  {
    name: 'C-Scheme',
    rent: '₹18k - ₹75k',
    center: { lat: 26.9116, lng: 75.8022 },
    coords: [
      { lat: 26.922, lng: 75.785 },
      { lat: 26.922, lng: 75.820 },
      { lat: 26.898, lng: 75.820 },
      { lat: 26.898, lng: 75.785 }
    ]
  },
  {
    name: 'Mansarovar',
    rent: '₹7.5k - ₹30k',
    center: { lat: 26.8770, lng: 75.7634 },
    coords: [
      { lat: 26.895, lng: 75.735 },
      { lat: 26.895, lng: 75.785 },
      { lat: 26.855, lng: 75.785 },
      { lat: 26.855, lng: 75.735 }
    ]
  }
];

export const SearchMapView: React.FC<SearchMapViewProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  center,
  userLocation,
  selectedLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<any[]>([]);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const areaMarkersRef = useRef<google.maps.Marker[]>([]);

  // Initialize the Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center: center,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      styles: SILVER_MAP_STYLE,
      gestureHandling: 'cooperative',
    };

    mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
  }, []);

  // Cleanup polygons and area labels on unmount
  useEffect(() => {
    return () => {
      polygonsRef.current.forEach((p) => p.setMap(null));
      areaMarkersRef.current.forEach((m) => m.setMap(null));
    };
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.panTo(new google.maps.LatLng(center.lat, center.lng));
    }
  }, [center]);

  // Pan to selected property
  useEffect(() => {
    if (mapRef.current && selectedProperty) {
      const coords = getPropertyCoords(selectedProperty);
      if (coords) {
        mapRef.current.panTo(new google.maps.LatLng(coords.lat, coords.lng));
        // slightly zoom in when focusing on a property
        if (mapRef.current.getZoom()! < 15) {
          mapRef.current.setZoom(15);
        }
      }
    }
  }, [selectedProperty]);

  // Redraw Markers whenever list of properties, selected property, or location markers change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((marker) => {
      if (marker && typeof marker.onRemove === 'function') {
        marker.onRemove();
      }
    });
    markersRef.current = [];

    const map = mapRef.current;

    // 1. Draw User Location Marker
    if (userLocation) {
      const userMarker = createCustomMarker({
        map,
        position: userLocation,
        type: 'user',
        title: 'Your Location',
      });
      markersRef.current.push(userMarker);
    }

    // 2. Draw Selected Search Location Marker
    if (selectedLocation) {
      const targetMarker = createCustomMarker({
        map,
        position: selectedLocation,
        type: 'selected',
        title: 'Search Center',
      });
      markersRef.current.push(targetMarker);
    }

    // 3. Draw Property Markers
    properties.forEach((property) => {
      const coords = getPropertyCoords(property);
      if (coords) {
        const isSelected = selectedProperty && selectedProperty.id === property.id;
        const propertyMarker = createCustomMarker({
          map,
          position: coords,
          type: 'property',
          price: property.price,
          isSelected: !!isSelected,
          onClick: () => {
            onSelectProperty(property);
          },
        });
        markersRef.current.push(propertyMarker);
      }
    });

    // 4. Draw Locality Polygons & Area Labels
    polygonsRef.current.forEach((polygon) => polygon.setMap(null));
    polygonsRef.current = [];
    areaMarkersRef.current.forEach((m) => m.setMap(null));
    areaMarkersRef.current = [];

    const isJaipur = center && Math.abs(center.lat - 26.9124) < 0.3 && Math.abs(center.lng - 75.7873) < 0.3;
    if (isJaipur) {
      JAIPUR_LOCALITIES.forEach((loc) => {
        // Draw Polygon
        const polygon = new google.maps.Polygon({
          paths: loc.coords,
          strokeColor: '#4f46e5',
          strokeOpacity: 0.2,
          strokeWeight: 1.5,
          fillColor: '#818cf8',
          fillOpacity: 0.04,
          map,
        });
        polygonsRef.current.push(polygon);

        // Draw Label Marker
        const markerLabel = new google.maps.Marker({
          position: loc.center,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0,
          },
          label: {
            text: `${loc.name}\n${loc.rent}`,
            color: '#0a2540',
            fontSize: '11px',
            fontWeight: '800',
          },
        });
        areaMarkersRef.current.push(markerLabel);
      });
    }
  }, [properties, selectedProperty, userLocation, selectedLocation]);

  // Automatically adjust bounds to fit all filtered properties and the search center
  useEffect(() => {
    if (!mapRef.current || (properties.length === 0 && !selectedLocation)) return;

    const bounds = new google.maps.LatLngBounds();
    let hasCoords = false;

    if (selectedLocation) {
      bounds.extend(new google.maps.LatLng(selectedLocation.lat, selectedLocation.lng));
      hasCoords = true;
    }

    properties.forEach((property) => {
      const coords = getPropertyCoords(property);
      if (coords) {
        bounds.extend(new google.maps.LatLng(coords.lat, coords.lng));
        hasCoords = true;
      }
    });

    if (hasCoords && mapRef.current) {
      mapRef.current.fitBounds(bounds);

      // Prevent too deep of a zoom when only 1 item or very close pins are present
      const listener = google.maps.event.addListener(mapRef.current, 'bounds_changed', () => {
        if (mapRef.current && mapRef.current.getZoom()! > 16) {
          mapRef.current.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [properties, selectedLocation]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '100%' }} />
    </div>
  );
};
export default SearchMapView;
