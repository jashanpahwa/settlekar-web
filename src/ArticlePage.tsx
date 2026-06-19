import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import styles from './ArticlePage.module.css';
import { articlesData } from './articlesData';
import logoImage from '/logo.png';
import NotFound from './NotFound';

const pillarLabels: Record<string, string> = {
  'area-guides': 'Area Guide',
  'renting-education': 'Renting Education',
  'cost-budget': 'Cost & Budget',
  'comparisons': 'Comparison',
  'moving-guides': 'Moving Guide'
};

const ArticlePage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();

  // Find the article data
  const article = articlesData.find((art) => art.slug === articleSlug);

  // States
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll Listener for header scale and reading progress
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to track reading sections for Table of Contents
  useEffect(() => {
    if (!article) return;

    const sections = article.sections.map((sec) =>
      sec.heading.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    );

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // Trigger when section passes through the top-mid viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [article]);

  // Scroll to section on TOC item click
  const handleAnchorClick = (heading: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const cleanId = heading.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const element = document.getElementById(cleanId);
    if (element) {
      const offset = 120; // Header spacing offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${cleanId}`);
    }
  };

  // If no article found, fallback to NotFound
  if (!article) {
    return <NotFound />;
  }

  // Schema configs
  const canonicalUrl = `https://settlekar.in/guides/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.metaDescription,
    "image": "https://settlekar.in/logo.png",
    "datePublished": new Date(article.publishedDate).toISOString().split('T')[0],
    "dateModified": new Date(article.updatedDate).toISOString().split('T')[0],
    "author": {
      "@type": "Organization",
      "name": "SettleKar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SettleKar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://settlekar.in/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  // Fetch related articles
  const relatedArticles = articlesData.filter((art) =>
    article.relatedSlugs.includes(art.slug)
  );

  // Parallax calculations for floating squares in Hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const sqY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const sqY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const sqY3 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const sqY4 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const sqY5 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const sqY6 = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div className={styles.articlePage}>
      {/* React 19 Document Metadata */}
      <title>{article.metaTitle}</title>
      <meta name="description" content={article.metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={article.metaTitle} />
      <meta property="og:description" content={article.metaDescription} />
      <meta property="og:image" content="https://settlekar.in/logo.png" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="SettleKar" />
      <meta property="article:published_time" content={new Date(article.publishedDate).toISOString()} />
      <meta property="article:modified_time" content={new Date(article.updatedDate).toISOString()} />
      <meta property="article:author" content={article.author.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.metaTitle} />
      <meta name="twitter:description" content={article.metaDescription} />
      <meta name="twitter:image" content="https://settlekar.in/logo.png" />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>

      {/* Reading Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />
      </div>

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
            <Link to="/" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <a href="/#features" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <Link to="/guides" className={`${styles.navLink} ${styles.navLinkSpecial}`} onClick={() => setIsMobileMenuOpen(false)}>Guides & Blogs</Link>
            <Link to="/dashboard" className={`${styles.navLink} ${styles.navLinkSpecial}`} onClick={() => setIsMobileMenuOpen(false)}>➕ List Property</Link>
          </nav>
        </div>
      </header>

      {/* Hero Header Section */}
      <section ref={heroRef} className={styles.hero}>
        {/* Floating Parallax Background Squares */}
        <motion.div className="absolute pointer-events-none bg-black/10 rounded-[2px]" style={{ left: '8%', top: '25%', width: '10px', height: '10px', y: sqY1 }} />
        <motion.div className="absolute pointer-events-none bg-black/15 rounded-[1px]" style={{ left: '12%', top: '65%', width: '6px', height: '6px', y: sqY2 }} />
        <motion.div className="absolute pointer-events-none bg-black/10 rounded-[3px]" style={{ right: '10%', top: '20%', width: '12px', height: '12px', y: sqY3 }} />
        <motion.div className="absolute pointer-events-none bg-black/15 rounded-[2px]" style={{ right: '15%', top: '55%', width: '8px', height: '8px', y: sqY4 }} />
        <motion.div className="absolute pointer-events-none bg-black/5 rounded-[4px]" style={{ left: '4%', top: '80%', width: '14px', height: '14px', y: sqY5 }} />
        <motion.div className="absolute pointer-events-none bg-black/20 rounded-[1px]" style={{ right: '5%', top: '75%', width: '5px', height: '5px', y: sqY6 }} />

        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Breadcrumb links */}
            <ul className={styles.breadcrumbs}>
              <li><Link to="/" className={styles.breadcrumbLink}>Home</Link></li>
              <span className={styles.breadcrumbSeparator}>/</span>
              <li><Link to="/guides" className={styles.breadcrumbLink}>Guides</Link></li>
              <span className={styles.breadcrumbSeparator}>/</span>
              <li><span>{pillarLabels[article.pillar]}</span></li>
            </ul>

            <span className={styles.pillarBadge}>{pillarLabels[article.pillar]}</span>
            <h1>{article.title}</h1>
            <p className={styles.subtitle}>{article.subTitle}</p>

            <div className={styles.authorMeta}>
              <span className={styles.publishMeta}>Published {article.publishedDate} • Updated {article.updatedDate} • ⏱️ {article.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Layout Grid */}
      <div className={styles.container}>
        <div className={styles.layoutGrid}>
          {/* Main Body */}
          <main className={styles.articleBody}>
            {article.sections.map((section, idx) => {
              const elementId = section.heading.replace(/[^a-z0-9]/gi, '-').toLowerCase();
              return (
                <section key={idx} id={elementId}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}

                  {/* Optional Checklist / Bullet Points */}
                  {section.bulletPoints && (
                    <ul className={styles.bulletList}>
                      {section.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  {/* Optional Quote / Callout */}
                  {section.callout && (
                    <blockquote className={styles.calloutCard}>
                      {section.callout}
                    </blockquote>
                  )}

                  {/* Optional Rent/Budget Comparison Table */}
                  {section.tableData && (
                    <div className={styles.dataTableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            {section.tableData.headers.map((h, hIdx) => (
                              <th key={hIdx}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.tableData.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}

            {/* Local Expert Insight Highlight Box */}
            {article.localInsights.length > 0 && (
              <div className={styles.insightCard}>
                <h3>💡 Local Expert Insights</h3>
                <ul className={styles.insightList}>
                  {article.localInsights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Internal linking CTAs to location pages */}
            {article.internalRentalLinks.length > 0 && (
              <section className={styles.linkingSection}>
                <h3>Explore Verified Rentals on SettleKar</h3>
                <p>Browse live, direct-owner properties near these hubs with zero brokerage fees:</p>
                <div className={styles.linkButtonsGrid}>
                  {article.internalRentalLinks.map((link, idx) => (
                    <Link key={idx} to={link.url} className={styles.linkCta}>
                      {link.text} ➔
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Table of Contents */}
            <div className={styles.widget}>
              <h4 className={styles.widgetTitle}>Table of Contents</h4>
              <ul className={styles.tocList}>
                {article.sections.map((sec, idx) => {
                  const elementId = sec.heading.replace(/[^a-z0-9]/gi, '-').toLowerCase();
                  const isActive = activeSection === elementId;
                  return (
                    <li key={idx}>
                      <a
                        href={`#${elementId}`}
                        onClick={(e) => handleAnchorClick(sec.heading, e)}
                        className={isActive ? styles.tocActive : ''}
                      >
                        {sec.heading}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Author details removed */}
          </aside>
        </div>
      </div>

      {/* Related Articles cluster links */}
      {relatedArticles.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#000000', marginBottom: '2.5rem' }}>
              Related Guides
            </h3>
            <div className={styles.relatedGrid}>
              {relatedArticles.map((art) => (
                <Link key={art.slug} to={`/guides/${art.slug}`} className={styles.relatedCard}>
                  <span className={styles.pillar}>{pillarLabels[art.pillar]}</span>
                  <h4>{art.title}</h4>
                  <p>{art.subTitle}</p>
                  <div className={styles.relatedLink}>Read Guide ➔</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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

export default ArticlePage;
