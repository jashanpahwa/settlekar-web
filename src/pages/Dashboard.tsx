import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
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
import NotificationsTab from '../components/Dashboard/NotificationsTab';
import LoginView from '../components/Dashboard/LoginView';
import RegistrationGate, { OwnerProfile, BrokerProfile, FirmProfile } from '../components/Dashboard/RegistrationGate';
import Sidebar from '../components/Dashboard/Sidebar';
import Header from '../components/Dashboard/Header';
import { trackMetaEvent } from '../utils/metaPixel';
import { verificationService, PhoneVerificationStatus } from '../services/verificationService';


export type { OwnerProfile, BrokerProfile, FirmProfile };

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist' | 'notifications'>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data States
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [privateNotifications, setPrivateNotifications] = useState<any[]>([]);
  const [globalNotifications, setGlobalNotifications] = useState<any[]>([]);
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>([]);
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);

  // Role and Registration States
  const [userRole, setUserRole] = useState<'broker' | 'owner' | 'firm' | 'tenant' | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<OwnerProfile | BrokerProfile | FirmProfile | null>(null);

  // Verification States
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState<PhoneVerificationStatus | null>(null);


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

            // Load phone verification status (per-user, regardless of role)
            const pvStatus = await verificationService.getPhoneVerificationStatus(firebaseUser.uid);
            setPhoneVerificationStatus(pvStatus);
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
  const fetchLandlordData = async () => {
    if (!user) return;
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
        isTopFloor: prop.isTopFloor,
        // Verification fields
        availabilityExpiresAt: prop.availabilityExpiresAt?.toDate
          ? prop.availabilityExpiresAt.toDate().toISOString()
          : prop.availabilityExpiresAt || undefined,
        videoVerificationStatus: prop.videoVerificationStatus || 'none',
        ownerName: prop.ownerName || '',
        ownerContact: prop.ownerContact || '',
        sentExpiryWarnings: prop.sentExpiryWarnings || [],
        createdBy: prop.createdBy || '',
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

  useEffect(() => {
    fetchLandlordData();
  }, [user, activeTab]);

  // Auto-expire stale property availabilities on dashboard load
  useEffect(() => {
    if (!user || properties.length === 0) return;
    const propertyIds = properties.map((p) => p.id as string).filter(Boolean);
    propertyService.checkAndExpireAvailabilities(propertyIds).then((expiredIds) => {
      if (expiredIds.length > 0) {
        // Update local state to reflect hidden properties
        setProperties((prev) =>
          prev.map((p) =>
            expiredIds.includes(p.id as string)
              ? { ...p, available: false }
              : p
          )
        );
        // Send dashboard notification for each expired listing
        expiredIds.forEach(async (propId) => {
          const prop = properties.find((p) => p.id === propId);
          if (prop && user) {
            await verificationService.scheduleVerificationReminder(user.uid, 'availability_expiring', {
              propertyTitle: prop.title,
              daysLeft: 0,
            });
          }
        });
      }
    }).catch(() => { /* non-critical */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, properties.length]);


  // 2.5. Real-time listener for private user notifications (subcollection)
  useEffect(() => {
    if (!user) {
      setPrivateNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          body: data.body || '',
          read: !!data.read,
          isGlobal: false,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
        };
      });
      setPrivateNotifications(loaded);
    }, (err) => {
      console.error("Error listening to private notifications:", err);
    });

    return () => unsubscribe();
  }, [user]);

  // 2.6. Real-time listener for global announcements
  useEffect(() => {
    if (!user) {
      setGlobalNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'global_notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          body: data.body || '',
          targetRole: data.targetRole || 'all',
          isGlobal: true,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
        };
      });
      setGlobalNotifications(loaded);
    }, (err) => {
      console.error("Error listening to global notifications:", err);
    });

    return () => unsubscribe();
  }, [user]);

  // 2.7. Real-time listener for user's dismissed notifications list
  useEffect(() => {
    if (!user) {
      setDismissedNotifIds([]);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDismissedNotifIds(data.dismissedNotifications || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 2.8. Compute the unified, filtered, and sorted notifications feed
  const notifications = React.useMemo(() => {
    const roleMatchedGlobal = globalNotifications.filter((notif) => 
      notif.targetRole === 'all' || notif.targetRole === userRole
    );

    const merged = [
      ...privateNotifications,
      ...roleMatchedGlobal
    ];

    // Filter out dismissed notifications
    const active = merged.filter((notif) => !dismissedNotifIds.includes(notif.id));

    // Sort by date desc
    active.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return active;
  }, [privateNotifications, globalNotifications, dismissedNotifIds, userRole]);

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
    trackMetaEvent("CompleteRegistration",{
      role: role
    });
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

  // Re-enable property availability
  const handleEnableAvailability = async (propId: string) => {
    try {
      await propertyService.enableAvailability(propId);
      // Reset 7-day timer in local state too (Date-Only)
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 7);
      expiresAt.setHours(0, 0, 0, 0);
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propId
            ? { ...p, available: true, availabilityExpiresAt: expiresAt.toISOString(), sentExpiryWarnings: [] }
            : p
        )
      );
    } catch (err) {
      console.error('Error re-enabling availability:', err);
      alert('Failed to re-enable property. Please try again.');
    }
  };

  // Toggle property availability
  const handleToggleAvailability = async (propId: string, available: boolean) => {
    try {
      await propertyService.setAvailability(propId, available);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 7);
      expiresAt.setHours(0, 0, 0, 0);
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propId
            ? { 
                ...p, 
                available, 
                availabilityExpiresAt: available ? expiresAt.toISOString() : p.availabilityExpiresAt,
                sentExpiryWarnings: available ? [] : p.sentExpiryWarnings
              }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  // Refresh phone verification status
  const handlePhoneVerified = async () => {
    if (!user) return;
    const pvStatus = await verificationService.getPhoneVerificationStatus(user.uid);
    setPhoneVerificationStatus(pvStatus);
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

  // Dismiss notification from Firestore
  const handleDeleteNotification = async (notifId: string) => {
    if (!window.confirm('Are you sure you want to dismiss this notification?')) {
      return;
    }

    const targetNotif = notifications.find((n) => n.id === notifId);
    const isGlobal = targetNotif ? !!targetNotif.isGlobal : false;

    try {
      if (isGlobal) {
        const userDocRef = doc(db, 'users', user!.uid);
        await updateDoc(userDocRef, {
          dismissedNotifications: arrayUnion(notifId)
        });
      } else {
        await deleteDoc(doc(db, 'users', user!.uid, 'notifications', notifId));
      }
    } catch (err) {
      console.error('Error dismissing notification:', err);
      alert('Failed to dismiss notification. Please check connection and try again.');
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
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-5 font-body">
        {/* React 19 Document Metadata */}
        <title>SettleKar - Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className="w-10 h-10 border-2 border-border rounded-full border-t-primary-accent animate-spin"></div>
        <p className="text-sm text-text-secondary font-semibold">Connecting to SettleKar...</p>
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
    <div className="font-body grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-screen bg-background text-text-primary">
      {/* React 19 Document Metadata */}
      <title>SettleKar - Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />

      {/* Mobile Sticky Header Bar */}
      <div className="flex md:hidden items-center justify-between px-5 py-4 bg-surface-elevated border-b border-border sticky top-0 z-30 shadow-sm">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo.png" alt="SettleKar" className="h-8 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="px-2.5 py-1 bg-primary-accent/10 border border-primary-accent/18 text-primary-accent font-head text-[10px] font-bold uppercase tracking-wider rounded-full">
            {userRole === 'broker'
              ? 'Broker'
              : userRole === 'firm'
              ? 'Firm'
              : userRole === 'tenant'
              ? 'Tenant'
              : 'Owner'}
          </span>
          <button 
            className="flex flex-col justify-center items-center gap-1.5 w-8 h-8 rounded border border-border bg-surface cursor-pointer relative z-40 transition-colors hover:bg-border-light"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isMobileSidebarOpen}
          >
            <span className={`w-5 h-[2px] bg-primary rounded transition-all duration-200 ${isMobileSidebarOpen ? 'transform translate-y-[8px] rotate-45' : ''}`}></span>
            <span className={`w-5 h-[2px] bg-primary rounded transition-all duration-200 ${isMobileSidebarOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-[2px] bg-primary rounded transition-all duration-200 ${isMobileSidebarOpen ? 'transform -translate-y-[8px] -rotate-45' : ''}`}></span>
          </button>
        </div>
      </div>
      
      <Sidebar
        userRole={userRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        propertiesCount={properties.length}
        inquiriesCount={inquiries.length}
        notificationsCount={notifications.length}
        handleSignOut={handleSignOut}
        onSwitchRole={handleSwitchRole}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="py-9 px-6 md:p-10 overflow-y-auto h-screen">
        <Header
          user={user}
          userRole={userRole}
          userProfile={userProfile}
        />

        {/* Dynamic Tab Body */}
        <div className="max-w-[1060px] mx-auto">
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
              isPhoneVerified={phoneVerificationStatus?.isVerified ?? false}
              verifiedPhone={
                phoneVerificationStatus?.phone ||
                (userProfile as any)?.phone ||
                (userProfile as any)?.contactPhone ||
                (userProfile as any)?.usernumber ||
                user.phoneNumber ||
                ''
              }
              onPhoneVerified={handlePhoneVerified}
            />
          )}

          {activeTab === 'properties' && (
            <PropertiesTab
              properties={properties}
              triggerEditProperty={triggerEditProperty}
              handleDeleteProperty={handleDeleteProperty}
              setActiveTab={setActiveTab}
              handleEnableAvailability={handleEnableAvailability}
              userPhone={
                (userProfile as any)?.phone ||
                (userProfile as any)?.contactPhone ||
                user.phoneNumber ||
                ''
              }
              userId={user.uid}
              isPhoneVerified={phoneVerificationStatus?.isVerified ?? false}
              phoneVerificationDue={phoneVerificationStatus?.phoneVerificationDue?.toISOString()}
              onPhoneVerified={handlePhoneVerified}
              onVideoSubmitted={fetchLandlordData}
              handleToggleAvailability={handleToggleAvailability}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              handleDeleteInquiry={handleDeleteInquiry}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              handleDeleteNotification={handleDeleteNotification}
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
