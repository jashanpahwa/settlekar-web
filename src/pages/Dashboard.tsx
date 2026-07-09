import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { userService } from '../services/userService';
import { userCollectionService } from '../services/userCollectionService';
import { ownerBrokerService } from '../services/ownerBrokerService';
import { propertyService } from '../services/propertyService';
import { inquiryService } from '../services/inquiryService';
// Import refactored modules
import { PropertyItem, InquiryItem } from '../components/Dashboard/types';
import OverviewTab from '../components/Dashboard/OverviewTab';
import PropertiesTab from '../components/Dashboard/PropertiesTab';
import InquiriesTab from '../components/Dashboard/InquiriesTab';
import ListPropertyTab from '../components/Dashboard/ListPropertyTab';
import WishlistTab from '../components/Dashboard/WishlistTab';
import LoginView from '../components/Dashboard/LoginView';
import RegistrationGate, { OwnerProfile, BrokerProfile, FirmProfile } from '../components/Dashboard/RegistrationGate';
import Sidebar from '../components/Dashboard/Sidebar';
import Header from '../components/Dashboard/Header';

export type { OwnerProfile, BrokerProfile, FirmProfile };

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist'>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data States
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);

  // Role and Registration States
  const [userRole, setUserRole] = useState<'broker' | 'owner' | 'firm' | 'tenant' | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<OwnerProfile | BrokerProfile | FirmProfile | null>(null);

  // 1. Listen to Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setRoleLoading(true);
        try {
          const userDoc = await userCollectionService.getUserById(firebaseUser.uid);
          if (userDoc) {
            const role = userDoc.role || null;
            setUserRole(role);

            // Fetch detailed profile based on role
            if (role && role !== 'tenant') {
              const profile = await ownerBrokerService.getProfileByRole(firebaseUser.uid, role);
              if (profile) {
                setUserProfile(profile as OwnerProfile | BrokerProfile | FirmProfile);
              }
            }
          } else {
            setUserRole(null);
            setUserProfile(null);
          }
        } catch (err) {
          console.error("Error loading user role/profile:", err);
          setUserRole(null);
          setUserProfile(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setUserRole(null);
        setUserProfile(null);
        setRoleLoading(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Owner/Broker/Firm Properties & Inquiries from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchLandlordData = async () => {
      try {
        const userProps = await propertyService.getUserProperties(user.uid);
        const loadedProps: PropertyItem[] = userProps.map((prop) => ({
          id: prop.id,
          title: prop.title || '',
          city: prop.city || 'Mumbai',
          location: prop.location || '',
          address: prop.address || '',
          price: typeof prop.price === 'number' ? `₹${prop.price.toLocaleString('en-IN')}` : prop.price || '',
          rating: prop.rating || '5.0',
          badge: prop.badge || prop.propertyType || '1 BHK',
          features: prop.features || `${prop.propertyType} • ${prop.area || 0} sq.ft • ${prop.furnishing || 'Semi-Furnished'}`,
          image: prop.image || (prop.images && prop.images.length > 0 ? prop.images[0] : '') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
          isUserAdded: true,
          indoorImages: prop.indoorImages || [],
          outdoorImages: prop.outdoorImages || [],
          securityFees: prop.securityFees,
          advanceRentMonths: prop.advanceRentMonths,
          brokerage: prop.brokerage,
          totalAdvance: prop.totalAdvance,
          listedByRole: prop.listedByRole,
          description: prop.description || '',
          overallscore: prop.overallscore !== undefined ? prop.overallscore : prop.overallScore,
          pillars: prop.pillars || prop.neighborhoodPillars || null,
          meta: prop.meta || null,
          confidence: prop.confidence !== undefined ? prop.confidence : prop.neighborhoodConfidence || null,
          available: prop.available,
          isIndependent: prop.isIndependent,
          bachelorFriendly: prop.bachelorFriendly,
          womenOnly: prop.womenOnly,
          isTopFloor: prop.isTopFloor
        }));
        setProperties(loadedProps);

        const ownerInquiries = await inquiryService.getInquiriesByOwner(user.uid);
        const loadedInqs: InquiryItem[] = ownerInquiries.map((inq) => ({
          id: inq.id,
          propertyId: inq.propertyId || '',
          propertyTitle: inq.propertyTitle || '',
          propertyPrice: inq.propertyPrice || '',
          tenantName: inq.tenantName || inq.inquirerName || 'Anonymous',
          tenantEmail: inq.tenantEmail || inq.inquirerEmail || '',
          tenantPhone: inq.tenantPhone || inq.inquirerPhone || '',
          message: inq.message || '',
          createdAt: inq.createdAt instanceof Date ? inq.createdAt.toISOString() : inq.createdAt || new Date().toISOString()
        }));
        
        loadedInqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInquiries(loadedInqs);

      } catch (err) {
        console.error('Error fetching landlord Firestore data:', err);
      }
    };

    fetchLandlordData();
  }, [user, activeTab]);

  // Auth Handlers
  const handleSignIn = async () => {
    setAuthSubmitting(true);
    setAuthError('');
    try {
      await userService.googleSignIn();
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setAuthError('Authentication failed. Please verify browser popup permissions.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) {
      return;
    }
    try {
      await userService.logout();
      setProperties([]);
      setInquiries([]);
      setEditingProperty(null);
      setActiveTab('overview');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleRegisterSuccess = (role: 'owner' | 'broker' | 'firm' | 'tenant', profile: any) => {
    setUserRole(role);
    setUserProfile(profile);
  };

  const handleSwitchRole = () => {
    if (window.confirm('Are you sure you want to switch your role? You will need to setup a profile for the new role.')) {
      setUserRole(null);
      setUserProfile(null);
    }
  };

  // Populate form fields and switch tab to Edit a Property
  const triggerEditProperty = (propId: string | number) => {
    const prop = properties.find((p) => p.id === propId);
    if (!prop) return;
    setEditingProperty(prop);
    setActiveTab('list');
  };

  const handleSaveSuccess = (updatedOrNewProp: PropertyItem, isEdit: boolean) => {
    if (isEdit) {
      setProperties(prev => prev.map((p) => p.id === updatedOrNewProp.id ? updatedOrNewProp : p));
    } else {
      setProperties(prev => [updatedOrNewProp, ...prev]);
    }
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setActiveTab('properties');
  };

  // Delete listed property from Firestore
  const handleDeleteProperty = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to remove this property? This will also remove it from the live home page explorer. All associated inquiries will also be deleted.')) {
      return;
    }

    try {
      await propertyService.deleteProperty(id as string);

      // Update local state
      setProperties(properties.filter((p: PropertyItem) => p.id !== id));
      setInquiries(inquiries.filter((inq: InquiryItem) => inq.propertyId !== id));
    } catch (err) {
      console.error('Error deleting property and its inquiries:', err);
      alert('Failed to delete property. Please check connection and try again.');
    }
  };

  // Dismiss inquiry from Firestore
  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm('Are you sure you want to dismiss this inquiry?')) {
      return;
    }

    try {
      await inquiryService.deleteInquiry(inqId);
      setInquiries(inquiries.filter((i: InquiryItem) => i.id !== inqId));
    } catch (err) {
      console.error('Error dismissing inquiry:', err);
      alert('Failed to dismiss inquiry. Please check connection and try again.');
    }
  };

  // Helper: Format Dates nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  // Loading Splash Screen
  if (loading || roleLoading) {
    return (
      <div className="loadingScreen">
        {/* React 19 Document Metadata */}
        <title>SettleKar - Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className="spinner"></div>
        <p>Connecting to SettleKar...</p>
      </div>
    );
  }

  // Google Authentication Gate
  if (!user) {
    return (
      <LoginView
        handleSignIn={handleSignIn}
        authSubmitting={authSubmitting}
        authError={authError}
      />
    );
  }

  // Role Selection Gate
  if (!userRole) {
    return (
      <RegistrationGate
        user={user}
        onRegisterSuccess={handleRegisterSuccess}
        handleSignOut={handleSignOut}
      />
    );
  }

  // Authenticated Portal View
  return (
    <div className="dashboardLayout">
      {/* React 19 Document Metadata */}
      <title>SettleKar - Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />

      {/* Mobile Sticky Header Bar */}
      <div className="mobileHeaderBar">
        <Link to="/" className="mobileLogoLink">
          <img src="/logo.png" alt="SettleKar" className="mobileLogoImage" />
        </Link>
        <div className="mobileHeaderRight">
          <span className="mobilePortalBadge">
            {userRole === 'broker'
              ? 'Broker'
              : userRole === 'firm'
              ? 'Firm'
              : userRole === 'tenant'
              ? 'Tenant'
              : 'Owner'}
          </span>
          <button 
            className="mobileMenuToggle"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isMobileSidebarOpen}
          >
            <span className={`hamburgerLine ${isMobileSidebarOpen ? 'lineOpen1' : ''}`}></span>
            <span className={`hamburgerLine ${isMobileSidebarOpen ? 'lineOpen2' : ''}`}></span>
            <span className={`hamburgerLine ${isMobileSidebarOpen ? 'lineOpen3' : ''}`}></span>
          </button>
        </div>
      </div>
      
      <Sidebar
        userRole={userRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        propertiesCount={properties.length}
        inquiriesCount={inquiries.length}
        handleSignOut={handleSignOut}
        onSwitchRole={handleSwitchRole}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="mainContent">
        <Header
          user={user}
          userRole={userRole}
          userProfile={userProfile}
        />

        {/* Dynamic Tab Body */}
        <div className="container">
          {activeTab === 'overview' && (
            <OverviewTab
              userRole={userRole}
              properties={properties}
              inquiries={inquiries}
              setActiveTab={setActiveTab}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'list' && (
            <ListPropertyTab
              user={user}
              userRole={userRole}
              editingProperty={editingProperty}
              onSaveSuccess={handleSaveSuccess}
              onCancel={handleCancelEdit}
            />
          )}

          {activeTab === 'properties' && (
            <PropertiesTab
              properties={properties}
              triggerEditProperty={triggerEditProperty}
              handleDeleteProperty={handleDeleteProperty}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              handleDeleteInquiry={handleDeleteInquiry}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'wishlist' && (
            <WishlistTab user={user} />
          )}


        </div>
      </main>
    </div>
  );
};

export default Dashboard;
