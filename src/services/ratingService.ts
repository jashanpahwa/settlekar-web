import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { propertyService } from './propertyService';

export const ratingService = {
  /**
   * Submits a rating for a property securely, storing a unique vote doc under
   * properties/{propertyId}/userRatings/{userId} and updating the parent aggregates.
   * Restricts users to one vote per property.
   */
  submitRating: async (propertyId: string, ratingValue: number): Promise<{ average: number; count: number }> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be signed in to rate a property.');
    }

    if (ratingValue < 1 || ratingValue > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }

    const userId = user.uid;
    const propertyRef = doc(db, 'properties', propertyId);
    const ratingRef = doc(db, 'properties', propertyId, 'userRatings', userId);

    // Use a transaction to safely read/write subcollection doc and aggregate parent
    const result = await runTransaction(db, async (transaction) => {
      // 1. Check if user already rated this property
      const ratingDoc = await transaction.get(ratingRef);
      if (ratingDoc.exists()) {
        throw new Error('You have already rated this property.');
      }

      // 2. Fetch the property document
      const propDoc = await transaction.get(propertyRef);
      if (!propDoc.exists()) {
        throw new Error('Property does not exist.');
      }

      const data = propDoc.data();
      
      // Extract current aggregates
      let currentRatingAvg = 4.5;
      if (data.rating) {
        currentRatingAvg = parseFloat(data.rating) || 4.5;
      }
      
      let currentCount = Number(data.ratingCount) || 1;
      let currentSum = currentRatingAvg * currentCount;

      // Calculate new aggregates
      const newCount = currentCount + 1;
      const newSum = currentSum + ratingValue;
      const newAvg = Math.round((newSum / newCount) * 10) / 10;

      // 3. Save individual rating record
      transaction.set(ratingRef, {
        rating: ratingValue,
        createdAt: new Date(),
        userId: userId
      });

      // 4. Update the aggregate on the parent property document
      transaction.update(propertyRef, {
        rating: newAvg.toFixed(1),
        ratingCount: newCount,
        ratingSum: newSum,
        updatedAt: new Date()
      });

      return { average: newAvg, count: newCount };
    });

    propertyService.clearCache();
    return result;
  },

  /**
   * Retrieves the user's submitted rating value for the given property from Firestore.
   */
  getUserSubmittedRating: async (propertyId: string, userId: string): Promise<number | null> => {
    try {
      const ratingRef = doc(db, 'properties', propertyId, 'userRatings', userId);
      const ratingSnap = await getDoc(ratingRef);
      if (ratingSnap.exists()) {
        return Number(ratingSnap.data().rating) || null;
      }
      return null;
    } catch (e) {
      console.error('Error fetching user rating:', e);
      return null;
    }
  }
};
