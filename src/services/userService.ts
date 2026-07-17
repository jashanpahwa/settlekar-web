import { userRepo, AuthUser as User } from '../repositories';

export const userService = {
  // Google Sign-In for Web
  googleSignIn: async (): Promise<User> => {
    return userRepo.googleSignIn();
  },

  // Google Sign-Out
  googleSignOut: async (): Promise<void> => {
    return userRepo.googleSignOut();
  },

  // Check if user is signed in
  isSignedInWithGoogle: async (): Promise<boolean> => {
    return userRepo.isSignedInWithGoogle();
  },

  // Get current user
  getCurrentGoogleUser: async (): Promise<User | null> => {
    return userRepo.getCurrentGoogleUser();
  },

  // Register with email and password
  register: async (email: string, password: string, name: string): Promise<User> => {
    return userRepo.register(email, password, name);
  },

  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    return userRepo.login(email, password);
  },

  // Logout
  logout: async (): Promise<void> => {
    return userRepo.logout();
  },

  // Reset Password
  resetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    return userRepo.resetPassword(email);
  },

  // Auto-login
  autoLogin: async (): Promise<User | null> => {
    return userRepo.autoLogin();
  }
};
