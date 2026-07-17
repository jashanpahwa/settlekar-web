import { wishlistRepo } from '../repositories';

export const wishlistService = {
  addToWishlist: async (userId: string, propertyId: string): Promise<string> => {
    return wishlistRepo.addToWishlist(userId, propertyId);
  },

  getWishlistRealtime: (userId: string, callback: (items: any[]) => void) => {
    return wishlistRepo.getWishlistRealtime(userId, callback);
  },

  getWishlistCountRealtime: (userId: string, callback: (size: number) => void) => {
    return wishlistRepo.getWishlistCountRealtime(userId, callback);
  },

  removeFromWishlist: async (userId: string, propertyId: string): Promise<void> => {
    return wishlistRepo.removeFromWishlist(userId, propertyId);
  },

  removeFromWishlistById: async (wishlistId: string): Promise<void> => {
    return wishlistRepo.removeFromWishlistById(wishlistId);
  },

  getWishlist: async (userId: string): Promise<any[]> => {
    return wishlistRepo.getWishlist(userId);
  },

  isInWishlist: async (userId: string, propertyId: string): Promise<{ exists: boolean; wishlistItemId: string | null }> => {
    return wishlistRepo.isInWishlist(userId, propertyId);
  },

  getWishlistedPropertyIds: async (userId: string): Promise<string[]> => {
    return wishlistRepo.getWishlistedPropertyIds(userId);
  }
};
