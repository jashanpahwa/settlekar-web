/**
 * Search Utilities for Property Search Page (TypeScript Version)
 * Provides clean, reusable functions for search operations
 */
import { useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = "AIzaSyD1bFpK1qmChgNVkhVwABceydgC4w55GYE";
const DEFAULT_REGION_DELTA = 0.05;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteDistanceResult {
  success: boolean;
  error?: string;
  distance: {
    value: number;
    text: string;
    unit: string;
  };
  duration: {
    value: number | null;
    text: string;
    unit: string;
  };
  mode: string;
  straightLineDistance: number;
  fallback?: boolean;
}

export interface BatchDistanceResult {
  success: boolean;
  error?: string;
  distance: {
    value: number;
    text: string;
    unit: string;
  };
  duration?: {
    value: number;
    text: string;
    unit: string;
  };
  mode?: string;
  fallback?: boolean;
}

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface SearchProperty {
  id: string | number;
  title?: string;
  city?: string;
  location?: string; // Can be a URL containing coordinates
  address?: string;
  price?: number | string;
  available?: boolean;
  isIndependent?: boolean;
  createdAt?: any;
  distanceInfo?: any;
  [key: string]: any;
}

export interface SearchFilters {
  propertyType?: string;
  isIndependent?: boolean | null;
  priceRange?: [number, number];
  kmRange?: number;
  sortBy?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * Location Management Utilities
 */
export class LocationManager {
  /**
   * Get current user location with proper error handling using Browser Geolocation API
   */
  static async getCurrentLocation(): Promise<Coordinates> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  }

  /**
   * Calculate straight-line distance between two coordinates in kilometers (Haversine formula)
   * This is the "as the crow flies" distance
   */
  static calculateStraightLineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate actual route distance between two coordinates using Google Distance Matrix API
   * @param lat1 - Origin latitude
   * @param lon1 - Origin longitude
   * @param lat2 - Destination latitude
   * @param lon2 - Destination longitude
   * @param mode - Travel mode: 'driving', 'walking', 'bicycling', 'transit'
   * @param units - Units: 'metric' or 'imperial'
   * @returns Distance and duration information
   */
  static async calculateRouteDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    mode: string = 'driving',
    units: string = 'metric'
  ): Promise<RouteDistanceResult> {
    try {
      const origins = `${lat1},${lon1}`;
      const destinations = `${lat2},${lon2}`;

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(origins)}&` +
        `destinations=${encodeURIComponent(destinations)}&` +
        `mode=${mode}&` +
        `units=${units}&` +
        `key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Distance Matrix API failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Distance Matrix API error: ${data.status}`);
      }

      const element = data.rows[0]?.elements[0];

      if (!element || element.status !== 'OK') {
        throw new Error(`No route found: ${element?.status || 'Unknown error'}`);
      }

      // Extract distance in kilometers and duration in minutes
      const distanceKm = element.distance.value / 1000; // Convert meters to km
      const durationMinutes = element.duration.value / 60; // Convert seconds to minutes

      return {
        success: true,
        distance: {
          value: distanceKm,
          text: element.distance.text,
          unit: 'km'
        },
        duration: {
          value: durationMinutes,
          text: element.duration.text,
          unit: 'minutes'
        },
        mode: mode,
        straightLineDistance: this.calculateStraightLineDistance(lat1, lon1, lat2, lon2)
      };
    } catch (error: any) {
      console.error('Error calculating route distance:', error);

      // Fallback to straight-line distance
      const fallbackDistance = this.calculateStraightLineDistance(lat1, lon1, lat2, lon2);

      return {
        success: false,
        error: error.message,
        distance: {
          value: fallbackDistance,
          text: `${fallbackDistance.toFixed(1)} km`,
          unit: 'km'
        },
        duration: {
          value: null,
          text: 'N/A',
          unit: 'minutes'
        },
        mode: 'straight-line',
        straightLineDistance: fallbackDistance,
        fallback: true
      };
    }
  }

  /**
   * Calculate distance between two coordinates (now uses route distance by default)
   * Falls back to straight-line distance if route calculation fails
   */
  static async calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, mode: string = 'driving'): Promise<number> {
    try {
      const routeResult = await this.calculateRouteDistance(lat1, lon1, lat2, lon2, mode);
      if (routeResult.success) {
        return routeResult.distance.value;
      } else {
        // Fallback to straight-line distance
        return this.calculateStraightLineDistance(lat1, lon1, lat2, lon2);
      }
    } catch (error) {
      console.warn('Route distance calculation failed, using straight-line distance:', error);
      return this.calculateStraightLineDistance(lat1, lon1, lat2, lon2);
    }
  }

  /**
   * Synchronous version for backward compatibility (uses straight-line distance)
   */
  static calculateDistanceSync(lat1: number, lon1: number, lat2: number, lon2: number): number {
    return this.calculateStraightLineDistance(lat1, lon1, lat2, lon2);
  }

  /**
   * Batch calculate route distances for multiple destinations from one origin
   * More efficient for calculating distances to multiple properties
   * @param origin - {latitude, longitude}
   * @param destinations - Array of {latitude, longitude} objects
   * @param mode - Travel mode
   * @returns Array of distance results
   */
  static async calculateBatchRouteDistances(
    origin: Coordinates,
    destinations: Coordinates[],
    mode: string = 'driving'
  ): Promise<BatchDistanceResult[]> {
    try {
      if (!origin || !destinations || !Array.isArray(destinations) || destinations.length === 0) {
        console.warn('Invalid parameters for batch distance calculation');
        return [];
      }

      // Validate origin coordinates
      if (typeof origin.latitude !== 'number' || typeof origin.longitude !== 'number') {
        throw new Error('Invalid origin coordinates');
      }

      // Validate destinations
      const validDestinations = destinations.filter(dest =>
        dest && typeof dest.latitude === 'number' && typeof dest.longitude === 'number'
      );

      if (validDestinations.length === 0) {
        console.warn('No valid destinations found');
        return [];
      }

      // Google Distance Matrix API supports up to 25 destinations per request
      const batchSize = 25;
      const results: BatchDistanceResult[] = [];

      for (let i = 0; i < validDestinations.length; i += batchSize) {
        const batch = validDestinations.slice(i, i + batchSize);
        try {
          const batchResults = await this.processBatchDistances(origin, batch, mode);
          results.push(...batchResults);
        } catch (batchError) {
          console.warn(`Batch ${i / batchSize + 1} failed, using fallback:`, batchError);
          // Add fallback results for this batch
          const fallbackResults = batch.map(dest => ({
            success: false,
            distance: {
              value: this.calculateStraightLineDistance(origin.latitude, origin.longitude, dest.latitude, dest.longitude),
              text: 'Approx.',
              unit: 'km'
            },
            fallback: true
          }));
          results.push(...fallbackResults);
        }
      }

      return results;
    } catch (error) {
      console.error('Error in batch distance calculation:', error);
      // Fallback to straight-line distances for all destinations
      return destinations.map(dest => {
        if (!dest || typeof dest.latitude !== 'number' || typeof dest.longitude !== 'number') {
          return {
            success: false,
            distance: { value: Infinity, text: 'N/A', unit: 'km' },
            error: 'Invalid destination'
          };
        }
        return {
          success: false,
          distance: {
            value: this.calculateStraightLineDistance(origin.latitude, origin.longitude, dest.latitude, dest.longitude),
            text: 'Approx.',
            unit: 'km'
          },
          fallback: true
        };
      });
    }
  }

  /**
   * Process a batch of destinations for distance calculation
   */
  static async processBatchDistances(
    origin: Coordinates,
    destinations: Coordinates[],
    mode: string
  ): Promise<BatchDistanceResult[]> {
    const origins = `${origin.latitude},${origin.longitude}`;
    const destinationsStr = destinations
      .map(dest => `${dest.latitude},${dest.longitude}`)
      .join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
      `origins=${encodeURIComponent(origins)}&` +
      `destinations=${encodeURIComponent(destinationsStr)}&` +
      `mode=${mode}&` +
      `units=metric&` +
      `key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Batch Distance Matrix API error: ${data.status}`);
    }

    const elements = data.rows[0]?.elements || [];

    return elements.map((element: any, index: number) => {
      if (element.status === 'OK') {
        return {
          success: true,
          distance: {
            value: element.distance.value / 1000,
            text: element.distance.text,
            unit: 'km'
          },
          duration: {
            value: element.duration.value / 60,
            text: element.duration.text,
            unit: 'minutes'
          },
          mode: mode
        };
      } else {
        // Fallback to straight-line distance
        const dest = destinations[index];
        const fallbackDistance = this.calculateStraightLineDistance(
          origin.latitude, origin.longitude, dest.latitude, dest.longitude
        );

        return {
          success: false,
          distance: {
            value: fallbackDistance,
            text: `${fallbackDistance.toFixed(1)} km`,
            unit: 'km'
          },
          fallback: true
        };
      }
    });
  }

  static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Extract coordinates from Google Maps URL
   */
  static extractCoordsFromLink(url: string | null | undefined): Coordinates | null {
    if (!url) return null;

    // Match ?q=lat,lng
    let match = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };

    // Match @lat,lng
    match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };

    // Match /place/lat,lng
    match = url.match(/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };

    return null;
  }
}

/**
 * Search Management Utilities
 */
export class SearchManager {
  /**
   * Geocode a location string to coordinates
   */
  static async geocodeLocation(query: string): Promise<GeocodedLocation> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          address: data.results[0].formatted_address,
        };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  /**
   * Search properties by text query
   */
  static searchPropertiesByText<T extends SearchProperty>(properties: T[], query: string): T[] {
    if (!query || query.trim().length === 0) {
      return properties;
    }

    const searchTerm = query.toLowerCase().trim();

    return properties.filter(property => {
      const searchableText = [
        property.title,
        property.city,
        property.location,
        property.propertyType,
        property.description
      ].filter(Boolean).join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  /**
   * Get properties within a radius of a location (now uses route distance by default)
   * Falls back to straight-line distance if route calculation fails
   */
  static async getPropertiesNearLocation<T extends SearchProperty>(
    properties: T[],
    centerLocation: Coordinates,
    radiusKm: number = 3,
    mode: string = 'driving'
  ): Promise<T[]> {
    if (!centerLocation || !Array.isArray(properties)) {
      console.warn('Invalid parameters for getPropertiesNearLocation:', { centerLocation, properties: Array.isArray(properties) });
      return [];
    }

    try {
      // Try route distance calculation first
      const propertiesWithCoords = properties
        .map(property => {
          if (!property || typeof property !== 'object') return null;
          const coords = LocationManager.extractCoordsFromLink(property.location);
          return coords ? { ...property, coords } : null;
        })
        .filter((p): p is T & { coords: Coordinates } => p !== null);

      if (propertiesWithCoords.length === 0) {
        console.log('No properties with valid coordinates found');
        return [];
      }

      // Get destinations for batch calculation
      const destinations = propertiesWithCoords.map(p => p.coords);

      // Calculate route distances in batches
      const distanceResults = await LocationManager.calculateBatchRouteDistances(
        centerLocation,
        destinations,
        mode
      );

      // Filter properties within radius
      const filteredProperties: T[] = [];

      propertiesWithCoords.forEach((property, index) => {
        const distanceResult = distanceResults[index];

        if (distanceResult && distanceResult.distance && distanceResult.distance.value <= radiusKm) {
          filteredProperties.push({
            ...property,
            distanceInfo: distanceResult
          });
        }
      });

      console.log(`Route distance calculation successful: ${filteredProperties.length} properties within ${radiusKm}km`);
      return filteredProperties;

    } catch (error) {
      console.warn('Route distance calculation failed, falling back to straight-line distance:', error);

      // Fallback to straight-line distance
      try {
        return properties.filter(property => {
          if (!property || typeof property !== 'object') return false;
          const coords = LocationManager.extractCoordsFromLink(property.location);
          if (!coords) return false;

          const distance = LocationManager.calculateStraightLineDistance(
            centerLocation.latitude,
            centerLocation.longitude,
            coords.latitude,
            coords.longitude
          );

          return distance <= radiusKm;
        });
      } catch (fallbackError) {
        console.error('Even fallback distance calculation failed:', fallbackError);
        return [];
      }
    }
  }

  /**
   * Synchronous version for backward compatibility (uses straight-line distance)
   */
  static getPropertiesNearLocationSync<T extends SearchProperty>(
    properties: T[],
    centerLocation: Coordinates,
    radiusKm: number = 3
  ): T[] {
    if (!centerLocation) return [];

    return properties.filter(property => {
      const coords = LocationManager.extractCoordsFromLink(property.location);
      if (!coords) return false;

      const distance = LocationManager.calculateStraightLineDistance(
        centerLocation.latitude,
        centerLocation.longitude,
        coords.latitude,
        coords.longitude
      );

      return distance <= radiusKm;
    });
  }

  /**
   * Get properties within a radius using actual route distance
   * More accurate but slower due to API calls
   * @param properties - Array of properties
   * @param centerLocation - {latitude, longitude}
   * @param radiusKm - Radius in kilometers
   * @param mode - Travel mode: 'driving', 'walking', 'bicycling', 'transit'
   * @returns Filtered properties with distance information
   */
  static async getPropertiesNearLocationByRoute<T extends SearchProperty>(
    properties: T[],
    centerLocation: Coordinates,
    radiusKm: number = 3,
    mode: string = 'driving'
  ): Promise<T[]> {
    if (!centerLocation || !properties.length) return [];

    try {
      // Extract coordinates from all properties
      const propertiesWithCoords = properties
        .map(property => {
          const coords = LocationManager.extractCoordsFromLink(property.location);
          return coords ? { ...property, coords } : null;
        })
        .filter((p): p is T & { coords: Coordinates } => p !== null);

      if (propertiesWithCoords.length === 0) return [];

      // Get destinations for batch calculation
      const destinations = propertiesWithCoords.map(p => p.coords);

      // Calculate route distances in batches
      const distanceResults = await LocationManager.calculateBatchRouteDistances(
        centerLocation,
        destinations,
        mode
      );

      // Filter properties within radius and add distance info
      const filteredProperties: T[] = [];

      propertiesWithCoords.forEach((property, index) => {
        const distanceResult = distanceResults[index];

        if (distanceResult && distanceResult.distance.value <= radiusKm) {
          filteredProperties.push({
            ...property,
            distanceInfo: distanceResult
          });
        }
      });

      // Sort by distance (closest first)
      return filteredProperties.sort((a, b) => {
        const distA = a.distanceInfo?.distance?.value ?? Infinity;
        const distB = b.distanceInfo?.distance?.value ?? Infinity;
        return distA - distB;
      });

    } catch (error) {
      console.error('Error in route-based property filtering:', error);
      // Fallback to straight-line distance
      return this.getPropertiesNearLocation(properties, centerLocation, radiusKm, mode);
    }
  }

  /**
   * Add route distance information to properties
   * Useful for displaying actual travel time and distance
   * @param properties - Array of properties
   * @param userLocation - {latitude, longitude}
   * @param mode - Travel mode
   * @returns Properties with distance information added
   */
  static async enrichPropertiesWithRouteDistance<T extends SearchProperty>(
    properties: T[],
    userLocation: Coordinates,
    mode: string = 'driving'
  ): Promise<T[]> {
    if (!userLocation || !properties.length) return properties;

    try {
      // Extract coordinates from properties
      const propertiesWithCoords = properties
        .map(property => {
          const coords = LocationManager.extractCoordsFromLink(property.location);
          return { property, coords };
        });

      // Get only properties with valid coordinates
      const validProperties = propertiesWithCoords.filter((p): p is { property: T; coords: Coordinates } => p.coords !== null);
      const destinations = validProperties.map(p => p.coords);

      if (destinations.length === 0) {
        // Return original properties if no valid coordinates
        return properties;
      }

      // Calculate route distances
      const distanceResults = await LocationManager.calculateBatchRouteDistances(
        userLocation,
        destinations,
        mode
      );

      // Add distance information to properties
      let resultIndex = 0;
      return propertiesWithCoords.map(({ property, coords }) => {
        if (coords) {
          const distanceInfo = distanceResults[resultIndex];
          resultIndex++;

          return {
            ...property,
            distanceInfo: distanceInfo || {
              success: false,
              distance: {
                value: LocationManager.calculateStraightLineDistance(
                  userLocation.latitude, userLocation.longitude,
                  coords.latitude, coords.longitude
                ),
                text: 'Approx.',
                unit: 'km'
              },
              fallback: true
            }
          };
        } else {
          // Property without coordinates
          return {
            ...property,
            distanceInfo: {
              success: false,
              distance: { value: null, text: 'N/A', unit: 'km' },
              error: 'No coordinates available'
            }
          };
        }
      });

    } catch (error) {
      console.error('Error enriching properties with route distance:', error);
      return properties;
    }
  }
}

/**
 * Filter Management Utilities
 */
export class FilterManager {
  /**
   * Apply all filters to properties
   */
  static applyFilters<T extends SearchProperty>(properties: T[], filters: SearchFilters): T[] {
    let filtered = [...properties];

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property =>
        property.propertyType === filters.propertyType
      );
    }

    // Independent property filter
    if (filters.isIndependent !== undefined && filters.isIndependent !== null) {
      filtered = filtered.filter(property =>
        property.isIndependent === filters.isIndependent
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(property => {
        const price = typeof property.price === 'number'
          ? property.price
          : parseFloat(property.price?.replace(/[^\d.]/g, '') || '0');
        return price >= filters.priceRange![0] && price <= filters.priceRange![1];
      });
    }

    // Availability check
    filtered = filtered.filter(property => property.available !== false);

    return filtered;
  }

  /**
   * Sort properties based on sort criteria
   */
  static sortProperties<T extends SearchProperty>(properties: T[], sortBy: string): T[] {
    const sorted = [...properties];

    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
          return priceA - priceB;
        });
      case 'price_high':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
          return priceB - priceA;
        });
      case 'distance_near':
        return sorted.sort((a, b) => {
          const distanceA = a.distanceInfo?.distance?.value ?? Infinity;
          const distanceB = b.distanceInfo?.distance?.value ?? Infinity;
          return distanceA - distanceB;
        });
      case 'distance_far':
        return sorted.sort((a, b) => {
          const distanceA = a.distanceInfo?.distance?.value ?? -Infinity;
          const distanceB = b.distanceInfo?.distance?.value ?? -Infinity;
          return distanceB - distanceA;
        });
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      case 'relevance':
      default:
        return sorted; // Keep original order for relevance
    }
  }

  /**
   * Get default filters
   */
  static getDefaultFilters(): SearchFilters {
    return {
      propertyType: '',
      isIndependent: null,
      priceRange: [0, 100000],
      kmRange: 3,
      sortBy: 'relevance',
    };
  }
}

/**
 * Map Management Utilities
 */
export class MapManager {
  // Track animation state to prevent concurrent animations
  static isAnimating: boolean = false;
  static animationTimeout: any = null;

  /**
   * Calculate region to fit all properties
   */
  static calculateRegionForProperties<T extends SearchProperty>(properties: T[]): MapRegion | null {
    if (properties.length === 0) return null;

    const coordinates = properties
      .map(property => LocationManager.extractCoordsFromLink(property.location))
      .filter((c): c is Coordinates => c !== null);

    if (coordinates.length === 0) return null;

    let minLat = coordinates[0].latitude;
    let maxLat = coordinates[0].latitude;
    let minLon = coordinates[0].longitude;
    let maxLon = coordinates[0].longitude;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
      minLon = Math.min(minLon, coord.longitude);
      maxLon = Math.max(maxLon, coord.longitude);
    });

    const latitudeDelta = (maxLat - minLat) * 1.3; // Add padding
    const longitudeDelta = (maxLon - minLon) * 1.3;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta: Math.max(latitudeDelta, 0.01),
      longitudeDelta: Math.max(longitudeDelta, 0.01),
    };
  }

  /**
   * Create region for a single location
   */
  static createRegionForLocation(location: Coordinates, delta: number = DEFAULT_REGION_DELTA): MapRegion {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    };
  }

  /**
   * Safely animate map with proper timing and error handling
   */
  static safeAnimateToRegion(mapRef: { current: any }, region: MapRegion, duration: number = 1000): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!mapRef?.current) {
          console.warn('Map ref not available for animation');
          resolve(false);
          return;
        }

        // Prevent concurrent animations
        if (this.isAnimating) {
          console.log('Animation already in progress, skipping');
          resolve(false);
          return;
        }

        this.isAnimating = true;

        // Clear any existing timeout
        if (this.animationTimeout) {
          clearTimeout(this.animationTimeout);
        }

        // Use setTimeout to ensure the map is ready and avoid view hierarchy issues
        this.animationTimeout = setTimeout(() => {
          try {
            if (typeof mapRef.current.animateToRegion === 'function') {
              mapRef.current.animateToRegion(region, duration);
              console.log('✅ Map animation started successfully');
            } else {
              console.warn('animateToRegion is not a function on mapRef.current');
            }

            // Reset animation flag after animation completes
            setTimeout(() => {
              this.isAnimating = false;
              resolve(true);
            }, duration + 100); // Add small buffer

          } catch (animationError) {
            console.error('❌ Map animation error:', animationError);
            this.isAnimating = false;
            resolve(false);
          }
        }, 100); // Small delay to ensure view hierarchy is stable

      } catch (error) {
        console.error('❌ Safe animate error:', error);
        this.isAnimating = false;
        resolve(false);
      }
    });
  }

  /**
   * Animate map to show properties or location with improved error handling
   */
  static async animateMapToContent<T extends SearchProperty>(
    mapRef: { current: any },
    properties: T[],
    searchLocation: Coordinates | null,
    userLocation: Coordinates | null
  ): Promise<string> {
    if (!mapRef?.current) {
      console.warn('Map ref not available');
      return 'no_ref';
    }

    try {
      let region: MapRegion | null = null;
      let animationType = 'none';

      // Determine what to show
      if (properties.length > 0) {
        region = this.calculateRegionForProperties(properties);
        animationType = 'properties';
        console.log('📍 Animating to show properties:', properties.length);
      } else if (searchLocation) {
        region = this.createRegionForLocation(searchLocation);
        animationType = 'search_location';
        console.log('📍 Animating to search location');
      } else if (userLocation) {
        region = this.createRegionForLocation(userLocation);
        animationType = 'user_location';
        console.log('📍 Animating to user location');
      }

      if (region) {
        const success = await this.safeAnimateToRegion(mapRef, region, 1000);
        return success ? animationType : 'animation_failed';
      }

      return 'no_region';
    } catch (error) {
      console.error('❌ Error in animateMapToContent:', error);
      this.isAnimating = false;
      return 'error';
    }
  }

  /**
   * Reset animation state (useful for cleanup)
   */
  static resetAnimationState(): void {
    this.isAnimating = false;
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }
  }
}

/**
 * Debounce utility for search inputs
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Cleanup utility for MapManager
 */
export const cleanupMapManager = (): void => {
  MapManager.resetAnimationState();
};
