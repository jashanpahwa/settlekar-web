import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';

// Simple in-memory property cache to avoid refetching the same docs repeatedly during realtime updates
const propertyCache = new Map<string, any>();

export const wishlistService = {
  addToWishlist: async (userId: string, propertyId: string): Promise<string> => {
    try {
      // Check if already in wishlist
      const wishlistCheck = await wishlistService.isInWishlist(userId, propertyId);

      if (wishlistCheck.exists) {
        throw new Error('Property is already in wishlist');
      }

      // Add to wishlist collection
      const docRef = await addDoc(collection(db, 'wishlists'), {
        userId,
        propertyId,
        createdAt: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  getWishlistRealtime: (userId: string, callback: (items: any[]) => void) => {
    const q = query(
      collection(db, 'wishlists'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, async (querySnapshot) => {
      try {
        const docs = querySnapshot.docs;
        const ids = docs.map(d => d.data().propertyId).filter(Boolean);

        // Determine which IDs are missing in cache
        const missingIds = ids.filter(id => !propertyCache.has(id));

        // Fetch missing properties in batches of 10 using documentId() IN queries
        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < missingIds.length; i += chunkSize) {
          chunks.push(missingIds.slice(i, i + chunkSize));
        }

        if (chunks.length > 0) {
          const fetchPromises = chunks.map(async (chunk) => {
            const qProps = query(collection(db, 'properties'), where(documentId(), 'in', chunk));
            const snap = await getDocs(qProps);
            snap.forEach((pdoc) => {
              propertyCache.set(pdoc.id, { id: pdoc.id, ...pdoc.data() });
            });
          });
          await Promise.all(fetchPromises);
        }

        // Build the wishlist items from cache; remove invalid ones
        const wishlistItems = [];
        for (const docSnap of docs) {
          const wishlistData = docSnap.data();
          const property = propertyCache.get(wishlistData.propertyId);
          if (property) {
            wishlistItems.push({
              id: docSnap.id,
              propertyId: wishlistData.propertyId,
              property,
              createdAt: wishlistData.createdAt
            });
          } else {
            // Property no longer exists; clean up wishlist entry
            try {
              await deleteDoc(doc(db, 'wishlists', docSnap.id));
            } catch (e) {
              console.warn('Failed to cleanup missing property wishlist entry', docSnap.id, e);
            }
          }
        }

        callback(wishlistItems);
      } catch (e) {
        console.error('Wishlist realtime processing error:', e);
      }
    }, (error) => {
      console.error('Real-time wishlist error:', error);
    });
  },

  // Real-time wishlist count
  getWishlistCountRealtime: (userId: string, callback: (size: number) => void) => {
    const q = query(
      collection(db, 'wishlists'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (querySnapshot) => {
      callback(querySnapshot.size);
    });
  },

  removeFromWishlist: async (userId: string, propertyId: string): Promise<void> => {
    try {
      // Find the wishlist item
      const q = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        where('propertyId', '==', propertyId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Delete the wishlist document
        const wishlistDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, 'wishlists', wishlistDoc.id));
      } else {
        throw new Error('Wishlist item not found');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Remove directly by wishlist document ID
  removeFromWishlistById: async (wishlistId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'wishlists', wishlistId));
    } catch (error) {
      console.error('Error removing from wishlist by ID:', error);
      throw error;
    }
  },

  getWishlist: async (userId: string): Promise<any[]> => {
    try {
      // Get all wishlisted property IDs for this user
      const qWish = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(qWish);
      const docs = querySnapshot.docs;
      const ids = docs.map(d => d.data().propertyId).filter(Boolean);

      if (ids.length === 0) {
        return [];
      }

      // Fetch properties in batches of 10
      const chunkSize = 10;
      const chunks = [];
      for (let i = 0; i < ids.length; i += chunkSize) {
        chunks.push(ids.slice(i, i + chunkSize));
      }

      const propertiesMap = new Map<string, any>();
      await Promise.all(chunks.map(async (chunk) => {
        const qProps = query(collection(db, 'properties'), where(documentId(), 'in', chunk));
        const snap = await getDocs(qProps);
        snap.forEach((pdoc) => {
          propertiesMap.set(pdoc.id, { id: pdoc.id, ...pdoc.data() });
        });
      }));

      const wishlistItems = [];
      for (const docSnap of docs) {
        const wishlistData = docSnap.data();
        const property = propertiesMap.get(wishlistData.propertyId);
        if (property) {
          wishlistItems.push({
            id: docSnap.id,
            propertyId: wishlistData.propertyId,
            property,
            createdAt: wishlistData.createdAt
          });
        } else {
          try {
            await deleteDoc(doc(db, 'wishlists', docSnap.id));
          } catch { }
        }
      }

      return wishlistItems;
    } catch (error) {
      console.error('Error getting wishlist:', error);
      throw error;
    }
  },

  isInWishlist: async (userId: string, propertyId: string): Promise<{ exists: boolean; wishlistItemId: string | null }> => {
    try {
      const q = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        where('propertyId', '==', propertyId)
      );

      const querySnapshot = await getDocs(q);
      return {
        exists: !querySnapshot.empty,
        wishlistItemId: querySnapshot.empty ? null : querySnapshot.docs[0].id
      };
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  },

  getWishlistedPropertyIds: async (userId: string): Promise<string[]> => {
    try {
      const q = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const propertyIds: string[] = [];

      querySnapshot.forEach((doc) => {
        propertyIds.push(doc.data().propertyId);
      });

      return propertyIds;
    } catch (error) {
      console.error('Error getting wishlisted property IDs:', error);
      throw error;
    }
  }
};
