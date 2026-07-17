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
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { PropertyData } from '../../services/propertyService';
import { IPropertyRepository } from '../types';
import { FirebaseStorageRepository } from './storageRepository';
import { FirebaseInquiryRepository } from './inquiryRepository';

const storageRepo = new FirebaseStorageRepository();
const inquiryRepo = new FirebaseInquiryRepository();

let userPropertiesCache: Record<string, { data: any[]; timestamp: number }> = {};

export class FirebasePropertyRepository implements IPropertyRepository {
  clearCache(): void {
    userPropertiesCache = {};
  }

  async getAllProperties(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const now = new Date();
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out unavailable and availability-expired properties
        if (data.available === false) return;
        if (data.availabilityExpiresAt) {
          const expiresAt: Date = data.availabilityExpiresAt?.toDate?.() ?? new Date(0);
          if (now > expiresAt) return;
        }
        properties.push({ id: doc.id, ...data });
      });
      return properties;
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  }

  async getPropertiesByCity(city: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'properties'),
        where('city', '==', city)
      );
      const querySnapshot = await getDocs(q);
      const now = new Date();
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.available === false) return;
        if (data.availabilityExpiresAt) {
          const expiresAt: Date = data.availabilityExpiresAt?.toDate?.() ?? new Date(0);
          if (now > expiresAt) return;
        }
        properties.push({ id: doc.id, ...data });
      });
      return properties;
    } catch (error) {
      console.error('Error getting properties by city:', error);
      throw error;
    }
  }

  getPropertiesRealtime(
    onUpdate: (properties: any[]) => void,
    onError: (error: any) => void
  ): () => void {
    const q = query(collection(db, "properties"));
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const now = new Date();
        const properties: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.available === false) return;
          if (data.availabilityExpiresAt) {
            const expiresAt: Date = data.availabilityExpiresAt?.toDate?.() ?? new Date(0);
            if (now > expiresAt) return;
          }
          properties.push({ id: doc.id, ...data });
        });
        onUpdate(properties);
      },
      (error) => {
        onError(error);
      }
    );

    return unsubscribe;
  }

  async getPropertyById(id: string): Promise<any> {
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
  }

  async searchProperties(searchText: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'properties'),
        where('keywords', 'array-contains', searchText.toLowerCase())
      );

      const querySnapshot = await getDocs(q);
      const now = new Date();
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.available === false) return;
        if (data.availabilityExpiresAt) {
          const expiresAt: Date = data.availabilityExpiresAt?.toDate?.() ?? new Date(0);
          if (now > expiresAt) return;
        }
        properties.push({ id: doc.id, ...data });
      });
      return properties;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  async getFeaturedProperties(): Promise<any[]> {
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
  }

  async addProperty(
    propertyData: PropertyData,
    indoorImages: (File | Blob)[] = [],
    outdoorImages: (File | Blob)[] = []
  ): Promise<any> {
    try {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Date-Only
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 7);
      expiresAt.setHours(0, 0, 0, 0); // Date-Only
      const isAvailable = propertyData.available !== false;

      const propertyWithBaseData = {
        ...propertyData,
        available: isAvailable,
        lastAvailabilitySetAt: isAvailable ? Timestamp.fromDate(now) : null,
        availabilityExpiresAt: isAvailable ? Timestamp.fromDate(expiresAt) : null,
        sentExpiryWarnings: [],
        indoorImages: [] as string[],
        outdoorImages: [] as string[],
        images: [] as string[],
        createdAt: now
      };

      const docRef = await addDoc(collection(db, 'properties'), propertyWithBaseData);
      const propertyId = docRef.id;

      let indoorImageUrls: string[] = [];
      if (indoorImages.length > 0) {
        indoorImageUrls = await storageRepo.uploadMultipleImages(
          indoorImages,
          `properties/${propertyId}/`
        );
      }

      let outdoorImageUrls: string[] = [];
      if (outdoorImages.length > 0) {
        outdoorImageUrls = await storageRepo.uploadMultipleImages(
          outdoorImages,
          `properties/${propertyId}/`
        );
      }

      const allImageUrls = [...indoorImageUrls, ...outdoorImageUrls];

      const updatedProperty = {
        ...propertyData,
        available: isAvailable,
        lastAvailabilitySetAt: isAvailable ? Timestamp.fromDate(now) : null,
        availabilityExpiresAt: isAvailable ? Timestamp.fromDate(expiresAt) : null,
        sentExpiryWarnings: [],
        indoorImages: indoorImageUrls,
        outdoorImages: outdoorImageUrls,
        images: allImageUrls,
        createdAt: now
      };

      await updateDoc(docRef, updatedProperty);
      this.clearCache();

      return {
        id: propertyId,
        ...updatedProperty
      };
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  }

  async updateProperty(
    propertyId: string,
    propertyData: PropertyData,
    newIndoorImages: (File | Blob)[] = [],
    newOutdoorImages: (File | Blob)[] = [],
    imagesToDelete: string[] = []
  ): Promise<{ success: boolean }> {
    try {
      let currentIndoorImages: string[] = propertyData.indoorImages || [];
      let currentOutdoorImages: string[] = propertyData.outdoorImages || [];
      let currentAllImages: string[] = propertyData.images || [];

      if (imagesToDelete.length > 0) {
        const deletePromises = imagesToDelete.map(url =>
          storageRepo.deleteImage(url)
        );
        await Promise.all(deletePromises);

        currentIndoorImages = currentIndoorImages.filter(img => !imagesToDelete.includes(img));
        currentOutdoorImages = currentOutdoorImages.filter(img => !imagesToDelete.includes(img));
        currentAllImages = currentAllImages.filter(img => !imagesToDelete.includes(img));
      }

      let newIndoorImageUrls: string[] = [];
      if (newIndoorImages.length > 0) {
        newIndoorImageUrls = await storageRepo.uploadMultipleImages(
          newIndoorImages,
          `properties/${propertyId}/indoor/`
        );
      }

      let newOutdoorImageUrls: string[] = [];
      if (newOutdoorImages.length > 0) {
        newOutdoorImageUrls = await storageRepo.uploadMultipleImages(
          newOutdoorImages,
          `properties/${propertyId}/outdoor/`
        );
      }

      const updatedIndoorImages = [...currentIndoorImages, ...newIndoorImageUrls];
      const updatedOutdoorImages = [...currentOutdoorImages, ...newOutdoorImageUrls];
      const updatedAllImages = [...updatedIndoorImages, ...updatedOutdoorImages];

      const updatedPropertyData = {
        ...propertyData,
        indoorImages: updatedIndoorImages,
        outdoorImages: updatedOutdoorImages,
        images: updatedAllImages,
        updatedAt: new Date()
      };

      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, updatedPropertyData);
      this.clearCache();

      return { success: true };
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async getUserProperties(userId: string, bypassCache: boolean = false): Promise<any[]> {
    const now = Date.now();
    const cacheDuration = 30000;
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
  }

  async deleteProperty(propertyId: string): Promise<{ success: boolean }> {
    try {
      const property = await this.getPropertyById(propertyId);

      if (property.images && property.images.length > 0) {
        const deletePromises = property.images.map((url: string) =>
          storageRepo.deleteImage(url)
        );
        await Promise.all(deletePromises);
      }

      await inquiryRepo.deleteInquiriesByProperty(propertyId);

      await deleteDoc(doc(db, 'properties', propertyId));
      this.clearCache();

      return { success: true };
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // ─── Availability Management ─────────────────────────────────────────────────

  /**
   * Sets a property's availability. When enabling, resets the 7-day expiry timer.
   */
  async setAvailability(propertyId: string, available: boolean): Promise<{ success: boolean }> {
    try {
      const propertyRef = doc(db, 'properties', propertyId);
      const updateData: Record<string, any> = {
        available,
        updatedAt: serverTimestamp(),
      };

      if (available) {
        // Reset 7-day countdown every time the owner re-enables
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Date-Only
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + 7);
        expiresAt.setHours(0, 0, 0, 0); // Date-Only

        updateData.lastAvailabilitySetAt = Timestamp.fromDate(now);
        updateData.availabilityExpiresAt = Timestamp.fromDate(expiresAt);
        updateData.sentExpiryWarnings = [];
      }

      await updateDoc(propertyRef, updateData);
      this.clearCache();

      // Log to verificationLogs
      const userId = (await getDoc(propertyRef)).data()?.createdBy || 'unknown';
      try {
        const { addDoc: addLogDoc, collection: logCollection } = await import('firebase/firestore');
        await addLogDoc(logCollection(db, 'verificationLogs'), {
          userId,
          propertyId,
          type: 'availability_renewed',
          status: 'success',
          timestamp: serverTimestamp(),
          meta: { available },
        });
      } catch (_) { /* non-critical */ }

      return { success: true };
    } catch (error) {
      console.error('Error setting availability:', error);
      throw error;
    }
  }

  /**
   * Checks a list of property IDs and auto-expires those past their availabilityExpiresAt.
   * Returns the IDs of properties that were expired.
   */
  async checkAndExpireAvailabilities(propertyIds: string[]): Promise<string[]> {
    const expiredIds: string[] = [];
    const now = new Date();

    await Promise.allSettled(
      propertyIds.map(async (propertyId) => {
        try {
          const propertyRef = doc(db, 'properties', propertyId);
          const snap = await getDoc(propertyRef);
          if (!snap.exists()) return;

          const data = snap.data();
          // Skip if already unavailable
          if (data.available === false) return;

          const expiresAt: Date | null = data.availabilityExpiresAt?.toDate?.() ?? null;
          // No expiry set means this is an old listing without the new system — skip
          if (!expiresAt) return;

          if (now > expiresAt) {
            await updateDoc(propertyRef, {
              available: false,
              updatedAt: serverTimestamp(),
            });
            expiredIds.push(propertyId);
          }
        } catch (err) {
          console.warn(`Could not check expiry for property ${propertyId}:`, err);
        }
      })
    );

    return expiredIds;
  }
}
