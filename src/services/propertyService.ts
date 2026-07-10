import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { storageService } from './storageService';
import { inquiryService } from './inquiryService';

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
  [key: string]: any;
}

let userPropertiesCache: Record<string, { data: any[]; timestamp: number }> = {};

export const propertyService = {
  clearCache: () => {
    userPropertiesCache = {};
  },

  getAllProperties: async (): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
      });
      return properties;
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  },

  // Get properties by City
  getPropertiesByCity: async (city: string): Promise<any[]> => {
    try {
      const q = query(
        collection(db, 'properties'),
        where('city', '==', city)
      );
      const querySnapshot = await getDocs(q);
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
      });
      return properties;
    } catch (error) {
      console.error('Error getting properties by city:', error);
      throw error;
    }
  },

  // Real-time properties listener
  getPropertiesRealtime(onUpdate: (properties: any[]) => void, onError: (error: any) => void) {
    const q = query(collection(db, "properties"));
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const properties: any[] = [];
        querySnapshot.forEach((doc) => {
          properties.push({ id: doc.id, ...doc.data() });
        });
        onUpdate(properties);
      },
      (error) => {
        onError(error);
      }
    );

    return unsubscribe;
  },

  getPropertyById: async (id: string): Promise<any> => {
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Property not found');
      }
    } catch (error) {
      throw error;
    }
  },

  searchProperties: async (searchText: string): Promise<any[]> => {
    try {
      const q = query(
        collection(db, 'properties'),
        where('keywords', 'array-contains', searchText.toLowerCase())
      );

      const querySnapshot = await getDocs(q);
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
      });
      return properties;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  },

  getFeaturedProperties: async (): Promise<any[]> => {
    try {
      const q = query(
        collection(db, 'properties'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
      });
      return properties;
    } catch (error) {
      console.error('Error getting featured properties:', error);
      throw error;
    }
  },

  addProperty: async (propertyData: PropertyData, indoorImages: (File | Blob)[] = [], outdoorImages: (File | Blob)[] = []): Promise<any> => {
    try {
      // First, create the property document in Firestore to get the ID
      const propertyWithBaseData = {
        ...propertyData,
        indoorImages: [] as string[],
        outdoorImages: [] as string[],
        images: [] as string[], // Keep for backward compatibility
        createdAt: new Date()
      };

      // Add document to Firestore to get the auto-generated ID
      const docRef = await addDoc(collection(db, 'properties'), propertyWithBaseData);
      const propertyId = docRef.id;

      // Upload indoor images to indoor subdirectory
      let indoorImageUrls: string[] = [];
      if (indoorImages.length > 0) {
        indoorImageUrls = await storageService.uploadMultipleImages(
          indoorImages,
          `properties/${propertyId}/`
        );
      }

      // Upload outdoor images to outdoor subdirectory
      let outdoorImageUrls: string[] = [];
      if (outdoorImages.length > 0) {
        outdoorImageUrls = await storageService.uploadMultipleImages(
          outdoorImages,
          `properties/${propertyId}/`
        );
      }

      // Combine all images for backward compatibility
      const allImageUrls = [...indoorImageUrls, ...outdoorImageUrls];

      // Update the property document with the image URLs
      const updatedProperty = {
        ...propertyData,
        indoorImages: indoorImageUrls,
        outdoorImages: outdoorImageUrls,
        images: allImageUrls, // Keep for backward compatibility
        createdAt: new Date()
      };

      await updateDoc(docRef, updatedProperty);
      propertyService.clearCache();

      return {
        id: propertyId,
        ...updatedProperty
      };
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  },

  updateProperty: async (propertyId: string, propertyData: PropertyData, newIndoorImages: (File | Blob)[] = [], newOutdoorImages: (File | Blob)[] = [], imagesToDelete: string[] = []): Promise<{ success: boolean }> => {
    try {
      let currentIndoorImages: string[] = propertyData.indoorImages || [];
      let currentOutdoorImages: string[] = propertyData.outdoorImages || [];
      let currentAllImages: string[] = propertyData.images || [];

      // Delete specified images from Storage
      if (imagesToDelete.length > 0) {
        const deletePromises = imagesToDelete.map(url =>
          storageService.deleteImage(url)
        );
        await Promise.all(deletePromises);

        // Remove deleted images from all arrays
        currentIndoorImages = currentIndoorImages.filter(img => !imagesToDelete.includes(img));
        currentOutdoorImages = currentOutdoorImages.filter(img => !imagesToDelete.includes(img));
        currentAllImages = currentAllImages.filter(img => !imagesToDelete.includes(img));
      }

      // Upload new indoor images
      let newIndoorImageUrls: string[] = [];
      if (newIndoorImages.length > 0) {
        newIndoorImageUrls = await storageService.uploadMultipleImages(
          newIndoorImages,
          `properties/${propertyId}/indoor/`
        );
      }

      // Upload new outdoor images
      let newOutdoorImageUrls: string[] = [];
      if (newOutdoorImages.length > 0) {
        newOutdoorImageUrls = await storageService.uploadMultipleImages(
          newOutdoorImages,
          `properties/${propertyId}/outdoor/`
        );
      }

      // Update image arrays
      const updatedIndoorImages = [...currentIndoorImages, ...newIndoorImageUrls];
      const updatedOutdoorImages = [...currentOutdoorImages, ...newOutdoorImageUrls];
      const updatedAllImages = [...updatedIndoorImages, ...updatedOutdoorImages];

      // Update property data with new image arrays
      const updatedPropertyData = {
        ...propertyData,
        indoorImages: updatedIndoorImages,
        outdoorImages: updatedOutdoorImages,
        images: updatedAllImages, // Keep for backward compatibility
        updatedAt: new Date()
      };

      // Update property in Firestore
      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, updatedPropertyData);
      propertyService.clearCache();

      return { success: true };
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  getUserProperties: async (userId: string, bypassCache: boolean = false): Promise<any[]> => {
    const now = Date.now();
    const cacheDuration = 30000; // 30 seconds cache duration
    if (!bypassCache && userPropertiesCache[userId] && (now - userPropertiesCache[userId].timestamp < cacheDuration)) {
      return userPropertiesCache[userId].data;
    }

    try {
      const q = query(
        collection(db, 'properties'),
        where('createdBy', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
      });

      userPropertiesCache[userId] = {
        data: properties,
        timestamp: now
      };

      return properties;
    } catch (error) {
      console.error('Error getting user properties:', error);
      throw error;
    }
  },

  deleteProperty: async (propertyId: string): Promise<{ success: boolean }> => {
    try {
      // First get the property to access image URLs
      const property = await propertyService.getPropertyById(propertyId);

      // Delete all associated images from Storage
      if (property.images && property.images.length > 0) {
        const deletePromises = property.images.map((url: string) =>
          storageService.deleteImage(url)
        );
        await Promise.all(deletePromises);
      }

      // Delete all associated inquiries from Firestore
      await inquiryService.deleteInquiriesByProperty(propertyId);

      // Delete the property document from Firestore
      await deleteDoc(doc(db, 'properties', propertyId));
      propertyService.clearCache();

      return { success: true };
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};
