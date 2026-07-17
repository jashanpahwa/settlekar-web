import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '/logo.png';

interface SidebarProps {
  userRole: 'owner' | 'broker' | 'firm' | 'tenant';
  activeTab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist' | 'notifications';
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist' | 'notifications') => void;
  propertiesCount: number;
  inquiriesCount: number;
  notificationsCount: number;
  handleSignOut: () => Promise<void>;
  onSwitchRole: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Icons = {
  Overview: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  ListProperty: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  Properties: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  Inquiries: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Wishlist: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Notifications: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  SwitchRole: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
  SignOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
  propertiesCount,
  inquiriesCount,
  notificationsCount,
  handleSignOut,
  onSwitchRole,
  isOpen = false,
  onClose = () => {},
}) => {
  const handleTabClick = (tab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist' | 'notifications') => {
    setActiveTab(tab);
    onClose();
  };

  const handleSwitchClick = () => {
    onSwitchRole();
    onClose();
  };

  const handleSignOutClick = () => {
    handleSignOut();
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-primary/30 transition-opacity duration-300 z-40 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`bg-surface-elevated border-r border-border p-7 flex flex-col z-50 transition-transform duration-300 w-[260px] h-screen overflow-y-auto shrink-0 md:sticky md:top-0 fixed left-0 top-0 bottom-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo & Portal Badge */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between ">
            <Link to="/" className="inline-flex items-center" onClick={onClose}>
              <img src={logoImage} alt="SettleKar" className="h-18 w-auto object-contain" />
            </Link>
            <button className="md:hidden p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface transition-colors cursor-pointer" onClick={onClose} aria-label="Close menu" color="#0a2540">
              <Icons.Close />
            </button>
          </div>
         
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 flex-grow" aria-label="Dashboard navigation">
          <div className="flex flex-col gap-0.5">
            <span className="font-head text-[10px] font-bold uppercase tracking-wider text-text-tertiary px-3 mb-1.5 block">Main</span>

            <button
              className={`bg-transparent border-0 border-l-2 text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors w-full ${activeTab === 'overview' ? 'border-l-primary-accent bg-primary-accent/10 text-primary-accent font-semibold' : 'border-transparent hover:bg-surface hover:text-text-primary'}`}
              onClick={() => handleTabClick('overview')}
            >
              <span className="flex items-center shrink-0 color-inherit"><Icons.Overview /></span>
              <span className="flex-1">Overview</span>
            </button>

            {userRole !== 'tenant' && (
              <>
                <button
                  className={`bg-transparent border-0 border-l-2 text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors w-full ${activeTab === 'list' ? 'border-l-primary-accent bg-primary-accent/10 text-primary-accent font-semibold' : 'border-transparent hover:bg-surface hover:text-text-primary'}`}
                  onClick={() => handleTabClick('list')}
                >
                  <span className="flex items-center shrink-0 color-inherit"><Icons.ListProperty /></span>
                  <span className="flex-1">List Property</span>
                </button>

                <button
                  className={`bg-transparent border-0 border-l-2 text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors w-full ${activeTab === 'properties' ? 'border-l-primary-accent bg-primary-accent/10 text-primary-accent font-semibold' : 'border-transparent hover:bg-surface hover:text-text-primary'}`}
                  onClick={() => handleTabClick('properties')}
                >
                  <span className="flex items-center shrink-0 color-inherit"><Icons.Properties /></span>
                  <span className="flex-1">My Properties</span>
                  {propertiesCount > 0 && (
                    <span className="ml-auto font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-surface text-text-secondary border border-border">{propertiesCount}</span>
                  )}
                </button>

                <button
                  className={`bg-transparent border-0 border-l-2 text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors w-full ${activeTab === 'inquiries' ? 'border-l-primary-accent bg-primary-accent/10 text-primary-accent font-semibold' : 'border-transparent hover:bg-surface hover:text-text-primary'}`}
                  onClick={() => handleTabClick('inquiries')}
                >
                  <span className="flex items-center shrink-0 color-inherit"><Icons.Inquiries /></span>
                  <span className="flex-1">Inquiries</span>
                  {inquiriesCount > 0 && (
                    <span className="ml-auto font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-primary-accent/10 text-primary-accent border border-primary-accent/18">{inquiriesCount}</span>
                  )}
                </button>
              </>
            )}

            <button
              className={`bg-transparent border-0 border-l-2 text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors w-full ${activeTab === 'wishlist' ? 'border-l-primary-accent bg-primary-accent/10 text-primary-accent font-semibold' : 'border-transparent hover:bg-surface hover:text-text-primary'}`}
              onClick={() => handleTabClick('wishlist')}
            >
              <span className="flex items-center shrink-0 color-inherit"><Icons.Wishlist /></span>
              <span className="flex-1">Wishlist</span>
            </button>

            <button
              className={`bg-transparent border-0 border-l-2 text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors w-full ${activeTab === 'notifications' ? 'border-l-primary-accent bg-primary-accent/10 text-primary-accent font-semibold' : 'border-transparent hover:bg-surface hover:text-text-primary'}`}
              onClick={() => handleTabClick('notifications')}
            >
              <span className="flex items-center shrink-0 color-inherit"><Icons.Notifications /></span>
              <span className="flex-1">Notifications</span>
              {notificationsCount > 0 && (
                <span className="ml-auto font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-primary-accent/10 text-primary-accent border border-primary-accent/18">{notificationsCount}</span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-0.5 mt-3 pt-3 border-t border-border">
            <span className="font-head text-[10px] font-bold uppercase tracking-wider text-text-tertiary px-3 mb-1.5 block">Account</span>

            <button className="bg-transparent border-0 border-l-2 border-transparent text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-surface hover:text-text-primary w-full" onClick={handleSwitchClick}>
              <span className="flex items-center shrink-0 color-inherit"><Icons.SwitchRole /></span>
              <span className="flex-1">Switch Role</span>
            </button>

            <button className="md:hidden bg-transparent border-0 border-l-2 border-transparent text-text-secondary font-body text-sm font-medium text-left py-2 px-3 rounded-r flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-surface hover:text-text-primary w-full" onClick={handleSignOutClick}>
              <span className="flex items-center shrink-0 color-inherit"><Icons.SignOut /></span>
              <span className="flex-1">Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Desktop Footer */}
        <div className="pt-4 border-t border-border mt-2">
          <button onClick={handleSignOutClick} className="bg-transparent border border-border text-text-secondary font-body text-sm font-medium py-2.5 px-3.5 w-full rounded-lg cursor-pointer flex items-center gap-2 transition-colors hover:bg-error/10 hover:text-error hover:border-error/20">
            <Icons.SignOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
