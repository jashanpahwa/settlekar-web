import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface OwnerProfile {
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  govtIdType: string | null;
  govtIdNumber: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface BrokerProfile {
  userId: string;
  fullName: string;
  phone: string;
  reraNumber: string;
  city: string;
  agencyName: string | null;
  experience: number | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirmProfile {
  userId: string;
  firmName: string;
  reraNumber: string;
  contactPersonName: string;
  contactPhone: string;
  officeAddress: string;
  city: string;
  gstNumber: string | null;
  totalAgents: number | null;
  website: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export const ownerBrokerService = {
  // ─── OWNER ────────────────────────────────────────────────────────────────

  createOwnerProfile: async (userId: string, ownerData: Omit<OwnerProfile, 'userId'>) => {
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
  },

  getOwnerProfile: async (userId: string): Promise<OwnerProfile | null> => {
    try {
      const snap = await getDoc(doc(db, 'owners', userId));
      return snap.exists() ? (snap.data() as OwnerProfile) : null;
    } catch (error) {
      console.error('Error getting owner profile:', error);
      throw error;
    }
  },

  // ─── BROKER ───────────────────────────────────────────────────────────────

  createBrokerProfile: async (userId: string, brokerData: Omit<BrokerProfile, 'userId'>) => {
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
  },

  getBrokerProfile: async (userId: string): Promise<BrokerProfile | null> => {
    try {
      const snap = await getDoc(doc(db, 'brokers', userId));
      return snap.exists() ? (snap.data() as BrokerProfile) : null;
    } catch (error) {
      console.error('Error getting broker profile:', error);
      throw error;
    }
  },

  // ─── FIRM ─────────────────────────────────────────────────────────────────

  createFirmProfile: async (userId: string, firmData: Omit<FirmProfile, 'userId'>) => {
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
  },

  getFirmProfile: async (userId: string): Promise<FirmProfile | null> => {
    try {
      const snap = await getDoc(doc(db, 'firms', userId));
      return snap.exists() ? (snap.data() as FirmProfile) : null;
    } catch (error) {
      console.error('Error getting firm profile:', error);
      throw error;
    }
  },

  // ─── GENERIC HELPER ───────────────────────────────────────────────────────

  /**
   * Fetch the professional profile for a user given their role.
   * Returns null for tenants (no sub-collection document).
   */
  getProfileByRole: async (userId: string, role: 'owner' | 'broker' | 'firm' | 'tenant' | string): Promise<any | null> => {
    if (role === 'owner') return ownerBrokerService.getOwnerProfile(userId);
    if (role === 'broker') return ownerBrokerService.getBrokerProfile(userId);
    if (role === 'firm') return ownerBrokerService.getFirmProfile(userId);
    return null;
  },
};
