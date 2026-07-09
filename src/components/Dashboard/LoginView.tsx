import React from 'react';
import { Link } from 'react-router-dom';
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
    <div className="signInContainer">
      <title>SettleKar - Owner Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="signInCard">
        <div className="signInHeader">
          <Link to="/">
            <img src={logoImage} alt="SettleKar" className="signInLogo" width={500} height={125} />
          </Link>
          <span className="signInBadge">Dashboard Portal</span>
        </div>
        
        <h2>Manage Your Listings Hassle-Free</h2>
        <p>
          Sign in with your Google account to list apartments, review incoming inquiries from tenants in real-time, and settle deals directly without middle-men.
        </p>

        <div className="bullets">
          <div className="bulletItem">
            <span className="bulletIcon">⚡</span>
            <div>
              <h4>Direct Connections</h4>
              <p>Connect directly with verified tenants—no middleman, zero commission fees.</p>
            </div>
          </div>
          <div className="bulletItem">
            <span className="bulletIcon">🌐</span>
            <div>
              <h4>Multi-Platform Sync</h4>
              <p>Your listed properties and inquiries sync directly to SettleKar mobile apps instantly.</p>
            </div>
          </div>
        </div>

        {authError && <div className="authError">{authError}</div>}

        <button onClick={handleSignIn} className="googleSignInBtn" disabled={authSubmitting}>
          {authSubmitting ? (
            <span className="submittingSpan">Signing in...</span>
          ) : (
            <>
              <span className="googleIcon">G</span> Sign In with Google
            </>
          )}
        </button>
        
        <Link to="/" className="backHomeLink">
          ← Back to SettleKar Home
        </Link>
      </div>
    </div>
  );
};

export default LoginView;
