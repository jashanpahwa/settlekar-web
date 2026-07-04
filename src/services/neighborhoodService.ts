// Service wrapper for the LivableIndia Neighbourhood Score API

const BASE_URL = 'https://us-central1-liveableindia-314ce.cloudfunctions.net/getNeighborhoodScore';

// In Vite, environment variables are accessed via import.meta.env
const API_KEY = (import.meta.env.VITE_LIVABLE_INDIA_API_KEY) as string;

export interface NeighborhoodCoords {
  lat: number;
  lng: number;
}

export interface NeighborhoodScoreResponse {
  overallScore: number;
  overallScoreLabel: string;
  pillars: {
    safety: number;
    connectivity: number;
    amenities: number;
    environment: number;
  };
  fetchedAt?: string;
  [key: string]: any;
}

/**
 * Fetch neighbourhood score for a given lat/lng.
 *
 * @param coords
 * @returns Full API response with overallScore, pillars, etc.
 * @throws On network or API errors
 */
export async function fetchNeighborhoodScore({ lat, lng }: NeighborhoodCoords): Promise<NeighborhoodScoreResponse> {
  if (!API_KEY) {
    console.error(
      'VITE_LIVABLE_INDIA_API_KEY is not defined in the environment. ' +
      'Please ensure it is set in your .env file.'
    );
    throw new Error('API key is missing. Please configure VITE_LIVABLE_INDIA_API_KEY in your .env file.');
  }

  if (!lat || !lng) {
    throw new Error('Latitude and longitude are required');
  }

  const url = `${BASE_URL}?lat=${lat}&lng=${lng}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401 || status === 403) {
      throw new Error('API authentication failed. Please check API key.');
    } else if (status === 429) {
      throw new Error('API quota exceeded. Please try again tomorrow.');
    } else if (status === 400) {
      throw new Error('Invalid coordinates provided.');
    }
    throw new Error(`API request failed with status ${status}`);
  }

  const data = await response.json();

  // Attach fetch timestamp for staleness checks
  data.fetchedAt = new Date().toISOString();

  return data;
}

export const neighborhoodService = {
  fetchNeighborhoodScore,
};
