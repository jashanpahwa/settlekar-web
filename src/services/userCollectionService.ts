import { userRepo } from '../repositories';

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
  createOrUpdateUser: async (userData: UserData): Promise<UserData> => {
    return userRepo.createOrUpdateUser(userData);
  },

  getUserById: async (userId: string): Promise<any | null> => {
    return userRepo.getUserById(userId);
  },

  updateUserProfile: async (userId: string, updates: Partial<UserData>): Promise<{ success: boolean }> => {
    return userRepo.updateUserProfile(userId, updates);
  },

  deleteUser: async (userId: string): Promise<{ success: boolean }> => {
    return userRepo.deleteUser(userId);
  }
};
