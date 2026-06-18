import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './LandingPage.module.css';
import logoImage from '/logo.png';

export interface WebPropertyItem {
  id: number;
  title: string;
  city: string;
  location: string;
  price: string;
  rating: string;
  badge: string;
  features: string;
  image: string;
}

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

interface FaqItem {
  question: string;
  answer: string;
}



const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Tenant in Bangalore",
    comment: "Finding a flat in Koramangala was a breeze with SettleKar. I contacted the owner directly, scheduled a visit, and closed the deal in 2 days. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Property Owner in Mumbai",
    comment: "As a landlord, I was tired of paying huge brokerage fees. SettleKar connected me with genuine, verified tenants directly. The listing process took less than 5 minutes!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 3,
    name: "Amit Desai",
    role: "Tenant in Pune",
    comment: "The location-based search is a lifesaver. I wanted a 1 BHK near my office in Viman Nagar and the interactive map took me straight to the best available listings nearby.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const faqs: FaqItem[] = [
  {
    question: "Is SettleKar free to use for tenants?",
    answer: "Yes, SettleKar is 100% free for tenants! You can browse listings, filter by amenities, and connect with verified property owners directly without paying a single rupee of brokerage."
  },
  {
    question: "How do I list my property as a landlord?",
    answer: "Simply download the SettleKar mobile app, sign up as an Owner, click 'Post Listing', fill in your property details, upload photos, and select your preferred listing plan. Your property will go live instantly!"
  },
  {
    question: "Are the property owners and listings verified?",
    answer: "Yes! We require all landlords to verify their profiles. We also run automated check filters on listed properties and encourage user reporting to maintain a high-quality, authentic marketplace."
  },
  {
    question: "What cities does SettleKar cover?",
    answer: "Currently, SettleKar is active across major tech hubs and metropolitan cities in India, including Bangalore, Mumbai, Pune, Delhi NCR, and Hyderabad, with plans to expand rapidly."
  }
];

const LandingPage: React.FC = () => {
  const location = useLocation();
  
  // Google Play Store URL for SettleKar app
  const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.settlekar.settlekar';

  // Modern UX States
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // New States for Portal & Interactive Flow
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);


  
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

    // Track feature cards, steps, phone mockup, hero text, and upgraded sections
    const elements = document.querySelectorAll(
      `.${styles.featureCard}, .${styles.step}, .${styles.heroContent}, .${styles.phoneMockup}, .${styles.listingsSection}, .${styles.pricingSection}, .${styles.testimonialsSection}, .${styles.faqSection}`
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Handle hash navigation when component mounts or hash changes
  useEffect(() => {
    // Check if there's a hash in the URL (like #features or #how-it-works)
    const hash = window.location.hash;
    if (hash && (hash === '#features' || hash === '#how-it-works' || hash === '#download')) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleScrollToSection = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL hash without causing page jump
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

 

  return (
    <div className={styles.landingPage}>
      {/* React 19 Document Metadata */}
      <title>SettleKar - Discover Your Perfect Rental Home</title>
      <meta name="description" content="Discover SettleKar's location-based rental property portal. Connect directly with verified property owners in Bangalore, Mumbai, Pune, Delhi NCR and Hyderabad. No brokerage, 100% free for tenants." />
      <link rel="canonical" href="https://settlekar.in/" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://settlekar.in/" />
      <meta property="og:title" content="SettleKar - Discover Your Perfect Rental Home" />
      <meta property="og:description" content="Find verified rental properties or list your property with ease. Location-based search, real-time updates, direct owner communication. Zero brokerage." />
      <meta property="og:image" content="https://settlekar.in/logo.png" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="SettleKar" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="SettleKar - Discover Your Perfect Rental Home" />
      <meta name="twitter:description" content="Find verified rental properties or list your property with ease. Zero brokerage, direct owner communication." />
      <meta name="twitter:image" content="https://settlekar.in/logo.png" />

      {/* JSON-LD: Organization Schema */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SettleKar",
        "url": "https://settlekar.in",
        "logo": "https://settlekar.in/logo.png",
        "description": "SettleKar is a location-based rental property platform connecting verified property owners with tenants across India.",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "jashanphw@gmail.com",
          "telephone": "+91-6367073699",
          "contactType": "customer support",
          "areaServed": "IN",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://play.google.com/store/apps/details?id=com.settlekar.settlekar"
        ]
      })}</script>

      {/* JSON-LD: WebSite Schema */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "SettleKar",
        "url": "https://settlekar.in",
        "description": "Find verified rental properties or list your property with SettleKar — India's smart rental discovery platform.",
        "publisher": {
          "@type": "Organization",
          "name": "SettleKar"
        }
      })}</script>

      {/* JSON-LD: MobileApplication Schema */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        "name": "SettleKar",
        "operatingSystem": "ANDROID",
        "applicationCategory": "LifestyleApplication",
        "url": "https://play.google.com/store/apps/details?id=com.settlekar.settlekar",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "description": "SettleKar Android app — discover rental properties near you, connect with verified owners, and settle into your new home hassle-free.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "ratingCount": "500",
          "bestRating": "5",
          "worstRating": "1"
        }
      })}</script>

      {/* Header */}
      <header role="banner" className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isMobileMenuOpen ? styles.headerMobileOpen : ''}`}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
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
              href="#features" 
              onClick={(e) => { setIsMobileMenuOpen(false); handleScrollToSection('features', e); }}
              className={styles.navLink}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { setIsMobileMenuOpen(false); handleScrollToSection('how-it-works', e); }}
              className={styles.navLink}
            >
              How It Works
            </a>
            <a 
              href="#download" 
              onClick={(e) => { setIsMobileMenuOpen(false); handleScrollToSection('download', e); }}
              className={styles.navLink}
            >
              Download
            </a>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.navLink} ${styles.navLinkSpecial}`}>
              ➕ List Property
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
              <a 
                href={googlePlayUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Download App
              </a>
              <Link 
                to="/dashboard"
                className={`${styles.btn} ${styles.btnListProperty}`}
              >
                ➕ List Property
              </Link>
              <a 
                href="#features" 
                onClick={(e) => handleScrollToSection('features', e)} 
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Explore Features
              </a>
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
                  <img src="/app-screenshot.jpg" alt="SettleKar Mobile App Home Page" className={styles.appScreenshot} fetchPriority="high" />
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

      
      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.testimonialsHeader}>
            <h2>Loved by Landlords & Tenants</h2>
            <p>Read experiences from authentic people who connected and settled hassle-free using SettleKar.</p>
          </div>
          
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className={styles.starIcon}>★</span>
                  ))}
                </div>
                <p className={styles.comment}>"{t.comment}"</p>
                <div className={styles.userProfile}>
                  <img src={t.avatar} alt={t.name} className={styles.avatar} loading="lazy" />
                  <div className={styles.userInfo}>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Have questions about SettleKar? Find instant answers below or reach out to our team.</p>
          </div>

          <div className={styles.accordionContainer}>
            {faqs.map((faq, index) => (
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

      {/* Download Section */}
      <section id="download" className={styles.download}>
        <div className={styles.container}>
          <h2>Download SettleKar Today</h2>
          <p>Join thousands of users who have found their perfect rental homes. Available on Android and iOS.</p>
          <div className={styles.downloadButtons}>
            <a 
              href={googlePlayUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.downloadBtn} android`}
            >
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
                <li>
                  <a 
                    href="#features" 
                    onClick={(e) => handleScrollToSection('features', e)}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a 
                    href="#how-it-works" 
                    onClick={(e) => handleScrollToSection('how-it-works', e)}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a 
                    href="#download" 
                    onClick={(e) => handleScrollToSection('download', e)}
                  >
                    Download
                  </a>
                </li>
                <li>
                  <Link to="/privacy-policy" className={styles.footerLink}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className={styles.footerLink}>
                    Terms of Service
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
              <p>Email: jashanphw@gmail.com</p>
              <p>Phone: +91 6367073699</p>
              {/* <p>Address: Bangalore, Karnataka, India</p> */}
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

export default LandingPage;