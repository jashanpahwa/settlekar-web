import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '/logo.png';
import { ArrowUpRight, MapPin, X, PlusCircle, Search } from 'lucide-react';
import Footer from '../components/Landing/Footer';
import FeaturesSection from '../components/Landing/FeaturesSection';
import FaqSection from '../components/Landing/FaqSection';
import TestimonialsSection from '../components/Landing/TestimonialsSection';
import HowItWorks from '../components/Landing/HowItWorks';
import DownloadSection from '../components/Landing/DownloadSection';
import { TrustSection } from '../components/Landing/TrustSection';
import { NeighborhoodScoreSection } from '../components/Landing/NeighborhoodScoreSection';

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

interface Keyword {
  word: string;
  size: string;
  weight: string;
  opacity: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  depth: number;
  animation: string;
  mobileVisible?: boolean;
}

const desktopKeywords: Keyword[] = [
 
  // Top-left area
  { word: 'One mission: fix rental real estate', size: 'text-[clamp(1rem,2vw,1.6rem)]', weight: 'font-bold', opacity: 'opacity-35', top: '14%', left: '12%', depth: 0.7, animation: 'animate-float-a' },
  { word: 'Rs500 FREE Listings', size: 'text-[clamp(1.2rem,2.5vw,2rem)]', weight: 'font-extrabold', opacity: 'opacity-55', top: '23%', left: '8%', depth: 0.9, animation: 'animate-float-c'},
  { word: '3-step verification', size: 'text-[clamp(1.9rem,1.8vw,1.3rem)]', weight: 'font-semibold', opacity: 'opacity-30', top: '25%', left: '55%', depth: 0.5, animation: 'animate-float-b' },
  { word: 'Transparent pricing', size: 'text-[clamp(0.9rem,1.6vw,1.2rem)]', weight: 'font-bold', opacity: 'opacity-40', top: '32%', left: '40%', depth: 0.6, animation: 'animate-float-a' },
  { word: 'Bangalore', size: 'text-[clamp(1.3rem,2.4vw,2rem)]', weight: 'font-black', opacity: 'opacity-45', top: '32%', left: '28%', depth: 0.9, animation: 'animate-float-b' },

  // Top-right area
  { word: 'Digital rent agreement', size: 'text-[clamp(0.9rem,1.8vw,1.3rem)]', weight: 'font-semibold', opacity: 'opacity-30', top: '12%', right: '12%', depth: 0.5, animation: 'animate-float-c' },
  { word: 'Quality leads only', size: 'text-[clamp(1.1rem,2.2vw,1.8rem)]', weight: 'font-extrabold', opacity: 'opacity-50', top: '24%', right: '8%', depth: 0.8, animation: 'animate-float-a' },
  { word: 'Verified Owners', size: 'text-[clamp(1.2rem,2.4vw,1.9rem)]', weight: 'font-bold', opacity: 'opacity-45', top: '15%', right: '30%', depth: 0.7, animation: 'animate-float-b' },
  { word: 'Delhi', size: 'text-[clamp(1.2rem,2.2vw,1.8rem)]', weight: 'font-extrabold', opacity: 'opacity-45', top: '35%', right: '28%', depth: 0.8, animation: 'animate-float-c' },

  // Mid-left / Middle-left
  { word: 'Broker assistance', size: 'text-[clamp(0.85rem,1.6vw,1.2rem)]', weight: 'font-medium', opacity: 'opacity-55', top: '48%', left: '6%', depth: 0.4, animation: 'animate-float-c' },
  { word: 'No fake listings', size: 'text-[clamp(1rem,2vw,1.5rem)]', weight: 'font-bold', opacity: 'opacity-40', bottom: '30%', left: '7%', depth: 0.6, animation: 'animate-float-b', mobileVisible: true },
  { word: 'Instant rent agreement', size: 'text-[clamp(0.9rem,1.7vw,1.25rem)]', weight: 'font-semibold', opacity: 'opacity-35', bottom: '40%', left: '12%', depth: 0.5, animation: 'animate-float-a', mobileVisible: true },
  { word: '1 BHK', size: 'text-[clamp(1rem,2.2vw,1.7rem)]', weight: 'font-black', opacity: 'opacity-50', top: '36%', left: '16%', depth: 0.7, animation: 'animate-float-c', mobileVisible: true },

  // Mid-right / Middle-right
  { word: 'Zero logins', size: 'text-[clamp(0.85rem,1.6vw,1.2rem)]', weight: 'font-medium', opacity: 'opacity-55', top: '48%', right: '6%', depth: 0.4, animation: 'animate-float-a' , mobileVisible: true},
  { word: 'No outdated listings', size: 'text-[clamp(1rem,2vw,1.5rem)]', weight: 'font-bold', opacity: 'opacity-40', bottom: '35%', right: '14%', depth: 0.6, animation: 'animate-float-c', mobileVisible: true },
  { word: 'Hassle-free move-in', size: 'text-[clamp(0.95rem,1.8vw,1.4rem)]', weight: 'font-bold', opacity: 'opacity-45', bottom: '32%', right: '50%', depth: 0.6, animation: 'animate-float-b' },
  { word: '2 BHK', size: 'text-[clamp(1.1rem,2.4vw,1.9rem)]', weight: 'font-black', opacity: 'opacity-50', top: '36%', right: '18%', depth: 0.8, animation: 'animate-float-a', mobileVisible: true },

  // Bottom-left area
  { word: '72-hour guarantee', size: 'text-[clamp(1.1rem,2vw,1.6rem)]', weight: 'font-bold', opacity: 'opacity-45', bottom: '18%', left: '18%', depth: 0.7, animation: 'animate-float-a', mobileVisible: true },
  { word: '100% free search', size: 'text-[clamp(1rem,2vw,1.5rem)]', weight: 'font-extrabold', opacity: 'opacity-50', bottom: '10%', left: '4%', depth: 0.8, animation: 'animate-float-c' , mobileVisible: true},
  { word: '3 BHK', size: 'text-[clamp(1.2rem,2.6vw,2.1rem)]', weight: 'font-black', opacity: 'opacity-45', bottom: '28%', left: '26%', depth: 0.9, animation: 'animate-float-b'},

  // Bottom-right area
  { word: '7 days guarantee', size: 'text-[clamp(1.1rem,2vw,1.6rem)]', weight: 'font-bold', opacity: 'opacity-45', bottom: '22%', right: '18%', depth: 0.7, animation: 'animate-float-b', mobileVisible: true },
  { word: 'Real estate, minus the friction', size: 'text-[clamp(1rem,2vw,1.6rem)]', weight: 'font-bold', opacity: 'opacity-35', bottom: '12%', right: '12%', depth: 0.8, animation: 'animate-float-b' },
  { word: 'Safe deposits', size: 'text-[clamp(0.95rem,1.8vw,1.3rem)]', weight: 'font-semibold', opacity: 'opacity-40', bottom: '20%', right: '38%', depth: 0.5, animation: 'animate-float-a' },
  { word: 'Mumbai', size: 'text-[clamp(1.3rem,2.4vw,2rem)]', weight: 'font-extrabold', opacity: 'opacity-40', bottom: '28%', right: '32%', depth: 0.7, animation: 'animate-float-a' },

  // Bottom-center area
  { word: 'Mover & packers', size: 'text-[clamp(0.9rem,1.8vw,1.3rem)]', weight: 'font-semibold', opacity: 'opacity-35', bottom: '10%', left: '40%', depth: 0.5, animation: 'animate-float-a' , mobileVisible: true},
  { word: 'Jaipur', size: 'text-[clamp(1.1rem,2vw,1.6rem)]', weight: 'font-bold', opacity: 'opacity-40', top: '18%', left: '42%', depth: 0.5, animation: 'animate-float-b', mobileVisible: true },
  { word: 'Gurugram', size: 'text-[clamp(1rem,1.8vw,1.4rem)]', weight: 'font-semibold', opacity: 'opacity-35', bottom: '20%', left: '42%', depth: 0.6, animation: 'animate-float-a' },
  { word: 'Flatmate', size: 'text-[clamp(0.9rem,1.8vw,1.3rem)]', weight: 'font-semibold', opacity: 'opacity-35', bottom: '48%', right: '16%', depth: 0.4, animation: 'animate-float-c' }
];


const mobileKeywords: Keyword[] = [
  // Top margins (above buttons)
  { word: 'Rs500 FREE Listings', size: 'text-[clamp(0.95rem,3.2vw,1.2rem)]', weight: 'font-extrabold', opacity: 'opacity-55', top: '12%', left: '4%', depth: 0.6, animation: 'animate-float-c' },
  { word: 'Zero logins', size: 'text-[clamp(0.85rem,3vw,1.1rem)]', weight: 'font-bold', opacity: 'opacity-55', top: '12%', right: '4%', depth: 0.5, animation: 'animate-float-a' },
  { word: 'Instant rent agreement', size: 'text-[clamp(0.9rem,1.7vw,1.25rem)]', weight: 'font-semibold', opacity: 'opacity-35', bottom: '28%', left: '32%', depth: 0.5, animation: 'animate-float-a', mobileVisible: true },
  { word: 'Quality leads only', size: 'text-[clamp(0.9rem,3vw,1.1rem)]', weight: 'font-extrabold', opacity: 'opacity-45', top: '25%', left: '50%', depth: 0.7, animation: 'animate-float-b' },

  // Upper sides (gutter layout)
  { word: 'Broker assistance', size: 'text-[clamp(0.8rem,2.8vw,1rem)]', weight: 'font-semibold', opacity: 'opacity-40', top: '32%', left: '3%', depth: 0.4, animation: 'animate-float-d' },
  { word: '1 BHK', size: 'text-[clamp(0.95rem,3.2vw,1.2rem)]', weight: 'font-black', opacity: 'opacity-50', top: '20%', left: '15%', depth: 0.5, animation: 'animate-float-a' },
  { word: '2 BHK', size: 'text-[clamp(0.95rem,3.2vw,1.2rem)]', weight: 'font-black', opacity: 'opacity-50', top: '34%', right: '35%', depth: 0.5, animation: 'animate-float-c' },
  { word: 'Verified Owners', size: 'text-[clamp(0.8rem,2.8vw,1rem)]', weight: 'font-semibold', opacity: 'opacity-40', top: '32%', right: '3%', depth: 0.4, animation: 'animate-float-b' },

  // Lower sides (gutter layout)
  { word: 'No fake listings', size: 'text-[clamp(0.85rem,3vw,1.1rem)]', weight: 'font-bold', opacity: 'opacity-45', bottom: '32%', left: '3%', depth: 0.6, animation: 'animate-float-b' },
  { word: 'Real estate, minus the friction', size: 'text-[clamp(1rem,2vw,1.6rem)]', weight: 'font-bold', opacity: 'opacity-35', bottom: '7%', right: '12%', depth: 0.8, animation: 'animate-float-b' },
  { word: 'No outdated listings', size: 'text-[clamp(0.85rem,3vw,1.1rem)]', weight: 'font-bold', opacity: 'opacity-45', bottom: '35%', right: '3%', depth: 0.6, animation: 'animate-float-c' },

  // Bottom margins (below buttons)
  { word: '72-hour guarantee', size: 'text-[clamp(0.85rem,3vw,1.1rem)]', weight: 'font-bold', opacity: 'opacity-50', bottom: '24%', left: '4%', depth: 0.7, animation: 'animate-float-a' },
  { word: '100% free search', size: 'text-[clamp(1rem,2vw,1.5rem)]', weight: 'font-extrabold', opacity: 'opacity-50', bottom: '10%', left: '4%', depth: 0.8, animation: 'animate-float-c' , mobileVisible: true},
  { word: '7 days guarantee', size: 'text-[clamp(0.85rem,3vw,1.1rem)]', weight: 'font-bold', opacity: 'opacity-50', bottom: '24%', right: '14%', depth: 0.7, animation: 'animate-float-b' },
  
  // Outer bottom
  { word: 'Jaipur', size: 'text-[clamp(0.9rem,3vw,1.15rem)]', weight: 'font-bold', opacity: 'opacity-40', bottom: '18%', left: '16%', depth: 0.5, animation: 'animate-float-c' },
  { word: 'Mumbai', size: 'text-[clamp(0.9rem,3vw,1.15rem)]', weight: 'font-bold', opacity: 'opacity-40', bottom: '15%', right: '16%', depth: 0.5, animation: 'animate-float-a' },
  { word: 'Mover & packers', size: 'text-[clamp(0.8rem,2.8vw,1rem)]', weight: 'font-semibold', opacity: 'opacity-35', top: '18%', left: '40%', depth: 0.4, animation: 'animate-float-d' }
];

const LandingPage: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex items-center gap-2.5 text-white no-underline text-[0.8rem] font-semibold tracking-[0.14em] uppercase border border-white/35 py-3.5 px-6 rounded mt-8 w-fit hover:bg-white/8 transition-all duration-300"
            style={{
              transitionDelay: `${5 * 80 + 100}ms`,
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <PlusCircle size={16} />
            LIST PROPERTY
          </Link>
        </div>

        {/* ---- REDESIGNED HERO SECTION CONTENT ---- */}
        <div className="absolute z-5 inset-0 flex flex-col items-center justify-center px-6 pt-24 pb-12 md:pt-28 md:px-16 overflow-hidden">
          
          {/* Floating Keyword Cloud (Desktop vs Mobile) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Desktop Cloud */}
            <div className="hidden md:block absolute inset-0">
              {desktopKeywords.map((kw, idx) => {
                const duration = `${(idx % 4) * 3 + 8 + (idx % 3) * 0.7}s`;
                const delay = `${-((idx % 7) * 1.8 + (idx % 5) * 0.5)}s`;
                const floatClasses = ['animate-float-a', 'animate-float-b', 'animate-float-c', 'animate-float-d'];
                const animationClass = floatClasses[idx % floatClasses.length];

                const floatStyle = {
                  top: kw.top,
                  left: kw.left,
                  right: kw.right,
                  bottom: kw.bottom,
                  animationDuration: duration,
                  animationDelay: delay,
                };

                const transformStyle = {
                  transform: `translate(${mousePos.x * kw.depth * 45}px, ${mousePos.y * kw.depth * 45}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                };

                return (
                  <div
                    key={`desk-${idx}`}
                    className={`absolute pointer-events-none select-none ${animationClass}`}
                    style={floatStyle}
                  >
                    <div
                      className={`text-white font-sans ${kw.size} ${kw.weight} ${kw.opacity}`}
                      style={transformStyle}
                    >
                      {kw.word}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Cloud */}
            <div className="block md:hidden absolute inset-0">
              {mobileKeywords.map((kw, idx) => {
                const duration = `${(idx % 4) * 3 + 8 + (idx % 3) * 0.7}s`;
                const delay = `${-((idx % 7) * 1.8 + (idx % 5) * 0.5)}s`;
                const floatClasses = ['animate-float-a', 'animate-float-b', 'animate-float-c', 'animate-float-d'];
                const animationClass = floatClasses[idx % floatClasses.length];

                const floatStyle = {
                  top: kw.top,
                  left: kw.left,
                  right: kw.right,
                  bottom: kw.bottom,
                  animationDuration: duration,
                  animationDelay: delay,
                };

                return (
                  <div
                    key={`mob-${idx}`}
                    className={`absolute pointer-events-none select-none ${animationClass}`}
                    style={floatStyle}
                  >
                    <div className={`text-white font-sans ${kw.size} ${kw.weight} ${kw.opacity}`}>
                      {kw.word}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Centered CTA Content Area */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl text-center">
            
            {/* Eyebrow badge */}
            <div className="flex items-center gap-2 text-white/70 text-[11px] sm:text-xs tracking-[0.22em] uppercase font-medium mb-6 sm:mb-8 animate-fade-in">
              <MapPin className="text-white/60 shrink-0" size={16} />
              <span>India's 1st Rental-Only Platform</span>
            </div>

            {/* Redesigned CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-7 w-full mb-12 sm:mb-16 animate-fade-up">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-3 no-underline text-[12px] sm:text-[13.5px] font-bold tracking-[0.16em] uppercase py-4.5 px-9 sm:py-5 sm:px-11 rounded-xl transition-all duration-300 bg-white text-[#0a1628] hover:bg-white/95 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_28px_rgba(255,255,255,0.22),0_4px_14px_rgba(0,0,0,0.16)] hover:shadow-[0_0_38px_rgba(255,255,255,0.42),0_8px_24px_rgba(0,0,0,0.22)]"
                id="hero-search-btn"
              >
                <Search size={18} />
                SEARCH PROPERTIES
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-3 no-underline text-[12px] sm:text-[13.5px] font-bold tracking-[0.16em] uppercase py-4.5 px-9 sm:py-5 sm:px-11 rounded-xl transition-all duration-300 bg-white/8 backdrop-blur-md text-white border border-white/20 hover:border-white/35 hover:bg-white/12 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_18px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_0_28px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.2)]"
                id="hero-list-property-cta-btn"
              >
                <PlusCircle size={18} />
                LIST PROPERTY
              </Link>
            </div>

            

          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-7 right-8 md:bottom-9 md:right-14 z-5 flex flex-col items-center gap-1.5 ">
          <div className="w-[22px] h-9 border border-white/35 rounded-xl flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-sm " />
          </div>
        </div>

      </section>

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Trust & Fraud Prevention Promise */}
      <TrustSection />

      {/* Neighborhood Score Section */}
      <NeighborhoodScoreSection />

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