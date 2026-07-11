import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '/logo.png';

interface SidebarProps {
  userRole: 'owner' | 'broker' | 'firm' | 'tenant';
  activeTab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist';
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist') => void;
  propertiesCount: number;
  inquiriesCount: number;
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

const ROLE_LABEL: Record<string, string> = {
  broker: 'Broker Portal',
  firm: 'Firm Portal',
  tenant: 'Tenant Portal',
  owner: 'Owner Portal',
};

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
  propertiesCount,
  inquiriesCount,
  handleSignOut,
  onSwitchRole,
  isOpen = false,
  onClose = () => {},
}) => {
  const handleTabClick = (tab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist') => {
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
        className={`sidebarOverlay ${isOpen ? 'overlayVisible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'sidebarOpen' : ''}`}>
        {/* Logo & Portal Badge */}
        <div className="sidebarHeader">
          <div className="sidebarLogoRow">
            <Link to="/" className="logoLink" onClick={onClose}>
              <img src={logoImage} alt="SettleKar" className="logoImage" />
            </Link>
            <button className="drawerCloseBtn" onClick={onClose} aria-label="Close menu">
              <Icons.Close />
            </button>
          </div>
          <span className="portalBadge">
            {ROLE_LABEL[userRole] ?? 'Portal'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="menu" aria-label="Dashboard navigation">
          <div className="menuSection">
            <span className="menuSectionLabel">Main</span>

            <button
              className={`menuItem ${activeTab === 'overview' ? 'activeMenu' : ''}`}
              onClick={() => handleTabClick('overview')}
            >
              <span className="menuItemIcon"><Icons.Overview /></span>
              <span className="menuItemLabel">Overview</span>
            </button>

            {userRole !== 'tenant' && (
              <>
                <button
                  className={`menuItem ${activeTab === 'list' ? 'activeMenu' : ''}`}
                  onClick={() => handleTabClick('list')}
                >
                  <span className="menuItemIcon"><Icons.ListProperty /></span>
                  <span className="menuItemLabel">List Property</span>
                </button>

                <button
                  className={`menuItem ${activeTab === 'properties' ? 'activeMenu' : ''}`}
                  onClick={() => handleTabClick('properties')}
                >
                  <span className="menuItemIcon"><Icons.Properties /></span>
                  <span className="menuItemLabel">My Properties</span>
                  {propertiesCount > 0 && (
                    <span className="badgeCount">{propertiesCount}</span>
                  )}
                </button>

                <button
                  className={`menuItem ${activeTab === 'inquiries' ? 'activeMenu' : ''}`}
                  onClick={() => handleTabClick('inquiries')}
                >
                  <span className="menuItemIcon"><Icons.Inquiries /></span>
                  <span className="menuItemLabel">Inquiries</span>
                  {inquiriesCount > 0 && (
                    <span className="badgeCountBlue">{inquiriesCount}</span>
                  )}
                </button>
              </>
            )}

            <button
              className={`menuItem ${activeTab === 'wishlist' ? 'activeMenu' : ''}`}
              onClick={() => handleTabClick('wishlist')}
            >
              <span className="menuItemIcon"><Icons.Wishlist /></span>
              <span className="menuItemLabel">Wishlist</span>
            </button>
          </div>

          <div className="menuSection menuSectionBottom">
            <span className="menuSectionLabel">Account</span>

            <button className="menuItem" onClick={handleSwitchClick}>
              <span className="menuItemIcon"><Icons.SwitchRole /></span>
              <span className="menuItemLabel">Switch Role</span>
            </button>

            <button className={`menuItem mobileSignOut`} onClick={handleSignOutClick}>
              <span className="menuItemIcon"><Icons.SignOut /></span>
              <span className="menuItemLabel">Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Desktop Footer */}
        <div className="sidebarFooter">
          <button onClick={handleSignOutClick} className="signOutBtn">
            <Icons.SignOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
