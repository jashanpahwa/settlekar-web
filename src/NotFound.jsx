import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/logo.png" alt="SettleKar" className={styles.logoImage} />
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/privacy-policy" className={styles.navLink}>Privacy Policy</Link>
            <Link to="/delete-account" className={styles.navLink}>Delete Account</Link>
          </nav>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.notFoundContainer}>
          <div className={styles.notFoundContent}>
            <div className={styles.errorCode}>404</div>
            <h1>Page Not Found</h1>
            <p>
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className={styles.notFoundActions}>
              <Link to="/" className={`${styles.btn} ${styles.btnPrimary}`}>
                Go Home
              </Link>
              <button 
                onClick={() => window.history.back()}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Go Back
              </button>
            </div>
          </div>
          
          <div className={styles.helpfulLinks}>
            <h3>Helpful Links</h3>
            <div className={styles.linksGrid}>
              <Link to="/" className={styles.helpfulLink}>
                <div className={styles.linkIcon}>🏠</div>
                <div className={styles.linkContent}>
                  <h4>Homepage</h4>
                  <p>Return to our main page and explore properties</p>
                </div>
              </Link>
              
              <Link to="/privacy-policy" className={styles.helpfulLink}>
                <div className={styles.linkIcon}>🔒</div>
                <div className={styles.linkContent}>
                  <h4>Privacy Policy</h4>
                  <p>Learn about how we protect your data</p>
                </div>
              </Link>
              
              <Link to="/delete-account" className={styles.helpfulLink}>
                <div className={styles.linkIcon}>⚙️</div>
                <div className={styles.linkContent}>
                  <h4>Account Settings</h4>
                  <p>Manage your account preferences</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>SettleKar</h3>
              <p>Your trusted partner in finding the perfect rental property.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/delete-account">Delete Account</Link></li>
              </ul>
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

export default NotFound;