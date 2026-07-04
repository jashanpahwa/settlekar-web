import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import styles from '../../styles/Dashboard.module.css';
import logoImage from '/logo.png';
import { ownerBrokerService } from '../../services/ownerBrokerService';
import { userCollectionService } from '../../services/userCollectionService';

// Interfaces for typing registration payload
export interface OwnerProfile {
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  govtIdType: string | null;
  govtIdNumber: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface BrokerProfile {
  userId: string;
  fullName: string;
  phone: string;
  reraNumber: string;
  city: string;
  agencyName: string | null;
  experience: number | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirmProfile {
  userId: string;
  firmName: string;
  reraNumber: string;
  contactPersonName: string;
  contactPhone: string;
  officeAddress: string;
  city: string;
  gstNumber: string | null;
  totalAgents: number | null;
  website: string | null;
  createdAt?: any;
  updatedAt?: any;
}

interface RegistrationGateProps {
  user: User;
  onRegisterSuccess: (role: 'owner' | 'broker' | 'firm' | 'tenant', profile: any) => void;
  handleSignOut: () => Promise<void>;
}

const RegistrationGate: React.FC<RegistrationGateProps> = ({
  user,
  onRegisterSuccess,
  handleSignOut,
}) => {
  const [selectedRegRole, setSelectedRegRole] = useState<'owner' | 'broker' | 'firm' | 'tenant' | null>(null);
  const [registering, setRegistering] = useState(false);
  const [regStep, setRegStep] = useState<'select' | 'form'>('select');

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [agencyName, setAgencyName] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [firmName, setFirmName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [govtIdType, setGovtIdType] = useState('Aadhaar');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [totalAgents, setTotalAgents] = useState('');

  const handleRegisterRole = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !selectedRegRole) return;

    if (selectedRegRole === 'tenant') {
      setRegistering(true);
      try {
        await userCollectionService.createOrUpdateUser({
          userId: user.uid,
          username: user.displayName || 'Verified User',
          userEmail: user.email || '',
          role: 'tenant',
          provider: 'google'
        });
        onRegisterSuccess('tenant', null);
      } catch (err) {
        console.error("Error registering tenant:", err);
        alert("Failed to register tenant. Please check connection and try again.");
      } finally {
        setRegistering(false);
      }
      return;
    }

    // Business profile registration validation
    if (!fullName.trim()) return alert("Full Name is required.");
    if (!phone.trim()) return alert("Phone Number is required.");
    if (phone.trim().length < 10) return alert("Please enter a valid 10-digit phone number.");
    if (!city.trim()) return alert("City is required.");

    // if (selectedRegRole === 'broker') {
    //   if (!reraNumber.trim()) return alert("RERA Registration Number is required.");
    // }

    if (selectedRegRole === 'firm') {
      if (!firmName.trim()) return alert("Company / Firm Name is required.");
      if (!reraNumber.trim()) return alert("RERA Registration Number is required.");
      if (!officeAddress.trim()) return alert("Office Address is required.");
    }

    setRegistering(true);
    try {
      let profileData: any = null;

      // 1. Create entry in corresponding Firebase collection
      if (selectedRegRole === 'owner') {
        profileData = {
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          govtIdType: govtIdNumber.trim() ? govtIdType : null,
          govtIdNumber: govtIdNumber.trim() || null
        };
        await ownerBrokerService.createOwnerProfile(user.uid, profileData);
        profileData.userId = user.uid;
      } else if (selectedRegRole === 'broker') {
        profileData = {
          fullName: fullName.trim(),
          phone: phone.trim(),
          reraNumber: reraNumber.trim().toUpperCase(),
          city: city.trim(),
          agencyName: agencyName.trim() || null,
          experience: experience.trim() ? parseInt(experience.trim(), 10) : null
        };
        await ownerBrokerService.createBrokerProfile(user.uid, profileData);
        profileData.userId = user.uid;
      } else if (selectedRegRole === 'firm') {
        profileData = {
          firmName: firmName.trim(),
          reraNumber: reraNumber.trim().toUpperCase(),
          contactPersonName: fullName.trim(),
          contactPhone: phone.trim(),
          officeAddress: officeAddress.trim(),
          city: city.trim(),
          gstNumber: gstNumber.trim().toUpperCase() || null,
          totalAgents: totalAgents.trim() ? parseInt(totalAgents.trim(), 10) : null,
          website: website.trim() || null
        };
        await ownerBrokerService.createFirmProfile(user.uid, profileData);
        profileData.userId = user.uid;
      }

      // 2. Set role & username in users collection to lock the profile
      await userCollectionService.createOrUpdateUser({
        userId: user.uid,
        username: selectedRegRole === 'firm' ? firmName.trim() : fullName.trim(),
        userEmail: user.email || '',
        role: selectedRegRole,
        provider: 'google'
      });

      onRegisterSuccess(selectedRegRole, profileData);
    } catch (err) {
      console.error("Error registering role:", err);
      alert("Failed to register. Please check your network and try again.");
    } finally {
      setRegistering(false);
    }
  };

  if (regStep === 'select') {
    return (
      <div className={styles.signInContainer}>
        <title>SettleKar - Setup Profile</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className={styles.signInCard} style={{ maxWidth: '600px' }}>
          <div className={styles.signInHeader}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.signInLogo} width={500} height={125} />
            </Link>
            <span className={styles.signInBadge}>Account setup</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Select your account type</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginBottom: '24px' }}>
            Before listing a property or managing inquiries, please specify if you are an Owner, Broker, Firm, or Tenant.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {/* Owner Option */}
            <div 
              onClick={() => setSelectedRegRole('owner')}
              className={`${styles.roleOptionCard} ${selectedRegRole === 'owner' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>🏠</div>
              <div className={styles.roleOptionDetails}>
                <h4>Property Owner</h4>
                <p>I own the apartment or house and want to list it directly with no brokerage.</p>
              </div>
            </div>

            {/* Broker Option */}
            <div 
              onClick={() => setSelectedRegRole('broker')}
              className={`${styles.roleOptionCard} ${selectedRegRole === 'broker' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>🏢</div>
              <div className={styles.roleOptionDetails}>
                <h4>Real Estate Broker</h4>
                <p>I am a broker listing properties on behalf of landlords and want to specify brokerage fees.</p>
              </div>
            </div>

            {/* Firm Option */}
            <div 
              onClick={() => setSelectedRegRole('firm')}
              className={`${styles.roleOptionCard} ${selectedRegRole === 'firm' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>🏢🏢</div>
              <div className={styles.roleOptionDetails}>
                <h4>Real Estate Firm / Developer</h4>
                <p>We are a building firm, builder, developer, or commercial property management company.</p>
              </div>
            </div>

            {/* Tenant Option */}
            <div 
              onClick={() => setSelectedRegRole('tenant')}
              className={`${styles.roleOptionCard} ${selectedRegRole === 'tenant' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>👤</div>
              <div className={styles.roleOptionDetails}>
                <h4>Tenant / House Hunter</h4>
                <p>I want to browse verified properties and find roommates or apartments to rent.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              if (!selectedRegRole) return;
              if (selectedRegRole === 'tenant') {
                handleRegisterRole();
              } else {
                setFullName(user.displayName || '');
                setPhone('');
                setRegStep('form');
              }
            }}
            className={styles.googleSignInBtn} 
            disabled={!selectedRegRole || registering}
            style={{ background: '#2563eb', color: '#ffffff', fontWeight: 700 }}
          >
            {selectedRegRole === 'tenant' ? (registering ? 'Setting up Profile...' : 'Confirm Tenant Selection') : 'Continue to Registration'}
          </button>

          <button 
            onClick={handleSignOut} 
            className={styles.backHomeLink}
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', marginTop: '10px' }}
          >
            ← Sign Out
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.signInContainer}>
        <title>SettleKar - Complete Profile Registration</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className={styles.signInCard} style={{ maxWidth: '600px', width: '100%' }}>
          <div className={styles.signInHeader}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.signInLogo} width={500} height={125} />
            </Link>
            <span className={styles.signInBadge}>Complete Registration</span>
          </div>

          <button 
            onClick={() => setRegStep('select')} 
            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', marginBottom: '16px', padding: 0 }}
          >
            ← Back to role selection
          </button>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            {selectedRegRole === 'owner' ? 'Owner Profile Registration' : selectedRegRole === 'broker' ? 'Broker Profile Registration' : 'Firm Profile Registration'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
            Please fill out the form below to register your business profile on SettleKar.
          </p>

          <form onSubmit={handleRegisterRole} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Common Fields */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">
                  {selectedRegRole === 'firm' ? 'Contact Person Name' : 'Full Name'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="city">City of Operation <span style={{ color: '#ef4444' }}>*</span></label>
                <select 
                  id="city" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  required
                >
                  
                  <option value="Mumbai">Jaipur</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            {/* Owner-specific Fields */}
            {selectedRegRole === 'owner' && (
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ color: '#ffffff', margin: '0', fontSize: '0.95rem', fontWeight: 600 }}>Government ID (Optional — builds trust)</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="govtIdType">ID Type</label>
                    <select
                      id="govtIdType"
                      value={govtIdType}
                      onChange={(e) => setGovtIdType(e.target.value)}
                    >
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="PAN">PAN</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Driving Licence">Driving Licence</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="govtIdNumber">ID Number</label>
                    <input
                      type="text"
                      id="govtIdNumber"
                      value={govtIdNumber}
                      onChange={(e) => setGovtIdNumber(e.target.value)}
                      placeholder={`Enter ${govtIdType} number`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Broker-specific Fields */}
            {selectedRegRole === 'broker' && (
              <>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="agencyName">Agency / Firm Name (Optional)</label>
                    <input
                      type="text"
                      id="agencyName"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Skyline Realtors"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="experience">Years of Experience (Optional)</label>
                    <input
                      type="number"
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="reraNumber">RERA Registration Number </label>
                  <span style={{ fontSize: '0.775rem', color: '#6366F1', marginTop: '-4px', marginBottom: '4px' }}>🛡️ RERA number is required for individual brokers</span>
                  <input
                    type="text"
                    id="reraNumber"
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    placeholder="e.g. A51800012345"
                    
                  />
                </div>
              </>
            )}

            {/* Firm-specific Fields */}
            {selectedRegRole === 'firm' && (
              <>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firmName">Company / Firm Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      id="firmName"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      placeholder="e.g. DLF Limited"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="reraNumberFirm">Firm RERA Number <span style={{ color: '#ef4444' }}>*</span></label>
                    <span style={{ fontSize: '0.775rem', color: '#F59E0B', marginTop: '-4px', marginBottom: '4px' }}>🛡️ RERA registration is mandatory for all real estate firms</span>
                    <input
                      type="text"
                      id="reraNumberFirm"
                      value={reraNumber}
                      onChange={(e) => setReraNumber(e.target.value)}
                      placeholder="e.g. P52100054321"
                      required
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="gstNumber">GSTIN (Optional)</label>
                    <input
                      type="text"
                      id="gstNumber"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="totalAgents">Total Agents / Employees (Optional)</label>
                    <input
                      type="number"
                      id="totalAgents"
                      value={totalAgents}
                      onChange={(e) => setTotalAgents(e.target.value)}
                      placeholder="e.g. 15"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="website">Website URL (Optional)</label>
                  <input
                    type="url"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://company.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="officeAddress">Office Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea
                    id="officeAddress"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    placeholder="Enter full office/corporate address"
                    rows={2}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className={styles.googleSignInBtn} 
              disabled={registering}
              style={{ background: '#2563eb', color: '#ffffff', fontWeight: 700, marginTop: '12px' }}
            >
              {registering ? 'Creating Profile...' : 'Complete Profile Registration'}
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default RegistrationGate;
