import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css';
import logoImage from '/logo.png';

interface LoginViewProps {
  handleSignIn: () => Promise<void>;
  authSubmitting: boolean;
  authError: string;
}

const LoginView: React.FC<LoginViewProps> = ({
  handleSignIn,
  authSubmitting,
  authError,
}) => {
  return (
    <div className={styles.signInContainer}>
      <title>SettleKar - Owner Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className={styles.signInCard}>
        <div className={styles.signInHeader}>
          <Link to="/">
            <img src={logoImage} alt="SettleKar" className={styles.signInLogo} width={500} height={125} />
          </Link>
          <span className={styles.signInBadge}>Dashboard Portal</span>
        </div>
        
        <h2>Manage Your Listings Hassle-Free</h2>
        <p>
          Sign in with your Google account to list apartments, review incoming inquiries from tenants in real-time, and settle deals directly without middle-men.
        </p>

        <div className={styles.bullets}>
          <div className={styles.bulletItem}>
            <span className={styles.bulletIcon}>⚡</span>
            <div>
              <h4>Direct Connections</h4>
              <p>Chat directly with verified tenants—no brokers, zero brokerage fees.</p>
            </div>
          </div>
          <div className={styles.bulletItem}>
            <span className={styles.bulletIcon}>🌐</span>
            <div>
              <h4>Multi-Platform Sync</h4>
              <p>Your listed properties and inquiries sync directly to SettleKar mobile apps instantly.</p>
            </div>
          </div>
        </div>

        {authError && <div className={styles.authError}>{authError}</div>}

        <button onClick={handleSignIn} className={styles.googleSignInBtn} disabled={authSubmitting}>
          {authSubmitting ? (
            <span className={styles.submittingSpan}>Signing in...</span>
          ) : (
            <>
              <span className={styles.googleIcon}>G</span> Sign In with Google
            </>
          )}
        </button>
        
        <Link to="/" className={styles.backHomeLink}>
          ← Back to SettleKar Home
        </Link>
      </div>
    </div>
  );
};

export default LoginView;
