import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import styles from '../styles/LocationPage.module.css';
import { locationPages, MockProperty, getNeighborhoodIntel } from '../utils/locationPages';
import { NeighborhoodIntelSection } from '../components/Landing/NeighborhoodIntelSection';
import logoImage from '/logo.png';
import NotFound from './NotFound';
import { propertyService } from '../services/propertyService';

// Helper to safely normalize dynamic Firestore properties to the MockProperty layout
const normalizeProperty = (prop: any): MockProperty => {
  let featuresArray: string[] = [];
  if (Array.isArray(prop.features)) {
    featuresArray = prop.features;
  } else if (typeof prop.features === 'string') {
    featuresArray = prop.features.split(',').map((f: string) => f.trim()).filter(Boolean);
  }
  
  return {
    id: String(prop.id),
    title: prop.title || 'Rental Property',
    location: prop.location || prop.address || 'Jaipur',
    price: prop.price || 'Contact for Price',
    type: prop.propertyType || '',
    features: featuresArray,
    image: prop.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&h=400&q=80',
    rating: prop.rating || '4.5',
    badge: prop.badge || 'Verified Owner',
    description: prop.description || '• 5th floor • Bachelor friendly • 1+1 Brokerage • Fully Independent',
    overallscore: prop.overallscore !== undefined ? prop.overallscore : (prop.overallscore !== undefined ? prop.overallscore : undefined),
    pillars: prop.pillars ,
    confidence: prop.confidence ,
    meta: prop.meta || undefined,
  };
};

const LocationPage: React.FC = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const location = useLocation();

  // Find page configuration data matching the slug
  const pageData = locationPages.find((page) => page.slug === locationSlug);

  // States
  const [properties, setProperties] = useState<MockProperty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // App Link
  const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.settlekar.settlekar';

  // Dynamic Scroll Listener for glassmorphic navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll-reveal animations
  useEffect(() => {
    if (!pageData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll(
      `.${styles.highlightCard}, .${styles.propertyCard}, .${styles.heroContent}, .${styles.faqSection}, .${styles.download}, .${styles.nearbySection}`
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [pageData, isLoading]); // Re-observe once listings stop loading

  // Handle hash navigation on mount or location change
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location, pageData]);

  // Firestore Live Property Fetching with Semantic local filter
  useEffect(() => {
    if (!pageData) return;

    // Instantly seed with static mockups so there's zero rendering delay for SEO crawlers
    setProperties(pageData.properties);
    setIsLoading(true);

    const fetchLiveProperties = async () => {
      try {
        // Query firebase matching city using propertyService
        const liveProps = await propertyService.getPropertiesByCity(pageData.city);

        // Filter listings client-side to fit specific programmatic SEO target intents
        const filteredProps = liveProps.filter((prop) => {
          const title = (prop.title || '').toLowerCase();
          const locationVal = (prop.location || prop.address || '').toLowerCase();
          const description = (prop.description || '').toLowerCase();
          const propertyType = (prop.propertyType || '').toLowerCase();
          
          const slug = pageData.slug;

          // 1. Locality Filter Check
          let matchesLocality = true;
          if (slug.includes('vaishali-nagar')) {
            matchesLocality = locationVal.includes('vaishali');
          } else if (slug.includes('malviya-nagar')) {
            matchesLocality = locationVal.includes('malviya');
          } else if (slug.includes('jagatpura')) {
            matchesLocality = locationVal.includes('jagatpura');
          } else if (slug.includes('bani-park')) {
            matchesLocality = locationVal.includes('bani park') || locationVal.includes('banipark');
          } else if (slug.includes('c-scheme')) {
            matchesLocality = locationVal.includes('c-scheme') || locationVal.includes('c scheme') || locationVal.includes('cscheme');
          } else if (slug.includes('mansarovar')) {
            matchesLocality = locationVal.includes('mansarovar');
          } else if (slug.includes('jhotwara')) {
            matchesLocality = locationVal.includes('jhotwara');
          } else if (slug.includes('sanganer')) {
            matchesLocality = locationVal.includes('sanganer');
          } else if (slug.includes('amer')) {
            matchesLocality = locationVal.includes('amer');
          } else if (slug.includes('pink-city')) {
            matchesLocality = locationVal.includes('pink city') || locationVal.includes('pinkcity') || locationVal.includes('c-scheme');
          } else if (slug.includes('sitapura')) {
            matchesLocality = locationVal.includes('sitapura');
          } else if (slug.includes('airport')) {
            matchesLocality = locationVal.includes('airport') || locationVal.includes('sanganer') || locationVal.includes('siddharth') || locationVal.includes('jawahar circle');
          }

          if (!matchesLocality) return false;

          // 2. Configuration & Category Filter Check
          if (slug.includes('1-bhk')) {
            return propertyType === '1 bhk' || propertyType === '1 rk' || propertyType === 'studio' || title.includes('1 bhk') || title.includes('1bhk');
          }
          if (slug.includes('2-bhk')) {
            return propertyType === '2 bhk' || title.includes('2 bhk') || title.includes('2bhk');
          }
          if (slug.includes('3-bhk')) {
            return propertyType === '3 bhk' || title.includes('3 bhk') || title.includes('3bhk');
          }
          if (slug.includes('pg-for-girls')) {
            const isGirls = title.includes('girl') || title.includes('female') || title.includes('women') || description.includes('girl') || description.includes('female') || description.includes('women');
            return propertyType === 'pg' && isGirls;
          }
          if (slug.includes('pg-for-boys')) {
            const isBoys = title.includes('boy') || title.includes('male') || title.includes('men') || description.includes('boy') || description.includes('male') || description.includes('men');
            return propertyType === 'pg' && isBoys;
          }
          if (slug.includes('pg-near') || slug.includes('pg-for')) {
            return propertyType === 'pg' || title.includes('pg') || title.includes('paying guest') || title.includes('hostel');
          }
          if (slug.includes('independent-house')) {
            return propertyType === 'villa' || title.includes('house') || title.includes('independent house') || description.includes('house');
          }
          if (slug.includes('semi-furnished')) {
            return (title.includes('semi') || description.includes('semi') || title.includes('semi-furnished') || description.includes('semi-furnished')) && (propertyType !== 'shop' && propertyType !== 'pg');
          }
          if (slug.includes('fully-furnished')) {
            return (title.includes('fully') || description.includes('fully') || title.includes('furnished') || description.includes('furnished')) && (propertyType !== 'shop' && propertyType !== 'pg');
          }
          if (slug.includes('builder-floor')) {
            return title.includes('builder') || description.includes('builder') || title.includes('floor') || description.includes('floor');
          }
          if (slug.includes('studio-apartment')) {
            return propertyType === 'studio' || title.includes('studio');
          }
          if (slug.includes('student')) {
            return propertyType === 'pg' || propertyType === 'studio' || propertyType === '1 bhk' || propertyType === '1 rk' || title.includes('student') || description.includes('student');
          }
          if (slug.includes('family')) {
            return propertyType === '2 bhk' || propertyType === '3 bhk' || propertyType === '4 bhk' || propertyType === 'villa';
          }
          if (slug.includes('budget')) {
            const priceVal = parseFloat(prop.price?.replace(/[^0-9.]/g, '') || '0');
            return (propertyType !== 'shop' && propertyType !== 'pg') && (priceVal > 0 && priceVal < 12000);
          }
          if (slug.includes('luxury')) {
            const priceVal = parseFloat(prop.price?.replace(/[^0-9.]/g, '') || '0');
            return (propertyType !== 'shop' && propertyType !== 'pg') && (priceVal >= 20000 || title.includes('luxury') || description.includes('luxury') || title.includes('premium'));
          }

          // Default fallback: flats/apartments (excludes shops and PGs)
          const isFlatOrApartment = propertyType !== 'shop' && propertyType !== 'pg';
          return isFlatOrApartment;
        });

        if (filteredProps.length > 0) {
          const normalized = filteredProps.map(normalizeProperty);
          setProperties(normalized);
        } else {
          // If no live listings yet, stay on mock list as a fallback
          setProperties(pageData.properties);
        }
      } catch (err) {
        console.error('Failed to load live listings. Falling back to pre-rendered metadata:', err);
        setProperties(pageData.properties);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveProperties();
  }, [locationSlug, pageData]);

  const handleScrollToSection = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  // If no match found, render NotFound
  if (!pageData) {
    return <NotFound />;
  }

  // Schema configurations
  const canonicalUrl = `https://settlekar.in/${pageData.slug}`;
  
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": pageData.breadcrumbs.map((bc, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": bc.name,
      "item": bc.path === '/' ? "https://settlekar.in" : `https://settlekar.in${bc.path}`
    }))
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageData.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <div key={idx} className={styles.skeletonCard}>
        <div className={`${styles.skeletonImage} ${styles.shimmer}`} />
        <div className={styles.skeletonContent}>
          <div className={`${styles.skeletonLine} ${styles.title} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.small} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.button} ${styles.shimmer}`} />
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.locationPage}>
      {/* React 19 Document Metadata */}
      <title>{pageData.metaTitle}</title>
      <meta name="description" content={pageData.metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageData.metaTitle} />
      <meta property="og:description" content={pageData.metaDescription} />
      <meta property="og:image" content="https://settlekar.in/logo.png" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="SettleKar" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageData.metaTitle} />
      <meta name="twitter:description" content={pageData.metaDescription} />
      <meta name="twitter:image" content="https://settlekar.in/logo.png" />

      {/* JSON-LD Schemas */}
      <script type="application/ld+json">{JSON.stringify(breadcrumbListSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqPageSchema)}</script>

      {/* Header */}
      <header role="banner" className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isMobileMenuOpen ? styles.headerMobileOpen : ''}`}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <button 
            className={styles.hamburgerBtn} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`${styles.hamburgerBar} ${isMobileMenuOpen ? styles.barOpen1 : ''}`}></span>
            <span className={`${styles.hamburgerBar} ${isMobileMenuOpen ? styles.barOpen2 : ''}`}></span>
            <span className={`${styles.hamburgerBar} ${isMobileMenuOpen ? styles.barOpen3 : ''}`}></span>
          </button>

          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
            <a 
              href="#highlights" 
              onClick={(e) => { setIsMobileMenuOpen(false); handleScrollToSection('highlights', e); }}
              className={styles.navLink}
            >
              Highlights
            </a>
            <a 
              href="#listings" 
              onClick={(e) => { setIsMobileMenuOpen(false); handleScrollToSection('listings', e); }}
              className={styles.navLink}
            >
              Listings
            </a>
            <a 
              href="#faq" 
              onClick={(e) => { setIsMobileMenuOpen(false); handleScrollToSection('faq', e); }}
              className={styles.navLink}
            >
              FAQs
            </a>
            <a 
              href="#download" 
              onClick={(e) => { setIsMobileMenuOpen(false); handleScrollToSection('download', e); }}
              className={styles.navLink}
            >
              Download App
            </a>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.navLink} ${styles.navLinkSpecial}`}>
              ➕ List Property
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Visual Breadcrumb Navigation */}
            <ul className={styles.breadcrumbs}>
              {pageData.breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
                  <li>
                    {idx === pageData.breadcrumbs.length - 1 ? (
                      <span className={styles.breadcrumbActive}>{bc.name}</span>
                    ) : (
                      <Link to={bc.path} className={styles.breadcrumbLink}>{bc.name}</Link>
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ul>

            <h1>{pageData.h1}</h1>
            <p>{pageData.subTitle}</p>
            <div className={styles.ctaButtons}>
              <a 
                href={googlePlayUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Find Rooms on App
              </a>
              <a 
                href="#listings" 
                onClick={(e) => handleScrollToSection('listings', e)}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Browse Listings
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className={styles.highlightsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Rent in {pageData.locality}?</h2>
            <p>Here are key benefits of renting a property in {pageData.locality}, {pageData.city} with SettleKar.</p>
          </div>
          <div className={styles.highlightsGrid}>
            {pageData.highlights.map((highlight, index) => (
              <div key={index} className={styles.highlightCard}>
                <div className={styles.highlightIcon}>{highlight.icon}</div>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood Intelligence Section */}
      {pageData && (
        <NeighborhoodIntelSection
          locality={pageData.locality}
          city={pageData.city}
          intel={getNeighborhoodIntel(pageData.slug, pageData.locality)}
        />
      )}

      {/* Property Listings Section */}
      <section id="listings" className={styles.listingsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Featured Properties in {pageData.locality}</h2>
            <p>Explore recently listed, verified properties direct from owners. Download the app to contact owners directly.</p>
          </div>
          <div className={styles.listingsGrid}>
            {isLoading ? (
              renderSkeletons()
            ) : (
              properties.map((property) => (
  <div key={property.id} className={styles.propertyCard}>
    <div className={styles.imageWrapper}>
      <img src={property.image} alt={property.title} className={styles.propertyImage} width={600} height={400} />
      {property.badge && <span className={styles.badge}>{property.type}</span>}
    </div>
    <div className={styles.cardContent}>
      <h3>{property.title}</h3>
      
      {/* Price per month */}
      <div className={styles.pricePerMonth}>
        <span className={styles.priceLabel}>₹</span>
        <span className={styles.priceAmount}>{property.price}</span>
        <span className={styles.priceUnit}>/month</span>
      </div>
      
      {/* Description with bullet points */}
      <div className={styles.descriptionWrapper}>
        <p className={styles.propertyDescription}>
          {property.description }
        </p>
      </div>

      {/* Neighborhood Score Badge */}
      {property.overallscore !== undefined && property.overallscore !== null && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '14px',
          background: property.overallscore >= 80 
            ? 'rgba(16, 185, 129, 0.1)' 
            : property.overallscore >= 60 
              ? 'rgba(245, 158, 11, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
          color: property.overallscore >= 80 
            ? '#34d399' 
            : property.overallscore >= 60 
              ? '#fb923c' 
              : '#f87171',
          border: property.overallscore >= 80 
            ? '1px solid rgba(16, 185, 129, 0.2)' 
            : property.overallscore >= 60 
              ? '1px solid rgba(245, 158, 11, 0.2)' 
              : '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          🛡️ Livability Score: <strong>{property.overallscore}/100</strong>
        </div>
      )}
      
      {/* Features tags (keeping for additional info) */}
      <div className={styles.featuresList}>
        {property.features?.map((feature, idx) => (
          <span key={idx} className={styles.featureTag}>{feature}</span>
        ))}
      </div>
      
      {/* Send Inquiry Button */}
      <a 
        href={googlePlayUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.cardCta}
      >
        Send Inquiry
      </a>
    </div>
  </div>
)))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about renting a {pageData.keyword} in {pageData.locality}.</p>
          </div>

          <div className={styles.accordionContainer}>
            {pageData.faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`${styles.accordionItem} ${activeFaqIndex === index ? styles.activeFaq : ''}`}
              >
                <button
                  className={styles.accordionTitle}
                  onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                  aria-expanded={activeFaqIndex === index}
                >
                  <span>{faq.question}</span>
                  <span className={styles.faqArrow}>▼</span>
                </button>
                <div className={styles.accordionContent}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby/Other Locations Section */}
      <section className={styles.nearbySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Other Popular Rentals in Jaipur</h2>
            <p>Crawl internal links to similar hot localities and properties in the area.</p>
          </div>
          <div className={styles.nearbyGrid}>
            {pageData.nearbyLinks.map((link, idx) => (
              <Link key={idx} to={`/${link.slug}`} className={styles.nearbyCard}>
                <span>{link.text}</span>
                <span className={styles.nearbyArrow}>➔</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className={styles.download}>
        <div className={styles.container}>
          <h2>Get the SettleKar App</h2>
          <p>Find, schedule visits, and finalize deals for your dream room or flat on the go.</p>
          <div className={styles.downloadButtons}>
            <a 
              href={googlePlayUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.downloadBtn}
            >
              <div className={styles.btnContent}>
                <div className={styles.btnIcon}>📱</div>
                <div className={styles.btnText}>
                  <span>Get it on</span>
                  <strong>Google Play</strong>
                </div>
              </div>
            </a>
            <a href="#" className={styles.downloadBtn} onClick={(e) => e.preventDefault()}>
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
              <span>100% Broker-Free Platform</span>
            </div>
            <div className={styles.appFeature}>
              <span className={styles.featureCheck}>✓</span>
              <span>Verified Direct Owners Only</span>
            </div>
            <div className={styles.appFeature}>
              <span className={styles.featureCheck}>✓</span>
              <span>Map-Based Accurate Locations</span>
            </div>
          </div>
          <p className={styles.comingSoon}>App Store version coming soon. Android app live!</p>
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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className={styles.footerLink}>Terms of Service</Link></li>
                <li><Link to="/delete-account" className={styles.footerLink}>Delete Account</Link></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact Support</h4>
              <p>Email: jashanphw@gmail.com</p>
              <p>Phone: +91 6367073699</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 SettleKar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LocationPage;
