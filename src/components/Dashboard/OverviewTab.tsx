import React from 'react';
import { PropertyItem, InquiryItem } from './types';

interface OverviewTabProps {
  userRole: 'broker' | 'owner' | 'firm' | 'tenant';
  properties: PropertyItem[];
  inquiries: InquiryItem[];
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries') => void;
  formatDate: (date: string) => string;
}

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const InquiryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SearchIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneCallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.82 19.79 19.79 0 01.09 4.3 2 2 0 012 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const OverviewTab: React.FC<OverviewTabProps> = ({
  userRole,
  properties,
  inquiries,
  setActiveTab,
  formatDate,
}) => {
  if (userRole === 'tenant') {
    return (
      <div className="tabContent">
        <div className="overviewHero tenantHero">
          <div className="overviewHeroText">
            <span className="heroBadge">Tenant Portal</span>
            <h2>Find Your Next Home on SettleKar</h2>
            <p>
              Search verified listings, connect directly with property owners, and settle down — completely free from middlemen.
            </p>
            <a
              href="/"
              className="listPromoBtn heroCta"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <SearchIcon />
              Browse Listings
            </a>
          </div>
          <div className="overviewHeroGraphic heroGraphicTenant">
            <HomeIcon />
          </div>
        </div>

        <div className="recentActivity">
          <div className="sectionHeader">
            <div>
              <h2>Mobile App</h2>
              <p>Get instant notifications on the go</p>
            </div>
          </div>
          <div className="emptyCard appCard tenantAppCard">
            <div className="tenantAppCardInner">
              <div className="tenantAppIcon"><PhoneIcon /></div>
              <div>
                <h3 className="tenantAppTitle">Download SettleKar</h3>
                <p className="tenantAppDesc">
                  Get instant notifications, chat in real-time, and complete rental agreements directly on the SettleKar mobile app — available on Android and iOS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleHeadline =
    userRole === 'owner'
      ? 'List your properties directly. Skip the broker entirely.'
      : userRole === 'broker'
      ? 'Manage client properties and showcase brokerage fees transparently.'
      : 'Market your developments and co-living projects directly to renters.';

  const roleDescription =
    userRole === 'owner'
      ? 'Connect directly with verified tenants on SettleKar. Post apartments or rooms, receive direct inquiries, and finalize agreements hassle-free.'
      : userRole === 'broker'
      ? 'Post rental homes on behalf of landlords, specify brokerage terms transparently, and track incoming inquiries in real-time.'
      : 'Manage and market housing societies or corporate co-living setups directly to verified professionals.';

  return (
    <div className="tabContent">
      {/* Bento Stat Cards */}
      <div className="gridStats">
        <div className="statCard statCardPrimary">
          <div className="statCardHeader">
            <div className="statIcon statIconBlue">
              <BuildingIcon />
            </div>
            <span className="statTrend statTrendBlue">Active</span>
          </div>
          <div className="statData">
            <h3>{properties.length}</h3>
            <p>Listed Properties</p>
          </div>
        </div>

        <div className="statCard statCardSecondary">
          <div className="statCardHeader">
            <div className="statIcon statIconGreen">
              <InquiryIcon />
            </div>
            <span className="statTrend statTrendGreen">Incoming</span>
          </div>
          <div className="statData">
            <h3>{inquiries.length}</h3>
            <p>Active Inquiries</p>
          </div>
        </div>

        <div className="statCard statCardTertiary">
          <div className="statCardHeader">
            <div className="statIcon statIconAmber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="statTrend statTrendAmber">Live</span>
          </div>
          <div className="statData">
            <h3>{properties.filter(p => p.available !== false).length}</h3>
            <p>Available Now</p>
          </div>
        </div>
      </div>

      {/* Hero CTA Banner */}
      <div className="overviewHero">
        <div className="overviewHeroText">
          <span className="heroBadge">
            {userRole === 'owner' ? 'Owner Portal' : userRole === 'broker' ? 'Broker Portal' : 'Firm Portal'}
          </span>
          <h2>{roleHeadline}</h2>
          <p>{roleDescription}</p>
          <button className="listPromoBtn heroCta" onClick={() => setActiveTab('list')}>
            <PlusIcon />
            List a New Property
          </button>
        </div>
        <div className="overviewHeroGraphic">
          <div className="heroGraphicInner">
            <HomeIcon />
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="recentActivity">
        <div className="sectionHeader">
          <div>
            <h2>Recent Inquiries</h2>
            <p>Latest tenant messages about your listings</p>
          </div>
          <button className="viewAllBtn" onClick={() => setActiveTab('inquiries')}>
            View all
            <ArrowRightIcon />
          </button>
        </div>

        {inquiries.length === 0 ? (
          <div className="emptyCard">
            <div className="emptyInquiryIcon"><InquiryIcon /></div>
            <p>No inquiries yet. Once tenants contact you about listed properties, they will appear here.</p>
          </div>
        ) : (
          <div className="inquiriesList">
            {inquiries.slice(0, 2).map((inq: InquiryItem) => (
              <div key={inq.id} className="inquiryCard">
                <div className="inquiryCardLeft">
                  <div className="inquirerAvatar">
                    {inq.tenantName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="inquiryCardBody">
                  <div className="inquiryHeader">
                    <div className="inquirerInfo">
                      <h3>{inq.tenantName}</h3>
                      <span>
                        {inq.propertyTitle}{' '}
                        <strong className="inquiryPrice">{inq.propertyPrice}</strong>
                      </span>
                    </div>
                    <span className="timeBadge">{formatDate(inq.createdAt)}</span>
                  </div>
                  <p className="inquiryMsg">&ldquo;{inq.message}&rdquo;</p>
                  <div className="inquiryActions">
                    <a href={`mailto:${inq.tenantEmail}`} className="contactBtn contactBtnEmail">
                      <MailIcon />
                      Email
                    </a>
                    <a href={`tel:${inq.tenantPhone}`} className="contactBtn contactBtnPhone">
                      <PhoneCallIcon />
                      Call
                    </a>
                  </div>
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
