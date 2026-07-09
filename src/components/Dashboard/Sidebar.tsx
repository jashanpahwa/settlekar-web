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
      {/* Backdrop overlay for mobile drawer */}
      <div 
        className={`sidebarOverlay ${isOpen ? 'overlayVisible' : ''}`} 
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'sidebarOpen' : ''}`}>
        <div className="sidebarHeader">
          <Link to="/" className="logoLink" onClick={onClose}>
            <img src={logoImage} alt="SettleKar" className="logoImage" />
          </Link>
          <span className="portalBadge">
            {userRole === 'broker'
              ? 'Broker Portal'
              : userRole === 'firm'
              ? 'Firm Portal'
              : userRole === 'tenant'
              ? 'Tenant Portal'
              : 'Owner Portal'}
          </span>
          {/* Close button inside drawer for mobile */}
          <button className="drawerCloseBtn" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="menu">
          <button
            className={`menuItem ${activeTab === 'overview' ? 'activeMenu' : ''}`}
            onClick={() => handleTabClick('overview')}
          >
            <span className="icon">📊</span> Overview
          </button>

          {userRole !== 'tenant' && (
            <>
              <button
                className={`menuItem ${activeTab === 'list' ? 'activeMenu' : ''}`}
                onClick={() => handleTabClick('list')}
              >
                <span className="icon">➕</span> List Property
              </button>
              <button
                className={`menuItem ${activeTab === 'properties' ? 'activeMenu' : ''}`}
                onClick={() => handleTabClick('properties')}
              >
                <span className="icon">🏠</span> My Properties
                {propertiesCount > 0 && <span className="badgeCount">{propertiesCount}</span>}
              </button>
              <button
                className={`menuItem ${activeTab === 'inquiries' ? 'activeMenu' : ''}`}
                onClick={() => handleTabClick('inquiries')}
              >
                <span className="icon">✉️</span> Inquiries
                {inquiriesCount > 0 && <span className="badgeCountBlue">{inquiriesCount}</span>}
              </button>
            </>
          )}

          <button
            className={`menuItem ${activeTab === 'wishlist' ? 'activeMenu' : ''}`}
            onClick={() => handleTabClick('wishlist')}
          >
            <span className="icon">❤️</span> Wishlist
          </button>

          <button
            className="menuItem"
            onClick={handleSwitchClick}
          >
            <span className="icon">🔄</span> Switch Role
          </button>

          <button
            className={`menuItem mobileSignOut`}
            onClick={handleSignOutClick}
          >
            <span className="icon">🚪</span> Sign Out
          </button>
        </nav>

        <div className="sidebarFooter">
          <button onClick={handleSignOutClick} className="backHomeBtn">
            🚪 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
