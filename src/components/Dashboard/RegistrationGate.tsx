import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body">
        <title>SettleKar - Setup Profile</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className="bg-surface-elevated border border-border rounded-2xl p-10 w-full max-w-[600px] shadow-lg">
          <div className="flex flex-col gap-3 mb-6">
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className="h-[34px] w-auto object-contain" width={500} height={125} />
            </Link>
            <span className="bg-primary-accent/10 border border-primary-accent/18 text-primary-accent font-head text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full w-fit">Account setup</span>
          </div>

          <h2 className="font-head text-2xl font-bold text-text-primary mb-2 tracking-tight">Select your account type</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6 text-left">
            Before listing a property or managing inquiries, please specify if you are an Owner, Broker, Firm, or Tenant.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {/* Owner Option */}
            <div 
              onClick={() => setSelectedRegRole('owner')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border text-left ${selectedRegRole === 'owner' ? 'border-primary-accent bg-primary-accent/10 text-text-primary shadow-sm' : 'bg-surface border-border text-text-primary hover:bg-border-light'}`}
            >
              <div className="text-2xl shrink-0">🏠</div>
              <div>
                <h4 className="text-text-primary font-head text-base font-bold mb-0.5">Property Owner</h4>
                <p className="text-text-secondary text-xs leading-normal">I own the apartment or house and want to list it directly with no brokerage.</p>
              </div>
            </div>

            {/* Broker Option */}
            <div 
              onClick={() => setSelectedRegRole('broker')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border text-left ${selectedRegRole === 'broker' ? 'border-primary-accent bg-primary-accent/10 text-text-primary shadow-sm' : 'bg-surface border-border text-text-primary hover:bg-border-light'}`}
            >
              <div className="text-2xl shrink-0">🏢</div>
              <div>
                <h4 className="text-text-primary font-head text-base font-bold mb-0.5">Real Estate Broker</h4>
                <p className="text-text-secondary text-xs leading-normal">I am a broker listing properties on behalf of landlords and want to specify brokerage fees.</p>
              </div>
            </div>

            {/* Firm Option */}
            <div 
              onClick={() => setSelectedRegRole('firm')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border text-left ${selectedRegRole === 'firm' ? 'border-primary-accent bg-primary-accent/10 text-text-primary shadow-sm' : 'bg-surface border-border text-text-primary hover:bg-border-light'}`}
            >
              <div className="text-2xl shrink-0">🏢🏢</div>
              <div>
                <h4 className="text-text-primary font-head text-base font-bold mb-0.5">Real Estate Firm / Developer</h4>
                <p className="text-text-secondary text-xs leading-normal">We are a building firm, builder, developer, or commercial property management company.</p>
              </div>
            </div>

            {/* Tenant Option */}
            <div 
              onClick={() => setSelectedRegRole('tenant')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border text-left ${selectedRegRole === 'tenant' ? 'border-primary-accent bg-primary-accent/10 text-text-primary shadow-sm' : 'bg-surface border-border text-text-primary hover:bg-border-light'}`}
            >
              <div className="text-2xl shrink-0">👤</div>
              <div>
                <h4 className="text-text-primary font-head text-base font-bold mb-0.5">Tenant / House Hunter</h4>
                <p className="text-text-secondary text-xs leading-normal">I want to browse verified properties and find roommates or apartments to rent.</p>
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
            className="w-full bg-primary-accent hover:bg-primary-accent/90 text-white border-0 text-sm font-bold font-head py-3.5 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-2.5 transition-colors disabled:opacity-55 disabled:cursor-not-allowed mb-4 shadow-sm" 
            disabled={!selectedRegRole || registering}
          >
            {selectedRegRole === 'tenant' ? (registering ? 'Setting up Profile...' : 'Confirm Tenant Selection') : 'Continue to Registration'}
          </button>

          <button 
            onClick={handleSignOut} 
            className="block text-center text-text-secondary hover:text-text-primary text-[0.85rem] no-underline transition-colors bg-none border-none cursor-pointer w-full mt-2.5"
          >
            ← Sign Out
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body">
        <title>SettleKar - Complete Profile Registration</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className="bg-surface-elevated border border-border rounded-2xl p-10 w-full max-w-[600px] shadow-lg text-left">
          <div className="flex flex-col gap-3 mb-6">
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className="h-[34px] w-auto object-contain" width={500} height={125} />
            </Link>
            <span className="bg-primary-accent/10 border border-primary-accent/18 text-primary-accent font-head text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full w-fit">Complete Registration</span>
          </div>

          <button 
            onClick={() => setRegStep('select')} 
            className="bg-transparent border-none text-primary cursor-pointer flex items-center gap-1.5 text-sm mb-4 p-0 hover:underline"
          >
            ← Back to role selection
          </button>

          <h2 className="font-head text-2xl font-bold text-text-primary mb-2 tracking-tight">
            {selectedRegRole === 'owner' ? 'Owner Profile Registration' : selectedRegRole === 'broker' ? 'Broker Profile Registration' : 'Firm Profile Registration'}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Please fill out the form below to register your SettleKar dashboard profile.
          </p>

          <form onSubmit={handleRegisterRole} className="flex flex-col gap-5">
            {/* Common Fields */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="fullName" className="text-xs font-semibold text-text-primary">
                  {selectedRegRole === 'firm' ? 'Contact Person Name' : 'Full Name'} <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="phone" className="text-xs font-semibold text-text-primary">Phone Number <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="email" className="text-xs font-semibold text-text-primary">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm outline-none cursor-not-allowed opacity-60"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="city" className="text-xs font-semibold text-text-primary">City of Operation <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <select 
                  id="city" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
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
              <div className="bg-surface p-5 rounded-2xl border border-border flex flex-col gap-4">
                <h4 className="text-text-primary text-sm font-semibold">Government ID (Optional — builds trust)</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="govtIdType" className="text-xs font-semibold text-text-primary">ID Type</label>
                    <select
                      id="govtIdType"
                      value={govtIdType}
                      onChange={(e) => setGovtIdType(e.target.value)}
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                    >
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="PAN">PAN</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Driving Licence">Driving Licence</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="govtIdNumber" className="text-xs font-semibold text-text-primary">ID Number</label>
                    <input
                      type="text"
                      id="govtIdNumber"
                      value={govtIdNumber}
                      onChange={(e) => setGovtIdNumber(e.target.value)}
                      placeholder={`Enter ${govtIdType} number`}
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Broker-specific Fields */}
            {selectedRegRole === 'broker' && (
              <>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="agencyName" className="text-xs font-semibold text-text-primary">Agency / Firm Name (Optional)</label>
                    <input
                      type="text"
                      id="agencyName"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Skyline Realtors"
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="experience" className="text-xs font-semibold text-text-primary">Years of Experience (Optional)</label>
                    <input
                      type="number"
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reraNumber" className="text-xs font-semibold text-text-primary">RERA Registration Number </label>
                  <span className="text-[11px] text-primary-accent -mt-1 mb-1 font-medium">🛡️ RERA number is required for individual brokers</span>
                  <input
                    type="text"
                    id="reraNumber"
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    placeholder="e.g. A51800012345"
                    className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                  />
                </div>
              </>
            )}

            {/* Firm-specific Fields */}
            {selectedRegRole === 'firm' && (
              <>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="firmName" className="text-xs font-semibold text-text-primary">Company / Firm Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <input
                      type="text"
                      id="firmName"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      placeholder="e.g. DLF Limited"
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="reraNumberFirm" className="text-xs font-semibold text-text-primary">Firm RERA Number <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <span className="text-[11px] text-warning -mt-1 mb-1 font-medium">🛡️ RERA registration is mandatory for all real estate firms</span>
                    <input
                      type="text"
                      id="reraNumberFirm"
                      value={reraNumber}
                      onChange={(e) => setReraNumber(e.target.value)}
                      placeholder="e.g. P52100054321"
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="gstNumber" className="text-xs font-semibold text-text-primary">GSTIN (Optional)</label>
                    <input
                      type="text"
                      id="gstNumber"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="totalAgents" className="text-xs font-semibold text-text-primary">Total Agents / Employees (Optional)</label>
                    <input
                      type="number"
                      id="totalAgents"
                      value={totalAgents}
                      onChange={(e) => setTotalAgents(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="website" className="text-xs font-semibold text-text-primary">Website URL (Optional)</label>
                  <input
                    type="url"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://company.com"
                    className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="officeAddress" className="text-xs font-semibold text-text-primary">Office Address <span style={{ color: 'var(--color-error)' }}>*</span></label>
                  <textarea
                    id="officeAddress"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    placeholder="Enter full office/corporate address"
                    rows={2}
                    className="w-full bg-surface border border-border hover:border-border-light focus:border-primary-accent rounded-lg p-2.5 text-sm outline-none transition-colors resize-y"
                    required
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="w-full bg-primary-accent hover:bg-primary-accent/90 text-white border-0 text-sm font-bold font-head py-3.5 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-2.5 transition-colors disabled:opacity-55 disabled:cursor-not-allowed mt-3 shadow-sm" 
              disabled={registering}
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
