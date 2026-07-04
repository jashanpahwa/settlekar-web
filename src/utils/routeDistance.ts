/**
 * routeDistance.ts
 * Utility to calculate actual driving route distance using Google Distance Matrix API,
 * with a fallback to straight-line Haversine distance.
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD1bFpK1qmChgNVkhVwABceydgC4w55GYE';

export interface RouteDistanceResult {
  distanceKm: number;
  durationMinutes: number;
}

/**
 * Straight-line distance between two coordinates (Haversine formula)
 */
export function getHaversineDistance(
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate actual route distance between two coordinates using Google Distance Matrix API
 */
export async function calculateRouteDistance(
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

    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json?` +
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

    const distanceKm = element.distance.value / 1000; // Convert meters to km
    const durationMinutes = element.duration.value / 60; // Convert seconds to minutes

    return { distanceKm, durationMinutes };
  } catch (error) {
    console.error('Error in calculateRouteDistance:', error);
    // Fallback to Haversine
    const dist = getHaversineDistance({ lat: lat1, lng: lon1 }, { lat: lat2, lng: lon2 });
    return {
      distanceKm: dist,
      durationMinutes: dist * 2, // approximation: 30 km/h avg speed
    };
  }
}

/**
 * Calculate batch route distances from a single origin to multiple destinations
 */
export async function calculateBatchRouteDistance(
  origin: { lat: number; lng: number },
  destinations: { lat: number; lng: number }[],
  mode: string = 'driving'
): Promise<number[]> {
  if (destinations.length === 0) return [];

  const originStr = `${origin.lat},${origin.lng}`;
  const destinationsStr = destinations.map((d) => `${d.lat},${d.lng}`).join('|');

  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${encodeURIComponent(originStr)}&` +
    `destinations=${encodeURIComponent(destinationsStr)}&` +
    `mode=${mode}&` +
    `key=${GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Distance Matrix API failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'OK') {
    throw new Error(`Distance Matrix API error: ${data.status}`);
  }

  const elements = data.rows[0]?.elements || [];
  return elements.map((element: any, idx: number) => {
    if (element.status === 'OK') {
      return element.distance.value / 1000; // in km
    }
    // Fallback to Haversine
    return getHaversineDistance(origin, destinations[idx]);
  });
}

/**
 * Calculates route distances for a large list of destinations, chunking requests to 25 items
 */
export async function getRouteDistances(
  origin: { lat: number; lng: number },
  destinations: { lat: number; lng: number }[]
): Promise<number[]> {
  const results: number[] = [];
  const CHUNK_SIZE = 25;

  for (let i = 0; i < destinations.length; i += CHUNK_SIZE) {
    const chunk = destinations.slice(i, i + CHUNK_SIZE);
    try {
      const chunkDistances = await calculateBatchRouteDistance(origin, chunk);
      results.push(...chunkDistances);
    } catch (error) {
      console.error('Error fetching batch route distance chunk:', error);
      // Fallback to Haversine
      chunk.forEach((dest) => {
        results.push(getHaversineDistance(origin, dest));
      });
    }
  }

  return results;
}
