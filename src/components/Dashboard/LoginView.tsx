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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body">
      <title>SettleKar - Owner Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="bg-surface-elevated border border-border rounded-2xl p-10 w-full max-w-[480px] shadow-lg">
        <div className="flex flex-col gap-3 mb-6">
          <Link to="/">
            <img src={logoImage} alt="SettleKar" className="h-[34px] w-auto object-contain" width={500} height={125} />
          </Link>
          <span className="bg-primary-accent/10 border border-primary-accent/18 text-primary-accent font-head text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full w-fit">Dashboard Portal</span>
        </div>
        
        <h2 className="font-head text-[1.6rem] font-bold text-text-primary mb-1 tracking-tight">Manage Your Listings Hassle-Free</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-7">
          Sign in with your Google account to list apartments, review incoming inquiries from tenants in real-time, and settle deals directly without middle-men.
        </p>

        <div className="flex flex-col gap-3 mb-7">
          <div className="flex gap-3.5 bg-surface border border-border p-3.5 rounded-xl">
            <span className="text-[1.1rem] shrink-0 mt-0.5">⚡</span>
            <div>
              <h4 className="text-text-primary text-sm font-semibold mb-0.5">Direct Connections</h4>
              <p className="text-text-secondary text-xs leading-normal">Connect directly with verified tenants—no middleman, zero commission fees.</p>
            </div>
          </div>
          <div className="flex gap-3.5 bg-surface border border-border p-3.5 rounded-xl">
            <span className="text-[1.1rem] shrink-0 mt-0.5">🌐</span>
            <div>
              <h4 className="text-text-primary text-sm font-semibold mb-0.5">Multi-Platform Sync</h4>
              <p className="text-text-secondary text-xs leading-normal">Your listed properties and inquiries sync directly to SettleKar mobile apps instantly.</p>
            </div>
          </div>
        </div>

        {authError && <div className="bg-error/10 border border-error/25 text-error text-[0.85rem] p-3 rounded mb-4">{authError}</div>}

        <button onClick={handleSignIn} className="w-full bg-surface-elevated hover:bg-surface text-text-primary border border-border text-sm font-semibold font-head py-3.5 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-2.5 transition-colors disabled:opacity-55 disabled:cursor-not-allowed mb-4 shadow-sm" disabled={authSubmitting}>
          {authSubmitting ? (
            <span className="flex items-center gap-2">Signing in...</span>
          ) : (
            <>
              <span className="font-bold">G</span> Sign In with Google
            </>
          )}
        </button>
        
        <Link to="/" className="block text-center text-text-secondary hover:text-text-primary text-[0.85rem] no-underline transition-colors">
          ← Back to SettleKar Home
        </Link>
      </div>
    </div>
  );
};

export default LoginView;
