import React from 'react';
import { User } from 'firebase/auth';
import { OwnerProfile, BrokerProfile, FirmProfile } from './RegistrationGate';

interface HeaderProps {
  user: User;
  userRole: 'owner' | 'broker' | 'firm' | 'tenant';
  userProfile: OwnerProfile | BrokerProfile | FirmProfile | null;
}

const ROLE_DISPLAY: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  broker: { label: 'Real Estate Broker', color: 'var(--color-primary)', bg: 'rgba(139, 92, 246, 0.12)', dot: 'var(--color-primary)' },
  firm:   { label: 'Real Estate Firm',   color: 'var(--color-primary)', bg: 'rgba(245, 158, 11, 0.12)',  dot: 'var(--color-primary)' },
  tenant: { label: 'Tenant',             color: 'var(--color-primary)', bg: 'rgba(16, 185, 129, 0.12)',  dot: 'var(--color-primary)' },
  owner:  { label: 'Property Owner',     color: 'var(--color-primary)', bg: 'rgba(37, 99, 235, 0.12)',  dot: 'var(--color-primary)' },
};

const Header: React.FC<HeaderProps> = ({ user, userRole, userProfile }) => {
  const getDisplayName = (): string => {
    if (!user) return 'User';
    if (userRole === 'firm' && userProfile && 'firmName' in userProfile) {
      return (userProfile as FirmProfile).firmName;
    }
    if (userProfile && 'fullName' in userProfile) {
      return (userProfile as OwnerProfile | BrokerProfile).fullName;
    }
    return user.displayName || 'SettleKar User';
  };

  const getSubtitle = (): string => {
    if (userRole === 'broker' && userProfile && 'agencyName' in userProfile) {
      return (userProfile as BrokerProfile).agencyName || 'Independent Agency';
    }
    if (userRole === 'firm' && userProfile && 'reraNumber' in userProfile) {
      return `RERA: ${(userProfile as FirmProfile).reraNumber}`;
    }
    if (userRole === 'owner' && userProfile && 'city' in userProfile) {
      return (userProfile as OwnerProfile).city || 'Google Verified';
    }
    return 'Google Verified';
  };

  const displayName = getDisplayName();
  const roleInfo = ROLE_DISPLAY[userRole] ?? ROLE_DISPLAY.owner;
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="flex justify-between items-end pb-7 border-b border-border mb-9">
      <div className="flex flex-col gap-1.5 text-left">
        <p className="text-[0.8rem] font-head uppercase tracking-wider text-text-secondary font-semibold">{greeting},</p>
        <h1 className="font-head text-3xl font-bold text-text-primary tracking-tight leading-none">{displayName.split(' ')[0]}</h1>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-head w-fit mt-0.5" style={{ background: roleInfo.bg }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: roleInfo.dot }} />
          <span style={{ color: roleInfo.color }}>{roleInfo.label}</span>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center gap-3 bg-surface-elevated py-2.5 px-4 rounded-xl border border-border shadow-sm">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-11 h-11 rounded-full object-cover border-2 border-border shrink-0"
              width={44}
              height={44}
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-surface text-text-secondary flex items-center justify-center font-bold text-sm shrink-0 border-2 border-border" aria-label={displayName}>
              {initials}
            </div>
          )}
          <div className="flex flex-col text-left">
            <h4 className="text-text-primary text-sm font-semibold mb-0.5 leading-none">{displayName}</h4>
            <span className="text-text-secondary text-xs font-medium">{getSubtitle()}</span>
          </div>
          <div className="shrink-0" title="Google Verified">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success">
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
