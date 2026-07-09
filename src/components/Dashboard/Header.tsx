import React from 'react';
import { User } from 'firebase/auth';
import { OwnerProfile, BrokerProfile, FirmProfile } from './RegistrationGate';
interface HeaderProps {
  user: User;
  userRole: 'owner' | 'broker' | 'firm' | 'tenant';
  userProfile: OwnerProfile | BrokerProfile | FirmProfile | null;
}

const Header: React.FC<HeaderProps> = ({ user, userRole, userProfile }) => {
  const getHeaderDisplayName = () => {
    if (!user) return 'User';
    if (userRole === 'firm' && userProfile && 'firmName' in userProfile) {
      return (userProfile as FirmProfile).firmName;
    }
    if (userProfile && 'fullName' in userProfile) {
      return (userProfile as OwnerProfile | BrokerProfile).fullName;
    }
    return user.displayName || 'SettleKar User';
  };

  const getHeaderRoleName = () => {
    switch (userRole) {
      case 'broker': return 'Real Estate Broker';
      case 'firm': return 'Real Estate Firm / Developer';
      case 'tenant': return 'Tenant';
      case 'owner': return 'Property Owner';
      default: return 'User';
    }
  };

  const getHeaderSubtitleName = () => {
    if (userRole === 'broker' && userProfile && 'agencyName' in userProfile) {
      return `Agency: ${(userProfile as BrokerProfile).agencyName || 'Independent'}`;
    }
    if (userRole === 'firm' && userProfile && 'reraNumber' in userProfile) {
      return `RERA: ${(userProfile as FirmProfile).reraNumber}`;
    }
    if (userRole === 'owner' && userProfile && 'city' in userProfile) {
      return `Location: ${(userProfile as OwnerProfile).city}`;
    }
    return 'Google Verified';
  };

  const displayName = getHeaderDisplayName();

  return (
    <header className="topHeader">
      <div className="headerInfo">
        <h1>Welcome Back, {displayName.split(' ')[0]}!</h1>
        <p>Logged in as {getHeaderRoleName()}.</p>
      </div>
      <div className="ownerProfile">
        {user.photoURL ? (
          <img src={user.photoURL} alt={displayName} className="profileAvatarImg" width={40} height={40} />
        ) : (
          <div className="profileAvatar">
            {displayName.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="profileDetails">
          <h4>{displayName}</h4>
          <span>{getHeaderSubtitleName()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
