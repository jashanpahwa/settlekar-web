import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { PropertyItem } from './types';
import styles from '../../Dashboard.module.css';

interface WishlistTabProps {
  user: User;
}

const WishlistTab: React.FC<WishlistTabProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<{ id: string; propertyId: string; property: PropertyItem }[]>([]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'wishlists'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const loadedItems: { id: string; propertyId: string; property: PropertyItem }[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const propertyId = data.propertyId;
        
        if (propertyId) {
          const propDocRef = doc(db, 'properties', propertyId);
          const propDocSnap = await getDoc(propDocRef);
          if (propDocSnap.exists()) {
            const propData = propDocSnap.data();
            loadedItems.push({
              id: docSnap.id,
              propertyId,
              property: {
                id: propDocSnap.id,
                title: propData.title || '',
                city: propData.city || 'Mumbai',
                location: propData.location || '',
                address: propData.address || '',
                price: typeof propData.price === 'number' ? `₹${propData.price.toLocaleString('en-IN')}` : propData.price || '',
                rating: propData.rating || '5.0',
                badge: propData.badge || propData.propertyType || '1 BHK',
                features: propData.features || `${propData.propertyType} • ${propData.area || 0} sq.ft • ${propData.furnishing || 'Semi-Furnished'}`,
                image: propData.image || (propData.images && propData.images.length > 0 ? propData.images[0] : '') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
                isUserAdded: true,
                description: propData.description || ''
              }
            });
          } else {
            // Cleanup orphaned wishlist entry
            try {
              await deleteDoc(doc(db, 'wishlists', docSnap.id));
            } catch (err) {
              console.warn("Failed to cleanup orphaned wishlist item:", docSnap.id, err);
            }
          }
        }
      }
      setWishlistItems(loadedItems);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (wishlistId: string) => {
    if (!window.confirm("Are you sure you want to remove this property from your wishlist?")) return;
    try {
      await deleteDoc(doc(db, 'wishlists', wishlistId));
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistId));
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      alert("Failed to remove property from wishlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={styles.tabContent}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <h2>My Wishlisted Properties</h2>
        <p>Your saved properties for quick reference and future inquiries.</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>❤️</div>
          <h2>Your Wishlist is Empty</h2>
          <p>No properties wishlisted yet. Start exploring properties to save your favorites!</p>
          <a href="/" className={styles.emptyStateBtn} style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-block' }}>
            Browse Properties
          </a>
        </div>
      ) : (
        <div className={styles.listedPropertiesGrid}>
          {wishlistItems.map((item) => (
            <div key={item.id} className={styles.listedCard}>
              <div className={styles.listedCardImgLink}>
                <img src={item.property.image} alt={item.property.title} className={item.property.isUserAdded ? styles.listedCardImg : ''} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
              </div>
              <div className={styles.listedCardBody}>
                <div className={styles.listedCardHead}>
                  <h3>{item.property.title}</h3>
                  <span className={styles.listedCardBadge}>{item.property.badge}</span>
                </div>
                <p className={styles.listedCardAddr}>
                  📍 {item.property.address || item.property.location || item.property.city}
                </p>
                <p className={styles.listedCardFeat}>{item.property.features}</p>
                <div className={styles.listedCardFooter}>
                  <span className={styles.listedCardPrice}>{item.property.price}</span>
                  <div className={styles.actionBtns}>
                    <button
                      type="button"
                      className={styles.deletePropBtn}
                      onClick={() => handleRemove(item.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      aria-label={`Remove ${item.property.title}`}
                    >
                      ❤️ Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
