import React from 'react';
import { User } from 'firebase/auth';
import { OwnerProfile, BrokerProfile, FirmProfile } from './RegistrationGate';

interface HeaderProps {
  user: User;
  userRole: 'owner' | 'broker' | 'firm' | 'tenant';
  userProfile: OwnerProfile | BrokerProfile | FirmProfile | null;
}

const ROLE_DISPLAY: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  broker: { label: 'Real Estate Broker', color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', dot: '#8b5cf6' },
  firm:   { label: 'Real Estate Firm',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  dot: '#f97316' },
  tenant: { label: 'Tenant',             color: '#34d399', bg: 'rgba(52,211,153,0.12)',  dot: '#10b981' },
  owner:  { label: 'Property Owner',     color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  dot: '#0ea5e9' },
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

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="topHeader">
      <div className="headerInfo">
        <p className="headerGreeting">{greeting},</p>
        <h1 className="headerTitle">{displayName.split(' ')[0]}</h1>
        <div className="headerRolePill" style={{ background: roleInfo.bg }}>
          <span className="headerRoleDot" style={{ background: roleInfo.dot }} />
          <span style={{ color: roleInfo.color }}>{roleInfo.label}</span>
        </div>
      </div>

      <div className="ownerProfile">
        <div className="profileCard">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="profileAvatarImg"
              width={44}
              height={44}
            />
          ) : (
            <div className="profileAvatar" aria-label={displayName}>
              {initials}
            </div>
          )}
          <div className="profileDetails">
            <h4 className="profileName">{displayName}</h4>
            <span className="profileSub">{getSubtitle()}</span>
          </div>
          <div className="profileVerifiedBadge" title="Google Verified">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#10b981"
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
