import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, SlidersHorizontal, Home, Heart, MessageCircle } from 'lucide-react';
import styles from '../styles/SearchPage.module.css';
import logoImage from '/logo.png';
import { propertyService } from '../services/propertyService';
import { locationPages } from '../utils/locationPages';

interface SearchProperty {
  id: string;
  title: string;
  city: string;
  location: string;
  address: string;
  price: number | string;
  rating: string;
  badge: string;
  features: string;
  image: string;
  description?: string;
  propertyType?: string;
  furnishing?: string;
}

const SearchPage: React.FC = () => {
  // Filter States
  const [city, setCity] = useState('Jaipur');
  const [locality, setLocality] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [furnishing, setFurnishing] = useState('all');

  // UI States
  const [properties, setProperties] = useState<SearchProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Open sidebar by default on desktop

  // Fetch all properties (live + mock static properties)
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        // 1. Fetch live properties from Firestore using propertyService
        const liveProps = await propertyService.getAllProperties();
        const formattedLive: SearchProperty[] = liveProps.map(p => ({
          id: p.id,
          title: p.title || '',
          city: p.city || 'Jaipur',
          location: p.location || '',
          address: p.address || '',
          price: p.price || 0,
          rating: p.rating || '5.0',
          badge: p.badge || p.propertyType || 'Flat',
          features: p.features || `${p.propertyType || 'Flat'} • ${p.area || 0} sq.ft`,
          image: p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
          description: p.description || '',
          propertyType: (p.propertyType || '').toLowerCase(),
          furnishing: (p.furnishing || '').toLowerCase()
        }));

        // 2. Fetch mock static properties from locationPages
        const formattedMock: SearchProperty[] = [];
        locationPages.forEach(page => {
          if (page.properties) {
            page.properties.forEach(p => {
              // Parse price string like "₹12,000/mo" to number if possible
              const cleanedPrice = p.price ? parseInt(p.price.replace(/[^\d]/g, ''), 10) : 0;
              formattedMock.push({
                id: `mock-${p.id}`,
                title: p.title || '',
                city: page.city || 'Jaipur',
                location: p.location || '',
                address: p.location || '',
                price: cleanedPrice || p.price,
                rating: p.rating || '4.8',
                badge: p.badge || p.type || 'Flat',
                features: p.features ? p.features.join(' • ') : '',
                image: p.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
                description: p.description || '',
                propertyType: (p.type || '').toLowerCase(),
                furnishing: 'semi-furnished' // fallback
              });
            });
          }
        });

        // Combine (avoiding duplicates if any)
        const combined = [...formattedLive, ...formattedMock];
        setProperties(combined);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Filter properties client-side
  useEffect(() => {
    let result = properties;

    // Filter by City
    if (city) {
      result = result.filter(p => p.city.toLowerCase() === city.toLowerCase());
    }

    // Filter by Locality
    if (locality.trim()) {
      const normalizedLoc = locality.toLowerCase().trim();
      result = result.filter(p =>
        p.location.toLowerCase().includes(normalizedLoc) ||
        p.address.toLowerCase().includes(normalizedLoc) ||
        p.title.toLowerCase().includes(normalizedLoc)
      );
    }

    // Filter by Price range
    if (minPrice) {
      const min = parseInt(minPrice, 10);
      result = result.filter(p => {
        const pPrice = typeof p.price === 'number' ? p.price : parseInt(p.price.replace(/[^\d]/g, ''), 10);
        return pPrice >= min;
      });
    }
    if (maxPrice) {
      const max = parseInt(maxPrice, 10);
      result = result.filter(p => {
        const pPrice = typeof p.price === 'number' ? p.price : parseInt(p.price.replace(/[^\d]/g, ''), 10);
        return pPrice <= max;
      });
    }

    // Filter by Property Type
    if (propertyType !== 'all') {
      const typeLower = propertyType.toLowerCase();
      result = result.filter(p => p.propertyType?.includes(typeLower) || p.badge?.toLowerCase().includes(typeLower));
    }

    // Filter by Furnishing
    if (furnishing !== 'all') {
      const furnLower = furnishing.toLowerCase();
      result = result.filter(p => p.furnishing?.includes(furnLower) || p.features?.toLowerCase().includes(furnLower));
    }

    setFilteredProperties(result);
  }, [properties, city, locality, minPrice, maxPrice, propertyType, furnishing]);

  const handleClearFilters = () => {
    setLocality('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('all');
    setFurnishing('all');
  };

  return (
    <div className={styles.searchPageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logoLink}>
            <img src={logoImage} alt="SettleKar Logo" className={styles.logo} />
            <span className={styles.logoText}>SettleKar</span>
          </Link>
          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/dashboard" className={styles.navLinkCta}>List Property</Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className={styles.mainLayout}>
        {/* Toggle Filters Button for Mobile */}
        <button
          className={styles.mobileFilterBtn}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <SlidersHorizontal size={18} />
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Sidebar Filters */}
        <aside className={`${styles.sidebar} ${isFilterOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3>Filter Properties</h3>
            <button className={styles.clearBtn} onClick={handleClearFilters}>Clear All</button>
          </div>

          <div className={styles.filterGroup}>
            <label>City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className={styles.select}>
              <option value="Jaipur">Jaipur</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Locality / Area</label>
            <div className={styles.inputIconWrapper}>
              <MapPin size={16} className={styles.inputIcon} />
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Vaishali Nagar"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Budget (Monthly Rent)</label>
            <div className={styles.priceRange}>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ₹"
                className={styles.priceInput}
              />
              <span className={styles.priceDivider}>to</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹"
                className={styles.priceInput}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Configuration / Type</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={styles.select}>
              <option value="all">All Configurations</option>
              <option value="1 bhk">1 BHK</option>
              <option value="2 bhk">2 BHK</option>
              <option value="3 bhk">3 BHK</option>
              <option value="pg">PG / Co-Living</option>
              <option value="studio">Studio Apartment</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Furnishing Status</label>
            <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)} className={styles.select}>
              <option value="all">All</option>
              <option value="fully">Fully Furnished</option>
              <option value="semi">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>
        </aside>

        {/* Results Area */}
        <main className={styles.resultsArea}>
          <div className={styles.resultsHeader}>
            <h2>
              {loading ? 'Searching properties...' : `${filteredProperties.length} Properties found in ${city}`}
            </h2>
          </div>

          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className={styles.emptyState}>
              <Home size={48} className={styles.emptyIcon} />
              <h3>No Properties Match Your Filters</h3>
              <p>Try widening your price range, typing a different locality, or clearing filters.</p>
              <button className={styles.emptyStateBtn} onClick={handleClearFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.propertiesGrid}>
              {filteredProperties.map((p) => {
                const displayPrice = typeof p.price === 'number'
                  ? `₹${p.price.toLocaleString('en-IN')}/mo`
                  : p.price;

                return (
                  <div key={p.id} className={styles.propertyCard}>
                    <div className={styles.cardImageWrapper}>
                      <img src={p.image} alt={p.title} className={styles.cardImage} />
                      <span className={styles.cardBadge}>{p.badge}</span>
                      <button className={styles.wishlistHeartBtn} aria-label="Add to Wishlist">
                        <Heart size={18} />
                      </button>
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.cardRating}>★ {p.rating}</span>
                      <h3 className={styles.cardTitle}>{p.title}</h3>
                      <p className={styles.cardAddress}>📍 {p.address || p.location}</p>
                      <p className={styles.cardFeatures}>{p.features}</p>
                      {p.description && (
                        <p className={styles.cardDescription}>{p.description.substring(0, 80)}...</p>
                      )}
                      <div className={styles.cardFooter}>
                        <span className={styles.cardPrice}>{displayPrice}</span>
                        <Link to={`/property/${p.id.toString().replace('mock-', '')}`} className={styles.contactBtn}>
                          <MessageCircle size={14} />
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
