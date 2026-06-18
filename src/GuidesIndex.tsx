import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import styles from './GuidesIndex.module.css';
import { articlesData } from './articlesData';
import logoImage from '/logo.png';

const pillarIcons: Record<string, string> = {
  'area-guides': '📍',
  'renting-education': '📚',
  'cost-budget': '💰',
  'comparisons': '⚔️',
  'moving-guides': '📦'
};

const pillarLabels: Record<string, string> = {
  'area-guides': 'Area Guides',
  'renting-education': 'Renting Education',
  'cost-budget': 'Cost & Budget',
  'comparisons': 'Comparisons',
  'moving-guides': 'Moving Guides'
};

const GuidesIndex: React.FC = () => {
  

  // States
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [scrolled, setScrolled] = useState<boolean>(false);
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

  // Filter articles
  const filteredArticles = selectedPillar === 'all'
    ? articlesData
    : articlesData.filter(art => art.pillar === selectedPillar);

  return (
    <div className={styles.guidesPage}>
      {/* React 19 Document Metadata */}
      <title>SettleKar Rental Guides - Expert Relocation & Renting Knowledge</title>
      <meta name="description" content="Read SettleKar's expert guides on renting, cost of living in Jaipur, area profiles, rental agreements checklists, and avoiding broker commission scams." />
      <link rel="canonical" href="https://settlekar.in/guides" />

      {/* Header */}
      <header role="banner" className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isMobileMenuOpen ? styles.headerMobileOpen : ''}`}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.logoImage}  />
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
            <Link to="/" className={styles.navLink}>Home</Link>
            <a href="/#features" className={styles.navLink}>Features</a>
            <Link to="/guides" className={`${styles.navLink} ${styles.navLinkSpecial}`}>Guides & Blogs</Link>
            <Link to="/dashboard" className={`${styles.navLink} ${styles.navLinkSpecial}`}>➕ List Property</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>SettleKar Guides & Knowledge Hub</h1>
            <p>
              Your ultimate resource for rent trends, moving checklists, agreement laws, 
              and locality comparison insights to settle into your new home hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Pillar Filters Tabs */}
          <div className={styles.pillarFilters}>
            <button 
              className={`${styles.filterBtn} ${selectedPillar === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setSelectedPillar('all')}
            >
              🌐 All Guides
            </button>
            {Object.keys(pillarLabels).map((key) => (
              <button
                key={key}
                className={`${styles.filterBtn} ${selectedPillar === key ? styles.activeFilter : ''}`}
                onClick={() => setSelectedPillar(key)}
              >
                {pillarIcons[key]} {pillarLabels[key]}
              </button>
            ))}
          </div>

          {/* Guides Cards Grid */}
          <div className={styles.guidesGrid}>
            {filteredArticles.map((article) => (
              <Link 
                key={article.slug} 
                to={`/guides/${article.slug}`} 
                className={styles.guideCard}
                data-pillar={article.pillar}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.pillarBadge}>{pillarLabels[article.pillar]}</span>
                  <span>{pillarIcons[article.pillar]}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.metaRow}>
                    <span>⏱️ {article.readTime}</span>
                    <span>•</span>
                    <span>📅 {article.updatedDate}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p className={styles.excerpt}>{article.subTitle}</p>
                  <div className={styles.readMoreLink}>
                    Read Article <span>➔</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

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

export default GuidesIndex;
