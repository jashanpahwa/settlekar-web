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
      <div className="space-y-8">
        <div className="relative bg-primary rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden text-white">
          <div className="flex-1 flex flex-col gap-3 relative z-10 text-left">
            <span className="bg-primary-accent text-white border border-primary-accent/80 font-head text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit">Tenant Portal</span>
            <h2 className="font-head text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">Find Your Next Home on SettleKar</h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">
              Search verified listings, connect directly with property owners, and settle down — completely free from middlemen.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] shadow-md border-0 w-fit cursor-pointer no-underline"
            >
              <SearchIcon />
              Browse Listings
            </a>
          </div>
          <div className="hidden md:flex justify-center items-center shrink-0 w-44 h-44 bg-white/5 rounded-full border border-white/10 text-white/20 relative">
            <HomeIcon />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end mb-4">
            <div className="text-left">
              <h2 className="font-head text-xl font-bold text-text-primary tracking-tight">Mobile App</h2>
              <p className="text-xs text-text-secondary">Get instant notifications on the go</p>
            </div>
          </div>
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-left w-full">
              <div className="shrink-0 p-3 bg-surface border border-border rounded-2xl text-text-primary"><PhoneIcon /></div>
              <div>
                <h3 className="font-head text-base font-bold text-text-primary">Download SettleKar</h3>
                <p className="text-text-secondary text-sm leading-relaxed mt-1">
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
    <div className="space-y-8">
      {/* Bento Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="p-2.5 rounded-xl bg-primary-accent/10 text-primary-accent border border-primary-accent/18">
              <BuildingIcon />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 font-head bg-primary-accent/10 text-primary-accent border border-primary-accent/18">Active</span>
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-mono text-3xl font-bold text-text-primary tracking-tight">{properties.length}</h3>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider font-head mt-1">Listed Properties</p>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/18">
              <InquiryIcon />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 font-head bg-success/10 text-success border border-success/18">Incoming</span>
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-mono text-3xl font-bold text-text-primary tracking-tight">{inquiries.length}</h3>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider font-head mt-1">Active Inquiries</p>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="p-2.5 rounded-xl bg-warning/10 text-warning border border-warning/18">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 font-head bg-warning/10 text-warning border border-warning/18">Live</span>
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-mono text-3xl font-bold text-text-primary tracking-tight">{properties.filter(p => p.available !== false).length}</h3>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider font-head mt-1">Available Now</p>
          </div>
        </div>
      </div>

      {/* Hero CTA Banner */}
      <div className="relative bg-primary rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden text-white">
        <div className="flex-1 flex flex-col gap-3 relative z-10 text-left">
          <span className="bg-primary-accent text-white border border-primary-accent/80 font-head text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit">
            {userRole === 'owner' ? 'Owner Portal' : userRole === 'broker' ? 'Broker Portal' : 'Firm Portal'}
          </span>
          <h2 className="font-head text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">{roleHeadline}</h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">{roleDescription}</p>
          <button className="inline-flex items-center gap-2 px-5 py-3 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] shadow-md border-0 w-fit cursor-pointer" onClick={() => setActiveTab('list')}>
            <PlusIcon />
            List a New Property
          </button>
        </div>
        <div className="hidden md:flex justify-center items-center shrink-0 w-44 h-44 bg-white/5 rounded-full border border-white/10 text-white/20 relative">
          <div className="absolute inset-4 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
            <HomeIcon />
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="space-y-4 text-left">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-head text-xl font-bold text-text-primary tracking-tight">Recent Inquiries</h2>
            <p className="text-xs text-text-secondary">Latest tenant messages about your listings</p>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-accent hover:text-primary-accent/90 bg-transparent border-0 cursor-pointer" onClick={() => setActiveTab('inquiries')}>
            View all
            <ArrowRightIcon />
          </button>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-surface-elevated border border-border rounded-2xl p-8 text-center text-text-secondary flex flex-col items-center justify-center gap-3">
            <div className="text-3xl p-3 bg-surface border border-border rounded-2xl mb-1"><InquiryIcon /></div>
            <p className="text-sm text-text-secondary max-w-sm">No inquiries yet. Once tenants contact you about listed properties, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.slice(0, 2).map((inq: InquiryItem) => (
              <div key={inq.id} className="flex items-start gap-4 bg-surface-elevated border border-border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-primary-accent/10 text-primary-accent border border-primary-accent/18 flex items-center justify-center font-bold text-sm rounded-full">
                    {inq.tenantName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex flex-col text-left">
                      <h3 className="text-sm font-semibold text-text-primary">{inq.tenantName}</h3>
                      <span className="text-xs text-text-tertiary font-medium">
                        {inq.propertyTitle}{' '}
                        <strong className="text-text-primary font-mono font-bold bg-surface border border-border-light px-1 py-0.5 rounded ml-1">{inq.propertyPrice}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-text-tertiary font-mono">{formatDate(inq.createdAt)}</span>
                  </div>
                  <p className="text-text-secondary text-sm italic leading-relaxed mb-4 border-l-2 border-border pl-3 bg-surface py-1.5 pr-2 rounded-r">&ldquo;{inq.message}&rdquo;</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${inq.tenantEmail}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-primary-accent/10 border-primary-accent/18 text-primary-accent hover:bg-primary-accent hover:text-white hover:border-primary-accent no-underline">
                      <MailIcon />
                      Email
                    </a>
                    <a href={`tel:${inq.tenantPhone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-success/10 border border-success/18 hover:border-success text-success hover:bg-success hover:text-white no-underline">
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
