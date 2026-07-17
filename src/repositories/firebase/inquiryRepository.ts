import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../../firebase';
import { InquiryData } from '../../services/inquiryService';
import { IInquiryRepository } from '../types';

const COLLECTION_NAME = 'inquiries';

const mapInquiryDoc = (docSnap: any) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || null,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt || null,
  };
};

let ownerInquiriesCache: Record<string, { data: any[]; timestamp: number }> = {};

export class FirebaseInquiryRepository implements IInquiryRepository {
  clearCache() {
    ownerInquiriesCache = {};
  }

  async sendInquiry(inquiryData: InquiryData): Promise<{ success: boolean }> {
    try {
      const payload = {
        propertyId: inquiryData.propertyId,
        propertyTitle: inquiryData.propertyTitle,
        propertyPrice: inquiryData.propertyPrice || null,
        ownerId: inquiryData.ownerId,
        ownerName: inquiryData.ownerName || null,
        inquirerId: inquiryData.inquirerId,
        inquirerName: inquiryData.inquirerName || 'SettleKar User',
        inquirerEmail: inquiryData.inquirerEmail || '',
        inquirerPhone: inquiryData.inquirerPhone || '',
        message: inquiryData.message || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, COLLECTION_NAME), payload);
      this.clearCache();
      return { success: true };
    } catch (error) {
      console.error('Error sending inquiry:', error);
      throw error;
    }
  }

  async getInquiriesByOwner(ownerId: string, bypassCache: boolean = false): Promise<any[]> {
    const now = Date.now();
    const cacheDuration = 30000; // 30 seconds cache duration
    if (!bypassCache && ownerInquiriesCache[ownerId] && (now - ownerInquiriesCache[ownerId].timestamp < cacheDuration)) {
      return ownerInquiriesCache[ownerId].data;
    }

    try {
      const ownerQuery = query(
        collection(db, COLLECTION_NAME),
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(ownerQuery);
      const data = snapshot.docs.map(mapInquiryDoc);

      ownerInquiriesCache[ownerId] = {
        data,
        timestamp: now
      };

      return data;
    } catch (error) {
      console.error('Error fetching owner inquiries:', error);
      throw error;
    }
  }

  async getInquiriesByProperty(ownerId: string, propertyId: string): Promise<any[]> {
    try {
      const propertyQuery = query(
        collection(db, COLLECTION_NAME),
        where('ownerId', '==', ownerId),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(propertyQuery);
      return snapshot.docs.map(mapInquiryDoc);
    } catch (error) {
      console.error('Error fetching property inquiries:', error);
      throw error;
    }
  }

  async checkUserInquiry(inquirerId: string, propertyId: string): Promise<{ hasInquired: boolean; inquiryId: string | null; inquiry?: any }> {
    try {
      const userInquiryQuery = query(
        collection(db, COLLECTION_NAME),
        where('inquirerId', '==', inquirerId),
        where('propertyId', '==', propertyId)
      );

      const snapshot = await getDocs(userInquiryQuery);

      if (snapshot.empty) {
        return { hasInquired: false, inquiryId: null };
      }

      const inquiry = snapshot.docs[0];
      return {
        hasInquired: true,
        inquiryId: inquiry.id,
        inquiry: mapInquiryDoc(inquiry)
      };
    } catch (error) {
      console.error('Error checking user inquiry:', error);
      throw error;
    }
  }

  async deleteInquiry(inquiryId: string): Promise<{ success: boolean }> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, inquiryId));
      this.clearCache();
      return { success: true };
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      throw error;
    }
  }

  async deleteInquiriesByProperty(propertyId: string): Promise<{ success: boolean }> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('propertyId', '==', propertyId)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, COLLECTION_NAME, docSnap.id))
      );
      await Promise.all(deletePromises);
      this.clearCache();
      return { success: true };
    } catch (error) {
      console.error('Error deleting inquiries by property:', error);
      throw error;
    }
  }
}
