import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logoImage from '/logo.png';
import ContactModal from './ContactModal';

const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.settlekar.settlekar';

const Footer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const fitWatermark = () => {
    const svg = svgRef.current;
    const text = textRef.current;
    if (!svg || !text) return;
    try {
      const bbox = text.getBBox();
      svg.setAttribute(
        'viewBox',
        `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
      );
    } catch (_) {}
  };

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(fitWatermark);
    } else {
      window.addEventListener('load', fitWatermark);
    }
    window.addEventListener('resize', fitWatermark);
    return () => window.removeEventListener('resize', fitWatermark);
  }, []);

  const handleScrollTo = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.footerSection}>
      <div className={styles.footerWrapper}>

        {/* ===== LEFT CARD ===== */}
        <div className={styles.footerLeft}>

          {/* Decorative background elements */}
          <div className={styles.leftDecor} aria-hidden="true">
            {/* Dot grid */}
            <div className={styles.leftDotGrid} />
            {/* Glow orb top-right */}
            <div className={styles.leftOrb1} />
            {/* Glow orb bottom-left */}
            <div className={styles.leftOrb2} />
            {/* Floating location pin cards */}
            <div className={styles.leftPinCard1}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" fillOpacity="0.9"/>
              </svg>
              <span>Koramangala, BLR</span>
            </div>
            <div className={styles.leftPinCard2}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" fillOpacity="0.9"/>
              </svg>
              <span>Bandra, Mumbai</span>
            </div>
            <div className={styles.leftPinCard3}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" fillOpacity="0.9"/>
              </svg>
              <span>Viman Nagar</span>
            </div>
            
          </div>

          {/* Logo */}
          <div className={styles.footerLogo}>
            <img src={logoImage} alt="SettleKar" className={styles.footerLogoImg} />
          </div>

          {/* Tagline */}
          <div className={styles.footerTaglineContainer}>
            <p className={styles.footerTagline}>
              Quality rentals,<br />
              <span>find your home with ease.</span>
            </p>
          </div>

          {/* Social row */}
          <div className={styles.footerSocialRow}>
            <span className={styles.footerSocialLabel}>Stay in touch!</span>
            <div className={styles.footerSocialIcons}>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Google Play */}
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Google Play"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
                  <path d="M3.18 23.76a1.49 1.49 0 0 1-.75-.2 1.56 1.56 0 0 1-.77-1.37V1.81A1.56 1.56 0 0 1 2.43.44a1.5 1.5 0 0 1 1.56.09l16.8 10.19a1.56 1.56 0 0 1 0 2.56L4 23.47a1.5 1.5 0 0 1-.82.29z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ===== RIGHT CARD ===== */}
        <div className={styles.footerRight}>

          {/* Floating lucky badge */}
          <div className={styles.footerLuckyGraphic}>
            <div className={styles.luckyCube}>
              <span className={styles.luckyCubeMark}>S</span>
            </div>
            <div className={styles.luckyTextRow}>
              <svg
                className={styles.luckyArrow}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 20 C 6 14, 10 9, 18 5" />
                <path d="M18 5 L 12 5" />
                <path d="M18 5 L 18 11" />
              </svg>
              <span className={styles.luckyText}>Find home?</span>
            </div>
          </div>

          {/* Nav columns */}
          <div className={styles.footerRightTop}>
            <div className={styles.footerNavCols}>
              {/* Navigation column */}
              <div className={styles.footerCol}>
                <p className={styles.footerColTitle}>Navigation</p>
                <a href="/#how-it-works" onClick={(e) => handleScrollTo('how-it-works', e)}>How It Works</a>
                <a href="/#features" onClick={(e) => handleScrollTo('features', e)}>Features</a>
                <a href="/#download" onClick={(e) => handleScrollTo('download', e)}>Download App</a>
                <Link to="/guides">Guides & Blogs</Link>
                <a href="/#faq" onClick={(e) => handleScrollTo('faq', e)}>FAQ</a>
              </div>
              {/* Company column */}
              <div className={styles.footerCol}>
                <p className={styles.footerColTitle}>Company</p>
                <Link to="/dashboard">List Property</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-service">Terms of Service</Link>
                <Link to="/delete-account">Delete Account</Link>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className={styles.footerColBtn}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              © 2026 SettleKar. All rights reserved.
            </p>
            <div className={styles.footerCtaMini}>
              <h4 className={styles.footerCtaHeading}>
                India's rental market moves fast.<br />
                <strong>Stay ahead with SettleKar.</strong>
              </h4>
              <div className={styles.footerSubscribeRow}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={styles.footerEmailInput}
                  aria-label="Email for updates"
                />
                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSubscribeBtn}
                >
                  Get App
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className={styles.footerWatermark} aria-hidden="true">
        <svg
          ref={svgRef}
          id="watermarkSvg"
          viewBox="62 95 876 175"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            ref={textRef}
            id="watermarkText"
            x="500"
            y="240"
            textAnchor="middle"
            fontSize="320"
            fontFamily="'DM Sans', sans-serif"
            fontWeight="700"
            letterSpacing="-0.03em"
            fill="rgba(0,0,0,0.08)"
          >
            SettleKar
          </text>
        </svg>
      </div>
      {/* Contact Form Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};

export default Footer;
