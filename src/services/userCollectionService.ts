import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserData {
  userId: string;
  username: string;
  userEmail: string;
  userPhone?: string;
  userBio?: string;
  userprofile?: string | null;
  role: 'owner' | 'broker' | 'firm' | 'tenant';
  provider: 'google' | 'email';
  pushToken?: string | null;
  [key: string]: any;
}

export const userCollectionService = {
  // Create or update user document in Firestore
  createOrUpdateUser: async (userData: UserData): Promise<UserData> => {
    try {
      const userRef = doc(db, 'users', userData.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...userData,
          updatedAt: new Date()
        });
        return { id: userData.userId, ...userData };
      } else {
        // Create new user
        const newUser = {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(userRef, newUser);
        return { id: userData.userId, ...newUser };
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  // Get user document by ID
  getUserById: async (userId: string): Promise<any | null> => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<UserData>): Promise<{ success: boolean }> => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Delete user document
  deleteUser: async (userId: string): Promise<{ success: boolean }> => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};
