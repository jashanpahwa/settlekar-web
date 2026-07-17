import { ratingRepo } from '../repositories';

export const ratingService = {
  submitRating: async (propertyId: string, ratingValue: number): Promise<{ average: number; count: number }> => {
    return ratingRepo.submitRating(propertyId, ratingValue);
  },

  getUserSubmittedRating: async (propertyId: string, userId: string): Promise<number | null> => {
    return ratingRepo.getUserSubmittedRating(propertyId, userId);
  }
};
