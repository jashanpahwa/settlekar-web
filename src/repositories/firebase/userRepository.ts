import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../../firebase';
import { UserData } from '../../services/userCollectionService';
import { IUserRepository, AuthUser } from '../types';

export class FirebaseUserRepository implements IUserRepository {
  // ─── Collection Operations ──────────────────────────────────────────────────

  async createOrUpdateUser(userData: UserData): Promise<UserData> {
    try {
      const userRef = doc(db, 'users', userData.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          ...userData,
          updatedAt: new Date()
        });
        return { id: userData.userId, ...userData };
      } else {
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
  }

  async getUserById(userId: string): Promise<any | null> {
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
  }

  async updateUserProfile(userId: string, updates: Partial<UserData>): Promise<{ success: boolean }> {
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
  }

  async deleteUser(userId: string): Promise<{ success: boolean }> {
    try {
      await deleteDoc(doc(db, 'users', userId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // ─── Auth Operations ────────────────────────────────────────────────────────

  async googleSignIn(): Promise<AuthUser> {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google Sign-In successful:');

      const userDoc = await this.getUserById(userCredential.user.uid);
      if (!userDoc || !userDoc.username) {
        await this.createOrUpdateUser({
          userId: userCredential.user.uid,
          username: userCredential.user.displayName || '',
          userEmail: userCredential.user.email || '',
          userPhone: userCredential.user.phoneNumber || '',
          userBio: '',
          userprofile: userCredential.user.photoURL || null,
          role: 'tenant',
          provider: 'google'
        });
        console.log('✅ New user document created in Firestore for Google Sign-In');
      }

      return userCredential.user;
    } catch (error) {
      console.error('Google SignIn error:', error);
      throw error;
    }
  }

  async googleSignOut(): Promise<void> {
    try {
      await this.logout();
    } catch (error) {
      console.error('Google Sign-Out error:', error);
      throw error;
    }
  }

  async isSignedInWithGoogle(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    return currentUser.providerData.some(
      (profile) => profile.providerId === 'google.com'
    );
  }

  async getCurrentGoogleUser(): Promise<AuthUser | null> {
    return auth.currentUser;
  }

  async register(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });

      await this.createOrUpdateUser({
        userId: userCredential.user.uid,
        username: name.trim(),
        userEmail: email.trim(),
        userPhone: '',
        userBio: '',
        userprofile: null,
        role: 'tenant',
        provider: 'email'
      });

      return userCredential.user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await this.getUserById(userCredential.user.uid);
      if (!userDoc || !userDoc.username) {
        await this.createOrUpdateUser({
          userId: userCredential.user.uid,
          username: userCredential.user.displayName || email.split('@')[0],
          userEmail: userCredential.user.email || email,
          userPhone: '',
          userBio: '',
          userprofile: null,
          role: 'tenant',
          provider: 'email'
        });
      }

      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          await this.updateUserProfile(userId, { pushToken: null });
          console.log('✅ Push token cleared from Firestore on logout');
        } catch (tokenError) {
          console.error('⚠️ Failed to clear push token on logout:', tokenError);
        }
      }

      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async autoLogin(): Promise<AuthUser | null> {
    return auth.currentUser;
  }

  getCurrentUser(): AuthUser | null {
    return auth.currentUser;
  }
}
