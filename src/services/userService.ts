import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { userCollectionService } from './userCollectionService';

export const userService = {
  // Google Sign-In for Web
  googleSignIn: async (): Promise<User> => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google Sign-In successful:');

      // Ensure user document exists in Firestore (checks and initializes if missing)
      const userDoc = await userCollectionService.getUserById(userCredential.user.uid);
      if (!userDoc || !userDoc.username) {
        await userCollectionService.createOrUpdateUser({
          userId: userCredential.user.uid,
          username: userCredential.user.displayName || '',
          userEmail: userCredential.user.email || '',
          userPhone: userCredential.user.phoneNumber || '',
          userBio: '',
          userprofile: userCredential.user.photoURL || null,
          role: 'tenant', // Default role
          provider: 'google'
        });
        console.log('✅ New user document created in Firestore for Google Sign-In');
      }

      return userCredential.user;
    } catch (error) {
      console.error('Google SignIn error:', error);
      throw error;
    }
  },

  // Google Sign-Out
  googleSignOut: async (): Promise<void> => {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Google Sign-Out error:', error);
      throw error;
    }
  },

  // Check if user is signed in
  isSignedInWithGoogle: async (): Promise<boolean> => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    return currentUser.providerData.some(
      (profile) => profile.providerId === 'google.com'
    );
  },

  // Get current user
  getCurrentGoogleUser: async (): Promise<User | null> => {
    return auth.currentUser;
  },

  // Register with email and password
  register: async (email: string, password: string, name: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user document in Firestore
      await userCollectionService.createOrUpdateUser({
        userId: userCredential.user.uid,
        username: name.trim(),
        userEmail: email.trim(),
        userPhone: '',
        userBio: '',
        userprofile: null,
        role: 'tenant', // Default role
        provider: 'email'
      });

      return userCredential.user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Ensure user document exists in Firestore
      const userDoc = await userCollectionService.getUserById(userCredential.user.uid);
      if (!userDoc || !userDoc.username) {
        await userCollectionService.createOrUpdateUser({
          userId: userCredential.user.uid,
          username: userCredential.user.displayName || email.split('@')[0],
          userEmail: userCredential.user.email || email,
          userPhone: '',
          userBio: '',
          userprofile: null,
          role: 'tenant', // Default role
          provider: 'email'
        });
      }

      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      // Clear push token from Firestore before signing out if user is logged in
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          await userCollectionService.updateUserProfile(userId, { pushToken: null });
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
  },

  // Reset Password
  resetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  // Auto-login (Not needed on web since SDK handles persistence automatically)
  autoLogin: async (): Promise<User | null> => {
    return auth.currentUser;
  }
};
