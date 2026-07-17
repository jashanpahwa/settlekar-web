import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { PropertyItem } from './types';
import { wishlistService } from '../../services/wishlistService';

interface WishlistTabProps {
  user: User;
}

const WishlistTab: React.FC<WishlistTabProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<{ id: string; propertyId: string; property: PropertyItem }[]>([]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const items = await wishlistService.getWishlist(user.uid);
      const loadedItems: { id: string; propertyId: string; property: PropertyItem }[] = items.map((item) => ({
        id: item.id,
        propertyId: item.propertyId,
        property: {
          id: item.property.id,
          title: item.property.title || '',
          city: item.property.city || 'Mumbai',
          location: item.property.location || '',
          address: item.property.address || '',
          price: typeof item.property.price === 'number' ? `₹${item.property.price.toLocaleString('en-IN')}` : item.property.price || '',
          rating: item.property.rating || '5.0',
          badge: item.property.badge || item.property.propertyType || '1 BHK',
          features: item.property.features || `${item.property.propertyType} • ${item.property.area || 0} sq.ft • ${item.property.furnishing || 'Semi-Furnished'}`,
          image: item.property.image || (item.property.images && item.property.images.length > 0 ? item.property.images[0] : '') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
          isUserAdded: true,
          description: item.property.description || ''
        }
      }));
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
      await wishlistService.removeFromWishlistById(wishlistId);
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistId));
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      alert("Failed to remove property from wishlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-border rounded-full border-t-primary-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="mb-6 space-y-1">
        <h2 className="font-head text-xl font-bold text-text-primary tracking-tight">My Wishlisted Properties</h2>
        <p className="text-xs text-text-secondary">Your saved properties for quick reference and future inquiries.</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-elevated rounded-2xl border border-border shadow-sm">
          <div className="text-4xl mb-4">❤️</div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">Your Wishlist is Empty</h2>
          <p className="text-sm text-text-secondary max-w-sm mb-6">No properties wishlisted yet. Start exploring properties to save your favorites!</p>
          <a href="/" className="px-4 py-2 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer no-underline text-center inline-block">
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-surface-elevated rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
              <div className="block relative h-48 overflow-hidden">
                <img src={item.property.image} alt={item.property.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-base font-semibold text-text-primary text-left">{item.property.title}</h3>
                  <span className="px-2.5 py-0.5 bg-primary-accent/10 text-primary-accent border border-primary-accent/18 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{item.property.badge}</span>
                </div>
                <p className="text-sm text-text-secondary mb-2 flex items-center flex-wrap gap-1.5 text-left">
                  📍 {item.property.address || item.property.location || item.property.city}
                </p>
                <p className="text-xs text-text-tertiary mb-4 text-left">{item.property.features}</p>
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-border-light">
                  <span className="text-lg font-bold text-text-primary font-mono">{item.property.price}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 border border-error/30 hover:border-error/50 rounded-lg transition-all cursor-pointer bg-transparent"
                      onClick={() => handleRemove(item.id)}
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
