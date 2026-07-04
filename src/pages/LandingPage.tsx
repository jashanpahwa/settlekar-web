import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';
import logoImage from '/logo.png';
import { ArrowUpRight, MapPin, X, Download, Search } from 'lucide-react';
import Footer from '../components/Landing/Footer';
import FeaturesSection from '../components/Landing/FeaturesSection';
import FaqSection from '../components/Landing/FaqSection';
import TestimonialsSection from '../components/Landing/TestimonialsSection';
import HowItWorks from '../components/Landing/HowItWorks';
import DownloadSection from '../components/Landing/DownloadSection';

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

const LandingPage: React.FC = () => {
  const location = useLocation();
  
  // Google Play Store URL for SettleKar app
  const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.settlekar.settlekar';

  // New States for Portal & Interactive Flow
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);


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

    // Track feature cards, steps, and upgraded sections
    const elements = document.querySelectorAll(
      `.${styles.featureCard}, .${styles.step}, .${styles.listingsSection}, .${styles.pricingSection}, .${styles.testimonialsSection}, .${styles.faqSection}`
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

      {/* ===================== HERO SECTION ===================== */}
      <section className={styles.videoHero}>

        {/* ---- NAVBAR ---- */}
        <header role="banner" className={styles.videoNavbar}>
          {/* Left: Logo */}
          <div className={styles.videoNavLogo}>
            <img src={logoImage} alt="SettleKar" className={styles.videoLogoImg} />
          </div>

          {/* Center: Nav Links (hidden on mobile) */}
          <nav className={styles.videoNavLinks} aria-label="Main navigation">
            <Link to="/search" className={styles.videoNavLink}>Search Properties</Link>
            <a href="#features" onClick={(e) => handleScrollToSection('features', e)} className={styles.videoNavLink}>Features</a>
            <a href="#how-it-works" onClick={(e) => handleScrollToSection('how-it-works', e)} className={styles.videoNavLink}>How It Works</a>
            <a href="#download" onClick={(e) => handleScrollToSection('download', e)} className={styles.videoNavLink}>Download</a>
            <Link to="/dashboard" className={styles.videoNavLink}>List Property</Link>
          </nav>

          {/* Right: CTA Button (hidden on mobile) */}
          <div className={styles.videoNavRight}>
            <Link
              to="/dashboard"
              className={styles.videoNavCta}
              id="hero-list-property-btn"
            >
              LIST PROPERTY
              <ArrowUpRight className={styles.videoNavCtaIcon} size={14} />
            </Link>
          </div>

          {/* Hamburger (visible on mobile) */}
          <button
            className={styles.videoHamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            id="mobile-menu-btn"
          >
            <span className={`${styles.vBar} ${styles.vBar1}`} />
            <span className={`${styles.vBar} ${styles.vBar2}`} />
            <span className={`${styles.vBar} ${styles.vBar3}`} />
          </button>
        </header>

        {/* ---- MOBILE MENU OVERLAY ---- */}
        <div
          className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
          aria-hidden={!isMobileMenuOpen}
          role="dialog"
          aria-label="Mobile navigation"
        >
          {/* Header row inside overlay */}
          <div className={styles.mobileMenuHeader}>
            <img src={logoImage} alt="SettleKar" className={styles.mobileMenuLogo} />
            <button
              className={styles.mobileMenuClose}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X size={24} color="white" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className={styles.mobileMenuNav}>
            {['Search Properties', 'Properties', 'How It Works', 'Download', 'List Property'].map((label, i) => {
              const hrefMap: Record<string, string> = {
                'Search Properties': '/search',
                'Properties': '#features',
                'How It Works': '#how-it-works',
                'Download': '#download',
                'List Property': '/dashboard',
              };
              const isInternal = label === 'List Property' || label === 'Search Properties';
              const style = {
                transitionDelay: `${i * 80 + 100}ms`,
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              };
              return isInternal ? (
                <Link
                  key={label}
                  to={hrefMap[label]}
                  className={styles.mobileMenuLink}
                  style={style}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={hrefMap[label]}
                  className={styles.mobileMenuLink}
                  style={style}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (label !== 'Properties' || !hrefMap[label].startsWith('/')) {
                      const sectionId = hrefMap[label].replace('#', '');
                      handleScrollToSection(sectionId, e as React.MouseEvent<HTMLAnchorElement>);
                    }
                  }}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* CTA in mobile menu */}
          <a
            href={googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileMenuCta}
            style={{
              transitionDelay: `${5 * 80 + 100}ms`,
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <Download size={16} />
            DOWNLOAD APP
          </a>
        </div>

        {/* ---- HERO SPLIT LAYOUT ---- */}
        <div className={styles.videoHeroContent}>

          {/* LEFT: Text Content */}
          <div className={styles.heroTextCol}>

            <div className={`${styles.heroTagline} ${styles.animFadeUp}`}>
              <MapPin className={styles.heroTaglineIcon} size={16} />
              <span>India's 1st Rental-Only Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className={`${styles.heroHeading} ${styles.animFadeUpD1}`}>
              <span className={styles.heroHeadingLine}>Find.</span>
              <span className={styles.heroHeadingLine}>Connect.</span>
              <span className={styles.heroHeadingLine}>Settle.</span>
            </h1>

            {/* Subtext */}
            <p className={`${styles.heroSubtext} ${styles.animFadeUpD2}`}>
              We connect verified property owners with tenants<br />
              through smart location-based search —{' '}
              <strong>zero brokerage, zero hassle.</strong>
            </p>

            {/* CTA Row */}
            <div className={`${styles.heroCtas} ${styles.animFadeUpD3}`}>
              <Link
                to="/search"
                className={`${styles.heroCtaBtn} ${styles.heroCtaBtnPrimary}`}
                id="hero-search-btn"
              >
                <Search size={16} />
                SEARCH PROPERTIES
              </Link>
              <a
                href={googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.heroCtaBtn} ${styles.heroCtaBtnSecondary}`}
                id="hero-download-btn"
              >
                <Download size={16} />
                DOWNLOAD APP
              </a>
            </div>

            {/* Stats Row */}
            <div className={`${styles.heroStatsRow} ${styles.animFadeUpD4}`}>
              <div className={styles.heroStatItem}>
                <span className={styles.heroStatValue}>10K+</span>
                <span className={styles.heroStatLabel}>Properties Listed</span>
              </div>
              <div className={styles.heroStatItem}>
                <span className={styles.heroStatValue}>5K+</span>
                <span className={styles.heroStatLabel}>Happy Users</span>
              </div>
              <div className={styles.heroStatItem}>
                <span className={styles.heroStatValue}>50+</span>
                <span className={styles.heroStatLabel}>Cities Covered</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Phone Mockup with twist */}
          <div className={`${styles.heroPhoneCol} ${styles.animFadeUpD2}`}>
            <div className={styles.heroPhoneGlow} />
            <div className={styles.heroPhoneWrap}>
              <div className={styles.heroPhoneFrame}>
                <div className={styles.heroPhoneNotch}></div>
                <div className={styles.heroPhoneSpeaker}></div>
                <div className={styles.heroPhoneCamera}></div>
                <div className={styles.heroPhoneScreen}>
                  <img
                    src="/app-screenshot.webp"
                    alt="SettleKar Mobile App"
                    className={styles.heroPhoneScreenshot}
                    fetchPriority="high"
                    width={473}
                    height={1024}
                  />
                </div>
                <div className={styles.heroPhoneHomeBar}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className={`${styles.scrollHint} ${styles.animFadeIn}`}>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollDot} />
          </div>
        </div>

      </section>



      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      
      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Accordion Section */}
      <FaqSection />

      {/* Download Section */}
      <DownloadSection />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default LandingPage;