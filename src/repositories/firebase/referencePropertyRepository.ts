import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { ReferenceProperty } from '../../services/referencePropertyService';
import { IReferencePropertyRepository } from '../types';

export class FirebaseReferencePropertyRepository implements IReferencePropertyRepository {
  async addReferenceProperty(referenceData: Omit<ReferenceProperty, 'id'>): Promise<void> {
    try {
      const docRef = await addDoc(collection(db, 'references'), referenceData);
      console.log('Reference property added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding reference property:', error);
      throw error;
    }
  }

  async getAllReferenceProperties(): Promise<ReferenceProperty[]> {
    try {
      const q = collection(db, 'references');
      const querySnapshot = await getDocs(q);
      const references: ReferenceProperty[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        references.push({
          id: docSnap.id,
          title: data.title || '',
          price: data.price || 0,
          city: data.city || '',
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : data.expiryDate
        });
      });

      return references;
    } catch (error) {
      console.error('Error getting reference properties:', error);
      throw error;
    }
  }

  getReferencePropertiesRealtime(
    onUpdate: (references: ReferenceProperty[]) => void,
    onError: (error: any) => void
  ): (() => void) {
    try {
      const q = collection(db, 'references');

      const unsubscribe = onSnapshot(q,
        (querySnapshot) => {
          const references: ReferenceProperty[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            references.push({
              id: docSnap.id,
              title: data.title || '',
              price: data.price || 0,
              city: data.city || '',
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
              expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : data.expiryDate
            });
          });
          onUpdate(references);
        },
        (error) => {
          console.error('Real-time reference properties error:', error);
          onError(error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time reference properties:', error);
      onError(error);
      return () => { };
    }
  }

  async getReferencePropertyById(referenceId: string): Promise<ReferenceProperty | null> {
    try {
      const docRef = doc(db, 'references', referenceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          price: data.price || 0,
          city: data.city || '',
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : data.expiryDate
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting reference property by ID:', error);
      throw error;
    }
  }
}
