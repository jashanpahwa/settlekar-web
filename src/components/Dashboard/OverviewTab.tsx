import React from 'react';
import { PropertyItem, InquiryItem } from './types';
import styles from '../../Dashboard.module.css';

interface OverviewTabProps {
  userRole: 'broker' | 'owner' | 'tenant';
  properties: PropertyItem[];
  inquiries: InquiryItem[];
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries') => void;
  formatDate: (date: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  userRole,
  properties,
  inquiries,
  setActiveTab,
  formatDate,
}) => {
  if (userRole === 'tenant') {
    return (
      <div className={styles.tabContent}>
        {/* Welcome Section for Tenant */}
        <div className={styles.overviewHero}>
          <div className={styles.overviewHeroText}>
            <h2>Find Your Next Home on SettleKar</h2>
            <p>
              You are registered as a Tenant. Search for verified listings, connect directly with property owners, and settle down without middle-men.
            </p>
            <a href="/" className={styles.listPromoBtn} style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
              🔍 Browse Listings on Home Page
            </a>
          </div>
          <div className={styles.overviewHeroGraphic}>🏠</div>
        </div>

        <div className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <h2>Mobile App Access</h2>
          </div>
          <div className={styles.emptyCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem' }}>📱</div>
            <h3 style={{ color: '#ffffff', fontWeight: 600 }}>Download SettleKar Mobile App</h3>
            <p style={{ maxWidth: '500px', margin: '0 auto', color: '#94a3b8' }}>
              Get instant notifications, chat in real-time, and complete your rental agreements directly using the SettleKar mobile app available on Android and iOS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.gridStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#EEF2FF', color: '#4F46E5' }}>🏢</div>
          <div className={styles.statData}>
            <h3>{properties.length}</h3>
            <p>Listed Properties</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>✉️</div>
          <div className={styles.statData}>
            <h3>{inquiries.length}</h3>
            <p>Active Inquiries</p>
          </div>
        </div>

      </div>

      {/* Welcome Section */}
      <div className={styles.overviewHero}>
        <div className={styles.overviewHeroText}>
          <h2>List your properties directly. Skip the broker completely.</h2>
          <p>
            With SettleKar, you connect directly with verified tenants. Post your BHK apartments or studio rooms, receive direct inquiries, and finalize agreements completely hassle-free.
          </p>
          <button className={styles.listPromoBtn} onClick={() => setActiveTab('list')}>
            ➕ List a New Property
          </button>
        </div>
        <div className={styles.overviewHeroGraphic}>🛋️</div>
      </div>

      {/* Recent Inquiries Quick Preview */}
      <div className={styles.recentActivity}>
        <div className={styles.sectionHeader}>
          <h2>Recent Inquiries</h2>
          <button className={styles.viewAllBtn} onClick={() => setActiveTab('inquiries')}>
            View All Inquiries →
          </button>
        </div>
        
        {inquiries.length === 0 ? (
          <div className={styles.emptyCard}>
            <p>No active inquiries received yet. Once tenants request your listed properties, they will appear here!</p>
          </div>
        ) : (
          <div className={styles.inquiriesList}>
            {inquiries.slice(0, 2).map((inq: InquiryItem) => (
              <div key={inq.id} className={styles.inquiryCard}>
                <div className={styles.inquiryHeader}>
                  <div className={styles.inquirerInfo}>
                    <h3>{inq.tenantName}</h3>
                    <span>Applied for: <strong>{inq.propertyTitle}</strong> ({inq.propertyPrice})</span>
                  </div>
                  <span className={styles.timeBadge}>{formatDate(inq.createdAt)}</span>
                </div>
                <p className={styles.inquiryMsg}>"{inq.message}"</p>
                <div className={styles.inquiryActions}>
                  <a href={`mailto:${inq.tenantEmail}`} className={styles.contactBtn}>
                    ✉️ Email ({inq.tenantEmail})
                  </a>
                  <a href={`tel:${inq.tenantPhone}`} className={styles.contactBtn}>
                    📞 Call ({inq.tenantPhone})
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
