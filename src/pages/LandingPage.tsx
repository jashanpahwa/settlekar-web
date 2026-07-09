import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.settlekar.settlekar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Handle hash navigation when component mounts or hash changes
  useEffect(() => {
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
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <div className="font-sans leading-relaxed text-slate-900 w-full max-w-full overflow-x-hidden relative">
      {/* React 19 Document Metadata */}
      <title>SettleKar - Discover Your Perfect Rental Home</title>
      <meta name="description" content="Discover SettleKar's location-based rental property portal. Connect directly with verified property owners in Bangalore, Mumbai, Pune, Delhi NCR and Hyderabad. No commission, 100% free for tenants." />
      <link rel="canonical" href="https://settlekar.in/" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://settlekar.in/" />
      <meta property="og:title" content="SettleKar - Discover Your Perfect Rental Home" />
      <meta property="og:description" content="Find verified rental properties or list your property with ease. Location-based search, real-time updates, direct owner communication. True Transparency." />
      <meta property="og:image" content="https://settlekar.in/logo.png" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="SettleKar" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="SettleKar - Discover Your Perfect Rental Home" />
      <meta name="twitter:description" content="Find verified rental properties or list your property with ease. True Transparency, direct owner communication." />
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
      <section className="relative w-full h-[100dvh] min-h-[640px] overflow-hidden flex flex-col bg-hero-pattern">

        {/* ---- NAVBAR ---- */}
        <header role="banner" className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-5 sm:py-6 sm:px-10 lg:py-7 lg:px-16">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <img src={logoImage} alt="SettleKar" className="h-9 sm:h-10 w-auto object-contain brightness-0 invert" />
          </div>

          {/* Center: Nav Links (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
            <a href="#features" onClick={(e) => handleScrollToSection('features', e)} className="text-white/80 no-underline text-[13px] font-medium tracking-[0.12em] uppercase hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" onClick={(e) => handleScrollToSection('how-it-works', e)} className="text-white/80 no-underline text-[13px] font-medium tracking-[0.12em] uppercase hover:text-white transition-colors duration-200">How It Works</a>
            <a href="#download" onClick={(e) => handleScrollToSection('download', e)} className="text-white/80 no-underline text-[13px] font-medium tracking-[0.12em] uppercase hover:text-white transition-colors duration-200">Download</a>
            <Link to="/search" className="text-white/80 no-underline text-[13px] font-medium tracking-[0.12em] uppercase hover:text-white transition-colors duration-200">Search Properties</Link>
          </nav>

          {/* Right: CTA Button (hidden on mobile) */}
          <div className="hidden md:flex items-center">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-1.5 text-white no-underline text-[11px] font-semibold tracking-[0.14em] uppercase border border-white/35 py-2.5 px-5 rounded hover:bg-white/10 hover:border-white/65 transition-colors duration-200"
              id="hero-list-property-btn"
            >
              LIST PROPERTY
              <ArrowUpRight className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={14} />
            </Link>
          </div>

          {/* Hamburger (visible on mobile) */}
          <button
            className="flex md:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1 z-12"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            id="mobile-menu-btn"
          >
            <span className={`block h-[2px] bg-white rounded-[2px] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'}`} />
            <span className={`block h-[2px] bg-white rounded-[2px] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 w-6' : 'w-6'}`} />
            <span className={`block h-[2px] bg-white rounded-[2px] transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-4'}`} />
          </button>
        </header>

        {/* ---- MOBILE MENU OVERLAY ---- */}
        <div
          className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-6 transition-all duration-500 ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          aria-hidden={!isMobileMenuOpen}
          role="dialog"
          aria-label="Mobile navigation"
        >
          {/* Header row inside overlay */}
          <div className="flex items-center justify-between mb-12">
            <img src={logoImage} alt="SettleKar" className="h-9 w-auto object-contain brightness-0 invert" />
            <button
              className="bg-transparent border-none cursor-pointer p-2 flex items-center justify-center rounded hover:bg-white/8 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X size={24} color="white" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 flex-1 justify-center">
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
                  className="block text-white no-underline text-[2rem] sm:text-[3.5rem] font-bold tracking-tight uppercase leading-snug py-2 hover:text-blue-200/90 transition-all duration-300"
                  style={style}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={hrefMap[label]}
                  className="block text-white no-underline text-[2rem] sm:text-[3.5rem] font-bold tracking-tight uppercase leading-snug py-2 hover:text-blue-200/90 transition-all duration-300"
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
            className="inline-flex items-center gap-2.5 text-white no-underline text-[0.8rem] font-semibold tracking-[0.14em] uppercase border border-white/35 py-3.5 px-6 rounded mt-8 w-fit hover:bg-white/8 transition-all duration-300"
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
        <div className="absolute z-5 inset-0 grid grid-cols-1 grid-rows-1 items-center pt-20 px-6 pb-6 md:grid-cols-2 md:pt-[90px] md:px-10 md:pb-8 md:gap-10 lg:grid-cols-[55fr_45fr] lg:pt-[100px] lg:px-16 lg:pb-10 lg:gap-[60px]">

          {/* LEFT: Text Content */}
          <div className="flex flex-col items-start justify-center">

            <div className="flex items-center gap-2 text-white/70 text-[11px] sm:text-xs tracking-[0.22em] uppercase font-medium mb-3 sm:mb-4 animate-fade-up">
              <MapPin className="text-white/60 shrink-0" size={16} />
              <span>India's 1st Rental-Only Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="flex flex-col mb-4 sm:mb-5 p-0 font-extrabold text-white leading-[0.93] tracking-tight uppercase animate-fade-up [animation-delay:0.2s]">
              <span className="block text-[clamp(2.4rem,6.5vw,5.5rem)]">Find.</span>
              <span className="block text-[clamp(2.4rem,6.5vw,5.5rem)]">Connect.</span>
              <span className="block text-[clamp(2.4rem,6.5vw,5.5rem)]">Settle.</span>
            </h1>

            {/* Subtext */}
            <p className="text-white/72 text-sm sm:text-[0.9375rem] leading-relaxed max-w-[480px] mb-4.5 sm:mb-6 animate-fade-up [animation-delay:0.4s]">
              We connect verified property owners with tenants<br />
              through smart location-based search —{' '}
              <strong className="text-white font-semibold">true transparency, zero hassle.</strong>
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8 lg:mb-9 animate-fade-up [animation-delay:0.6s]">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 no-underline text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase py-3.25 px-5.5 sm:py-3.75 sm:px-6.5 rounded transition-all duration-200 bg-white text-[#0a1628] hover:bg-white/92 hover:-translate-y-0.5 hover:shadow-lg"
                id="hero-search-btn"
              >
                <Search size={16} />
                SEARCH PROPERTIES
              </Link>
              <a
                href={googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 no-underline text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase py-3.25 px-5.5 sm:py-3.75 sm:px-6.5 rounded transition-all duration-200 bg-transparent text-white border border-white/45 hover:border-white/80 hover:bg-white/8 hover:-translate-y-0.5"
                id="hero-download-btn"
              >
                <Download size={16} />
                DOWNLOAD APP
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-5 sm:gap-9 lg:gap-13 animate-fade-up [animation-delay:0.8s]">
              <div className="flex flex-col">
                <span className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-white tracking-tight leading-none">10K+</span>
                <span className="text-white/50 text-[9.6px] sm:text-[11px] tracking-widest uppercase font-medium mt-1.5">Properties Listed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-white tracking-tight leading-none">5K+</span>
                <span className="text-white/50 text-[9.6px] sm:text-[11px] tracking-widest uppercase font-medium mt-1.5">Happy Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-white tracking-tight leading-none">50+</span>
                <span className="text-white/50 text-[9.6px] sm:text-[11px] tracking-widest uppercase font-medium mt-1.5">Cities Covered</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Phone Mockup */}
          <div className="hidden md:flex items-center justify-center relative animate-fade-up [animation-delay:0.4s]">
            <div className="absolute w-[320px] h-[480px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.4)_0%,transparent_70%)] rounded-full blur-[48px] z-0 pointer-events-none" />
            <div className="relative z-1 animate-phone-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] drop-shadow-[0_0_40px_rgba(37,99,235,0.25)]">
              <div className="w-[240px] h-[480px] lg:w-[280px] lg:h-[560px] xl:w-[300px] xl:h-[600px] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-[36px] p-2 shadow-[0_0_0_1.5px_rgba(255,255,255,0.08),0_0_0_3px_rgba(37,99,235,0.15),0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_3px_rgba(255,255,255,0.12)] relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-6 bg-black rounded-b-2xl z-10"></div>
                <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[50px] h-[5px] bg-[#222] rounded-[3px] z-11"></div>
                <div className="absolute top-4 right-8 w-2.5 h-2.5 bg-[radial-gradient(circle,#1a1a2e_30%,#333_70%)] rounded-full z-11 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"></div>
                <div className="w-full h-full bg-[#f8fafc] rounded-[28px] overflow-hidden relative">
                  <img
                    src="/app-screenshot.webp"
                    alt="SettleKar Mobile App"
                    className="w-full h-full object-cover block"
                    fetchPriority="high"
                    width={473}
                    height={1024}
                  />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-1 bg-white/25 rounded-[2px]"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-7 right-8 md:bottom-9 md:right-14 z-5 flex flex-col items-center gap-1.5 animate-fade-in [animation-delay:1.2s]">
          <div className="w-[22px] h-9 border border-white/35 rounded-xl flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-sm animate-scroll-bounce" />
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