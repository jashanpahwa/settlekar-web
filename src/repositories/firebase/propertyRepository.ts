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
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
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
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
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
      const properties: any[] = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
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
      const propertyWithBaseData = {
        ...propertyData,
        indoorImages: [] as string[],
        outdoorImages: [] as string[],
        images: [] as string[],
        createdAt: new Date()
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
        indoorImages: indoorImageUrls,
        outdoorImages: outdoorImageUrls,
        images: allImageUrls,
        createdAt: new Date()
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
}
