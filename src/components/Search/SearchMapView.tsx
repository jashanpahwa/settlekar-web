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
