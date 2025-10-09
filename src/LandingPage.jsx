import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import logoImage from '/logo.png';

const LandingPage = () => {

  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
          </div>
          <nav className={styles.nav}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#download" className={styles.navLink}>Download</a>
            <Link to="/privacy-policy" className={styles.navLink}>
              Privacy Policy
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <h1>Discover Your Perfect Rental Home</h1>
            <p>
              SettleKar connects property owners with tenants through a smart, secure platform. 
              Find verified rental properties or list your property with ease. Experience hassle-free 
              property discovery with location-based search, real-time updates, and direct owner communication.
            </p>
            <div className={styles.ctaButtons}>
              <a href="#download" className={`${styles.btn} ${styles.btnPrimary}`}>Download App</a>
              <a href="#features" className={`${styles.btn} ${styles.btnSecondary}`}>Explore Features</a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>Properties Listed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>5K+</span>
                <span className={styles.statLabel}>Happy Users</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Cities Covered</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.phoneMockup}>
              {/* Phone Frame */}
              <div className={styles.phoneFrame}>
                <div className={styles.phoneNotch}></div>
                <div className={styles.phoneSpeaker}></div>
                <div className={styles.phoneCamera}></div>
                <div className={styles.phoneScreen}>
                  <div className={styles.statusBar}>
                    <div className={styles.statusLeft}>
                      <span className="time">9:41</span>
                    </div>
                    <div className={styles.statusRight}>
                      <span className="signal">📶</span>
                      <span className="wifi">📶</span>
                      <span className="battery">🔋</span>
                    </div>
                  </div>
                  <div className={styles.appPreview}>
                    <div className={styles.appHeader}>
                      <div className={styles.headerContent}>
                        <div className={styles.searchContainer}>
                          <div className={styles.searchIconContainer}>
                            <span className={styles.searchIcon}>🔍</span>
                          </div>
                          <span className={styles.searchText}>Discover Properties Nearby</span>
                          <div className={styles.searchArrow}>
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.appContent}>
                      <div className={styles.citySection}>
                        <div className={styles.sectionTitle}>Bangalore</div>
                        <div className={styles.propertyCardFeatured}>
                          <div className={styles.propertyImage}>
                            <div className={styles.propertyBadge}>2 BHK</div>
                            <div className={styles.wishlistBtn}>♡</div>
                            <div className={styles.propertyTypeBadge}>Residential</div>
                          </div>
                          <div className={styles.propertyInfo}>
                            <div className={styles.locationRatingRow}>
                              <span className={styles.propertyLocation}>Koramangala</span>
                              <div className={styles.rating}>
                                <span className={styles.star}>⭐</span>
                                <span className={styles.ratingText}>4.8</span>
                              </div>
                            </div>
                            <div className={styles.propertyTitle}>Modern Apartment</div>
                            <div className={styles.propertyFeatures}>Independent house</div>
                            <div className={styles.propertyPrice}>₹28,000 <span>/month</span></div>
                          </div>
                        </div>
                        <div className={styles.propertyList}>
                          <div className={styles.propertyItem}>
                            <div className={styles.propertyThumb}></div>
                            <div className={styles.propertyDetails}>
                              <span className={styles.propertyName}>1 BHK Studio</span>
                              <span className={styles.propertyRent}>₹18,000</span>
                            </div>
                          </div>
                          <div className={styles.propertyItem}>
                            <div className={styles.propertyThumb}></div>
                            <div className={styles.propertyDetails}>
                              <span className={styles.propertyName}>3 BHK Villa</span>
                              <span className={styles.propertyRent}>₹45,000</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.phoneHomeIndicator}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <h2>Why Choose SettleKar?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗺️</div>
              <h3>Location-Based Search</h3>
              <p>Find properties with precise map integration. Search by city, area, or use your current location to discover nearby rentals.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📸</div>
              <h3>Rich Property Listings</h3>
              <p>Upload indoor and outdoor photos, detailed descriptions, and complete property information with our intuitive listing system.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Real-Time Updates</h3>
              <p>Get instant notifications about new properties, price changes, and availability updates in your preferred areas.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>Verified Owners</h3>
              <p>All property owners are verified with profile photos and contact details. Connect directly with authentic property owners.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💝</div>
              <h3>Save & Wishlist</h3>
              <p>Save your favorite properties to wishlist and compare them later. Never lose track of properties you love.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💳</div>
              <h3>Flexible Payment Plans</h3>
              <p>Choose from multiple listing plans for property owners. Basic, premium, and featured listing options available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.container}>
          <h2>How SettleKar Works</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>For Tenants</h3>
                <h4>Search & Discover</h4>
                <p>Browse properties by city, use map search, or explore curated listings. Filter by price, property type, and amenities.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>For Owners</h3>
                <h4>List Your Property</h4>
                <p>Upload photos, add detailed descriptions, set location on map, and choose a payment plan to list your property.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>For Everyone</h3>
                <h4>Connect & Settle</h4>
                <p>Direct communication between owners and tenants. View contact details, schedule visits, and finalize your rental agreement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className={styles.download}>
        <div className={styles.container}>
          <h2>Download SettleKar Today</h2>
          <p>Join thousands of users who have found their perfect rental homes. Available on Android and iOS.</p>
          <div className={styles.downloadButtons}>
            <a href="#" className={`${styles.downloadBtn} android`}>
              <div className={styles.btnContent}>
                <div className={styles.btnIcon}>📱</div>
                <div className={styles.btnText}>
                  <span>Get it on</span>
                  <strong>Google Play</strong>
                </div>
              </div>
            </a>
            <a href="#" className={`${styles.downloadBtn} ios`}>
              <div className={styles.btnContent}>
                <div className={styles.btnIcon}>🍎</div>
                <div className={styles.btnText}>
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </div>
            </a>
          </div>
          <div className={styles.appFeatures}>
            <div className={styles.appFeature}>
              <span className={styles.featureCheck}>✓</span>
              <span>Google Sign-In Integration</span>
            </div>
            <div className={styles.appFeature}>
              <span className={styles.featureCheck}>✓</span>
              <span>Offline Property Viewing</span>
            </div>
            <div className={styles.appFeature}>
              <span className={styles.featureCheck}>✓</span>
              <span>Push Notifications</span>
            </div>
          </div>
          <p className={styles.comingSoon}>Coming Soon to App Stores!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>SettleKar</h3>
              <p>Your trusted partner in finding the perfect rental property. Connecting verified owners with genuine tenants.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#download">Download</a></li>
                <li>
                  <Link to="/privacy-policy" className={styles.footerLink}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/delete-account" className={styles.footerLink}>
                    Delete Account
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>Email: support@settlekar.com</p>
              <p>Phone: +91 12345 67890</p>
              <p>Address: Bangalore, Karnataka, India</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 SettleKar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;