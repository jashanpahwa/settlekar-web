import { propertyRepo } from '../repositories';

export interface PropertyData {
  title: string;
  description: string;
  price: number | string;
  city: string;
  location: string;
  address: string;
  propertyType: string;
  isIndependent?: boolean;
  ownerName?: string;
  ownerContact?: string;
  area?: number;
  furnishing?: string;
  image?: string;
  images?: string[];
  indoorImages?: string[];
  outdoorImages?: string[];
  badge?: string;
  features?: string;
  securityFees?: number;
  advanceRentMonths?: number;
  brokerage?: number;
  totalAdvance?: number;
  listedByRole?: string | null;
  overallscore?: number | null;
  overallScore?: number | null;
  pillars?: any | null;
  meta?: any | null;
  confidence?: any | null;
  isVerified?: boolean;
  verifiedDetails?: string[];
  ratingCount?: number;
  ratingSum?: number;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
  // ─── Verification Fields ──────────────────────────────────────────────────
  availabilityExpiresAt?: any;           // Timestamp: auto-expiry (lastAvailabilitySetAt + 7 days)
  lastAvailabilitySetAt?: any;           // Timestamp: when owner last manually set available=true
  videoVerificationUrl?: string;         // Firebase Storage URL of verification video
  videoVerificationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
  videoVerificationSubmittedAt?: any;    // When video was last uploaded
  videoVerificationLocation?: {          // GPS coords captured at video upload time
    lat: number;
    lng: number;
  };
  videoVerificationScheduledDeletion?: any; // Timestamp: 1 week after upload for storage cleanup
  [key: string]: any;
}

export const propertyService = {
  clearCache: () => {
    propertyRepo.clearCache();
  },

  getAllProperties: async (): Promise<any[]> => {
    return propertyRepo.getAllProperties();
  },

  getPropertiesByCity: async (city: string): Promise<any[]> => {
    return propertyRepo.getPropertiesByCity(city);
  },

  getPropertiesRealtime(onUpdate: (properties: any[]) => void, onError: (error: any) => void) {
    return propertyRepo.getPropertiesRealtime(onUpdate, onError);
  },

  getPropertyById: async (id: string): Promise<any> => {
    return propertyRepo.getPropertyById(id);
  },

  searchProperties: async (searchText: string): Promise<any[]> => {
    return propertyRepo.searchProperties(searchText);
  },

  getFeaturedProperties: async (): Promise<any[]> => {
    return propertyRepo.getFeaturedProperties();
  },

  addProperty: async (propertyData: PropertyData, indoorImages: (File | Blob)[] = [], outdoorImages: (File | Blob)[] = []): Promise<any> => {
    return propertyRepo.addProperty(propertyData, indoorImages, outdoorImages);
  },

  updateProperty: async (propertyId: string, propertyData: PropertyData, newIndoorImages: (File | Blob)[] = [], newOutdoorImages: (File | Blob)[] = [], imagesToDelete: string[] = []): Promise<{ success: boolean }> => {
    return propertyRepo.updateProperty(propertyId, propertyData, newIndoorImages, newOutdoorImages, imagesToDelete);
  },

  getUserProperties: async (userId: string, bypassCache: boolean = false): Promise<any[]> => {
    return propertyRepo.getUserProperties(userId, bypassCache);
  },

  deleteProperty: async (propertyId: string): Promise<{ success: boolean }> => {
    return propertyRepo.deleteProperty(propertyId);
  },

  // ─── Availability Management ─────────────────────────────────────────────

  /**
   * Manually re-enable a property's availability.
   * Resets the 7-day expiry timer from now.
   */
  enableAvailability: async (propertyId: string): Promise<{ success: boolean }> => {
    return propertyRepo.setAvailability(propertyId, true);
  },

  setAvailability: async (propertyId: string, available: boolean): Promise<{ success: boolean }> => {
    return propertyRepo.setAvailability(propertyId, available);
  },

  /**
   * Check all of a user's properties and auto-expire any whose availabilityExpiresAt has passed.
   * Call this on dashboard load.
   */
  checkAndExpireAvailabilities: async (propertyIds: string[]): Promise<string[]> => {
    return propertyRepo.checkAndExpireAvailabilities(propertyIds);
  },
};
