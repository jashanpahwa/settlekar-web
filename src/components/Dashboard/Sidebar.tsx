import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css';
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
        className={`${styles.sidebarOverlay} ${isOpen ? styles.overlayVisible : ''}`} 
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logoLink} onClick={onClose}>
            <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
          </Link>
          <span className={styles.portalBadge}>
            {userRole === 'broker'
              ? 'Broker Portal'
              : userRole === 'firm'
              ? 'Firm Portal'
              : userRole === 'tenant'
              ? 'Tenant Portal'
              : 'Owner Portal'}
          </span>
          {/* Close button inside drawer for mobile */}
          <button className={styles.drawerCloseBtn} onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className={styles.menu}>
          <button
            className={`${styles.menuItem} ${activeTab === 'overview' ? styles.activeMenu : ''}`}
            onClick={() => handleTabClick('overview')}
          >
            <span className={styles.icon}>📊</span> Overview
          </button>

          {userRole !== 'tenant' && (
            <>
              <button
                className={`${styles.menuItem} ${activeTab === 'list' ? styles.activeMenu : ''}`}
                onClick={() => handleTabClick('list')}
              >
                <span className={styles.icon}>➕</span> List Property
              </button>
              <button
                className={`${styles.menuItem} ${activeTab === 'properties' ? styles.activeMenu : ''}`}
                onClick={() => handleTabClick('properties')}
              >
                <span className={styles.icon}>🏠</span> My Properties
                {propertiesCount > 0 && <span className={styles.badgeCount}>{propertiesCount}</span>}
              </button>
              <button
                className={`${styles.menuItem} ${activeTab === 'inquiries' ? styles.activeMenu : ''}`}
                onClick={() => handleTabClick('inquiries')}
              >
                <span className={styles.icon}>✉️</span> Inquiries
                {inquiriesCount > 0 && <span className={styles.badgeCountBlue}>{inquiriesCount}</span>}
              </button>
            </>
          )}

          <button
            className={`${styles.menuItem} ${activeTab === 'wishlist' ? styles.activeMenu : ''}`}
            onClick={() => handleTabClick('wishlist')}
          >
            <span className={styles.icon}>❤️</span> Wishlist
          </button>

          <button
            className={styles.menuItem}
            onClick={handleSwitchClick}
          >
            <span className={styles.icon}>🔄</span> Switch Role
          </button>

          <button
            className={`${styles.menuItem} ${styles.mobileSignOut}`}
            onClick={handleSignOutClick}
          >
            <span className={styles.icon}>🚪</span> Sign Out
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleSignOutClick} className={styles.backHomeBtn}>
            🚪 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
