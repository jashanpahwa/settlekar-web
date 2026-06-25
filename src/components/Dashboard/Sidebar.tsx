import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../Dashboard.module.css';
import logoImage from '/logo.png';

interface SidebarProps {
  userRole: 'owner' | 'broker' | 'firm' | 'tenant';
  activeTab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist' | 'switchRole';
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist' | 'switchRole') => void;
  propertiesCount: number;
  inquiriesCount: number;
  handleSignOut: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
  propertiesCount,
  inquiriesCount,
  handleSignOut,
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Link to="/" className={styles.logoLink}>
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
      </div>

      <nav className={styles.menu}>
        <button
          className={`${styles.menuItem} ${activeTab === 'overview' ? styles.activeMenu : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className={styles.icon}>📊</span> Overview
        </button>

        {userRole !== 'tenant' && (
          <>
            <button
              className={`${styles.menuItem} ${activeTab === 'list' ? styles.activeMenu : ''}`}
              onClick={() => setActiveTab('list')}
            >
              <span className={styles.icon}>➕</span> List Property
            </button>
            <button
              className={`${styles.menuItem} ${activeTab === 'properties' ? styles.activeMenu : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <span className={styles.icon}>🏠</span> My Properties
              {propertiesCount > 0 && <span className={styles.badgeCount}>{propertiesCount}</span>}
            </button>
            <button
              className={`${styles.menuItem} ${activeTab === 'inquiries' ? styles.activeMenu : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              <span className={styles.icon}>✉️</span> Inquiries
              {inquiriesCount > 0 && <span className={styles.badgeCountBlue}>{inquiriesCount}</span>}
            </button>
          </>
        )}

        <button
          className={`${styles.menuItem} ${activeTab === 'wishlist' ? styles.activeMenu : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <span className={styles.icon}>❤️</span> Wishlist
        </button>

        <button
          className={`${styles.menuItem} ${activeTab === 'switchRole' ? styles.activeMenu : ''}`}
          onClick={() => setActiveTab('switchRole')}
        >
          <span className={styles.icon}>🔄</span> Switch Role
        </button>
      </nav>

      <div className={styles.sidebarFooter}>
        <button onClick={handleSignOut} className={styles.backHomeBtn}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
