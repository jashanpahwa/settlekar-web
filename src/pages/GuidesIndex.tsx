import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import styles from '../styles/GuidesIndex.module.css';
import { articlesData, ArticleData } from '../utils/articlesData';
import logoImage from '/logo.png';

// Pillar Labels mapping
const pillarLabels: Record<string, string> = {
  'area-guides': 'Area Guides',
  'renting-education': 'Renting Education',
  'cost-budget': 'Cost & Budget',
  'comparisons': 'Comparisons',
  'moving-guides': 'Moving Guides'
};

// Mapped images for our articles
const articleImages: Record<string, string> = {
  'best-areas-to-live-in-jaipur-working-professionals': 'https://images.pexels.com/photos/7691249/pexels-photo-7691249.jpeg?auto=compress&cs=tinysrgb&w=800',
  'how-to-rent-flat-without-broker-jaipur': 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=800',
  'cost-of-living-in-jaipur': 'https://images.pexels.com/photos/5428003/pexels-photo-5428003.jpeg?auto=compress&cs=tinysrgb&w=800',
  'pg-vs-flat-comparison-jaipur': 'https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=800',
  'moving-to-jaipur-relocation-guide': 'https://images.pexels.com/photos/3797503/pexels-photo-3797503.jpeg?auto=compress&cs=tinysrgb&w=800',
  'premium-suburbs-to-rent-mumbai': 'https://images.pexels.com/photos/14840134/pexels-photo-14840134.jpeg?auto=compress&cs=tinysrgb&w=800',
  'bengaluru-rental-market-guide': 'https://images.pexels.com/photos/10070659/pexels-photo-10070659.jpeg?auto=compress&cs=tinysrgb&w=800',
  'gurugram-renting-sectors-guide': 'https://images.pexels.com/photos/18251717/pexels-photo-18251717.jpeg?auto=compress&cs=tinysrgb&w=800',
  'pune-rental-localities-working-professionals': 'https://images.pexels.com/photos/18883652/pexels-photo-18883652.jpeg?auto=compress&cs=tinysrgb&w=800',
  'understanding-rental-agreements-tenants-checklist': 'https://images.pexels.com/photos/4814061/pexels-photo-4814061.jpeg?auto=compress&cs=tinysrgb&w=800',
  'hidden-costs-of-renting-apartments': 'https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg?auto=compress&cs=tinysrgb&w=800',
  'furnished-vs-unfurnished-flats-rental-guide': 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=800',
  'relocation-packing-checklist-working-professionals': 'https://images.pexels.com/photos/5025662/pexels-photo-5025662.jpeg?auto=compress&cs=tinysrgb&w=800',
  'top-residential-hubs-for-techies-chennai': 'https://images.pexels.com/photos/10070659/pexels-photo-10070659.jpeg?auto=compress&cs=tinysrgb&w=800'
};

// Custom magnetic squares layout per article
const articleSquares: Record<string, [number, number, number][]> = {
  'best-areas-to-live-in-jaipur-working-professionals': [
    [5, 30, 16], [10, 42, 10], [3, 52, 7], [80, 70, 14], [85, 82, 9], [78, 60, 6]
  ],
  'how-to-rent-flat-without-broker-jaipur': [
    [82, 55, 16], [88, 68, 10], [78, 72, 7], [85, 42, 6], [90, 80, 8]
  ],
  'cost-of-living-in-jaipur': [
    [4, 24, 16], [10, 36, 10], [2, 44, 7], [78, 78, 14], [84, 88, 8]
  ],
  'pg-vs-flat-comparison-jaipur': [
    [82, 26, 14], [88, 38, 10], [78, 44, 7], [84, 54, 5], [90, 60, 8]
  ],
  'moving-to-jaipur-relocation-guide': [
    [5, 15, 12], [12, 24, 10], [6, 32, 6], [82, 75, 14], [86, 85, 8]
  ],
  'premium-suburbs-to-rent-mumbai': [
    [4, 15, 12], [85, 75, 14], [86, 85, 8], [9, 27, 8]
  ],
  'bengaluru-rental-market-guide': [
    [82, 20, 15], [88, 32, 9], [79, 40, 6], [5, 45, 10]
  ],
  'gurugram-renting-sectors-guide': [
    [6, 25, 14], [12, 35, 8], [84, 80, 12], [88, 68, 6]
  ],
  'pune-rental-localities-working-professionals': [
    [82, 60, 16], [88, 72, 10], [79, 78, 6], [4, 18, 12]
  ],
  'understanding-rental-agreements-tenants-checklist': [
    [5, 20, 14], [12, 30, 8], [85, 70, 12], [88, 58, 6]
  ],
  'hidden-costs-of-renting-apartments': [
    [82, 18, 16], [88, 28, 10], [79, 36, 6], [4, 40, 12]
  ],
  'furnished-vs-unfurnished-flats-rental-guide': [
    [6, 15, 12], [84, 75, 14], [88, 62, 8], [8, 25, 8]
  ],
  'relocation-packing-checklist-working-professionals': [
    [82, 55, 15], [88, 65, 9], [79, 72, 6], [5, 78, 10]
  ],
  'top-residential-hubs-for-techies-chennai': [
    [5, 25, 14], [12, 35, 8], [85, 82, 12], [88, 70, 6]
  ]
};


/* ==========================================
   INTERACTIVE CASE STUDY/BLOG CARD
   ========================================== */
interface GuideCardProps {
  article: ArticleData;
  index: number;
}

const GuideCard: React.FC<GuideCardProps> = ({ article, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic values
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    pointerX.set(x);
    pointerY.set(y);
  };

  const handleMouseLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    setIsHovered(false);
  };

  // Pixel Grid overlay dimensions (12x8)
  const rows = 8;
  const cols = 12;
  const pixelBlocks = Array.from({ length: rows * cols });

  const squares = articleSquares[article.slug] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/guides/${article.slug}`} className="block text-decoration-none">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="group relative aspect-[4/3] w-full overflow-hidden bg-[#1A1A1C] rounded-2xl cursor-pointer"
        >
          {/* 1. Background Cover Image */}
          <img
            src={articleImages[article.slug] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* 2. Pixel Block Hover Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-12 grid-rows-8">
            {pixelBlocks.map((_, idx) => {
              const r = Math.floor(idx / cols);
              const c = idx % cols;
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isHovered ? 1.05 : 0,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                    delay: isHovered
                      ? (r + c) * 0.018
                      : ((rows - r) + (cols - c)) * 0.012,
                  }}
                  className="bg-black/80 border-[0.5px] border-black/10 origin-center"
                  style={{ gridRowStart: r + 1, gridColumnStart: c + 1 }}
                />
              );
            })}
          </div>

          {/* 3. Magnetic Parallax Black Squares */}
          {squares.map(([left, top, size], sqIdx) => {
            // Magnetic effect calculation: proportional pointer distance
            // We use spring animation for realistic physical return
            const xShift = useTransform(pointerX, [0, 1], [-20, 20]);
            const yShift = useTransform(pointerY, [0, 1], [-20, 20]);
            const springX = useSpring(xShift, { stiffness: 80, damping: 18, mass: 0.6 });
            const springY = useSpring(yShift, { stiffness: 80, damping: 18, mass: 0.6 });

            return (
              <motion.div
                key={sqIdx}
                className="absolute bg-black rounded-[2px] z-12 pointer-events-none"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  x: springX,
                  y: springY,
                }}
              />
            );
          })}

          {/* 4. Plus Button (Top Right) */}
          <div className="absolute right-4 top-4 z-12 flex h-7 w-7 items-center justify-center border border-white/30 text-xs text-white rounded-full bg-black/20 backdrop-blur-sm select-none">
            +
          </div>

          {/* 5. Info Plate (Bottom Left) */}
          <div className="absolute bottom-0 left-0 bg-white px-5 py-4 z-20 max-w-[75%] rounded-tr-2xl select-text">
            <h3 className="text-black font-semibold text-lg md:text-xl leading-tight tracking-tight mb-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-black/60 font-medium">{pillarLabels[article.pillar]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
              <span className="text-black font-semibold">{article.updatedDate.split(',')[1]?.trim() || '2026'}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ==========================================
   MAIN COMPONENT
   ========================================== */
const GuidesIndex: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax square positions config
  const squarePositions = [
    { x: 6, y: 20, size: 12 },
    { x: 12, y: 32, size: 8 },
    { x: 8, y: 44, size: 6 },
    { x: 88, y: 18, size: 10 },
    { x: 92, y: 30, size: 14 },
    { x: 85, y: 42, size: 7 },
    { x: 90, y: 52, size: 5 },
    { x: 14, y: 56, size: 5 },
  ];

  // useScroll parallax hooks
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Dynamic Scroll Listener for glassmorphic navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stable pool of exactly 10 random articles selected on mount
  const [randomArticles] = useState<ArticleData[]>(() => {
    return [...articlesData].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  // Filter articles
  const filteredArticles = selectedPillar === 'all'
    ? randomArticles
    : randomArticles.filter((art) => art.pillar === selectedPillar);

  return (
    <div className={styles.guidesPage}>
      {/* React 19 Document Metadata */}
      <title>SettleKar Rental Guides - Expert Relocation & Renting Knowledge</title>
      <meta name="description" content="Read SettleKar's expert guides on renting, cost of living in Jaipur, area profiles, rental agreements checklists, and avoiding broker commission scams." />
      <link rel="canonical" href="https://settlekar.in/guides" />

      {/* Inject styling block for the marquee animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marqueeProjects {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-projects {
          animation: marqueeProjects 28s linear infinite;
        }
        .marquee-projects:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Header */}
      <header role="banner" className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isMobileMenuOpen ? styles.headerMobileOpen : ''}`}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
            </Link>
          </div>

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
            <Link to="/" className={styles.navLink}>Home</Link>
            <a href="/#features" className={styles.navLink}>Features</a>
            <Link to="/guides" className={`${styles.navLink} ${styles.navLinkSpecial}`}>Guides & Blogs</Link>
            <Link to="/dashboard" className={`${styles.navLink} ${styles.navLinkSpecial}`}>➕ List Property</Link>
          </nav>
        </div>
      </header>

      {/* Main Redesigned Content Container */}
      <section
        ref={sectionRef}
        className="relative bg-white text-black py-24 select-none"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Parallax Floating Layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden layer z-5">
          {squarePositions.map((pos, idx) => {
            // Apply Scroll Parallax transform smoothed with useSpring
            const rawParallax = useTransform(scrollYProgress, [0, 1], [0, -(80 + idx * 30)]);
            const smoothParallax = useSpring(rawParallax, { stiffness: 40, damping: 20 });

            return (
              <motion.div
                key={idx}
                className="absolute bg-black rounded-[2px]"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3 + idx * 0.4,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: idx * 0.3,
                }}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${pos.size}px`,
                  height: `${pos.size}px`,
                  y: smoothParallax,
                }}
              />
            );
          })}
        </div>

        {/* Top Header Area */}
        <div className="relative z-10 px-6 pb-14 pt-28 sm:px-10 lg:px-16 lg:pt-36">
          <div className="relative mx-auto max-w-7xl text-center">
            {/* Animating Header Container */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-5 inline-block bg-black px-4 py-1.5 text-[13px] font-medium tracking-wide text-white rounded-full">
                Guides & Blogs
              </span>
              <h1 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.2] tracking-tight max-w-3xl mx-auto">
                Insights from <span className="text-black">Our</span> <br />
                <span className="text-black/40">Locality Case Studies</span>
              </h1>
              <p className="text-gray-500 text-sm md:text-base mt-4 max-w-lg mx-auto leading-relaxed select-text">
                Your ultimate resource for rental checklists, cost indices, and landlord/tenant wisdom to settle in Jaipur brokerage-free.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filter Categories Menu */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 sm:px-10 lg:px-16 flex flex-wrap justify-center gap-2.5 select-none">
          <button
            onClick={() => setSelectedPillar('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              selectedPillar === 'all'
                ? 'bg-black text-white'
                : 'bg-black/5 text-black hover:bg-black/10'
            }`}
          >
            All Insights
          </button>
          {Object.entries(pillarLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedPillar(key)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                selectedPillar === key
                  ? 'bg-black text-white'
                  : 'bg-black/5 text-black hover:bg-black/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 2x2 Grid of Case Studies */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:px-16">
          {filteredArticles.length === 0 ? (
            <div className="bg-[#121214]/5 border border-black/5 rounded-3xl p-16 text-center select-text">
              <span className="text-3xl block mb-4">📚</span>
              <h2 className="text-black font-semibold text-lg">No Articles Found</h2>
              <p className="text-black/55 text-sm mt-1">Check back later or pick a different locality filter tab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {filteredArticles.map((article, idx) => (
                <GuideCard key={article.slug} article={article} index={idx} />
              ))}
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 sm:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 border-t border-black/10 pt-16">
            
            {/* Left Side: Statement & CTA */}
            <div className="max-w-md select-text">
              <div className="mb-4 flex h-7 w-7 items-center justify-center border border-black/20 text-xs text-black rounded-full select-none">
                +
              </div>
              <p className="text-[14px] leading-[1.7] text-black/60 font-medium">
                We partner with ambitious owners and verified renters that are ready to move beyond fragmented listings and shallow commission agents — turning their search, verification, and contract signatures into one focused engine for relocation.
              </p>
              
              <Link to="/dashboard" className="inline-block mt-8 select-none text-decoration-none">
                <button className="group flex items-end cursor-pointer">
                  <span className="inline-flex items-center gap-[10px] border border-black/20 bg-black px-5 py-3 text-sm font-semibold text-white rounded-xl hover:bg-black/90 transition-colors">
                    Let's work together
                  </span>
                  <span className="mb-6 ml-1 flex h-6 w-6 items-center justify-center bg-black rounded-md text-white transition-all duration-300 group-hover:mb-9">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z" fill="currentColor" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>

            

          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12" />
      </section>
    </div>
  );
};

export default GuidesIndex;
