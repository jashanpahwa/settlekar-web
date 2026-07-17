import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { OwnerProfile, BrokerProfile, FirmProfile } from '../../services/ownerBrokerService';
import { IOwnerBrokerRepository } from '../types';

export class FirebaseOwnerBrokerRepository implements IOwnerBrokerRepository {
  // ─── OWNER ────────────────────────────────────────────────────────────────

  async createOwnerProfile(userId: string, ownerData: Omit<OwnerProfile, 'userId'>) {
    try {
      const ownerRef = doc(db, 'owners', userId);
      const snap = await getDoc(ownerRef);
      if (snap.exists()) {
        await updateDoc(ownerRef, {
          ...ownerData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ownerRef, {
          userId,
          ...ownerData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      // Update role in users/{uid}
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: 'owner', updatedAt: serverTimestamp() });

      return { success: true };
    } catch (error) {
      console.error('Error creating owner profile:', error);
      throw error;
    }
  }

  async getOwnerProfile(userId: string): Promise<OwnerProfile | null> {
    try {
      const snap = await getDoc(doc(db, 'owners', userId));
      return snap.exists() ? (snap.data() as OwnerProfile) : null;
    } catch (error) {
      console.error('Error getting owner profile:', error);
      throw error;
    }
  }

  // ─── BROKER ───────────────────────────────────────────────────────────────

  async createBrokerProfile(userId: string, brokerData: Omit<BrokerProfile, 'userId'>) {
    try {
      const brokerRef = doc(db, 'brokers', userId);
      const snap = await getDoc(brokerRef);
      if (snap.exists()) {
        await updateDoc(brokerRef, {
          ...brokerData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(brokerRef, {
          userId,
          ...brokerData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: 'broker', updatedAt: serverTimestamp() });

      return { success: true };
    } catch (error) {
      console.error('Error creating broker profile:', error);
      throw error;
    }
  }

  async getBrokerProfile(userId: string): Promise<BrokerProfile | null> {
    try {
      const snap = await getDoc(doc(db, 'brokers', userId));
      return snap.exists() ? (snap.data() as BrokerProfile) : null;
    } catch (error) {
      console.error('Error getting broker profile:', error);
      throw error;
    }
  }

  // ─── FIRM ─────────────────────────────────────────────────────────────────

  async createFirmProfile(userId: string, firmData: Omit<FirmProfile, 'userId'>) {
    try {
      const firmRef = doc(db, 'firms', userId);
      const snap = await getDoc(firmRef);
      if (snap.exists()) {
        await updateDoc(firmRef, {
          ...firmData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(firmRef, {
          userId,
          ...firmData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: 'firm', updatedAt: serverTimestamp() });

      return { success: true };
    } catch (error) {
      console.error('Error creating firm profile:', error);
      throw error;
    }
  }

  async getFirmProfile(userId: string): Promise<FirmProfile | null> {
    try {
      const snap = await getDoc(doc(db, 'firms', userId));
      return snap.exists() ? (snap.data() as FirmProfile) : null;
    } catch (error) {
      console.error('Error getting firm profile:', error);
      throw error;
    }
  }
}
