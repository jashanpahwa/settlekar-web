import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, deleteDoc, getDocs, getDoc, query, where } from 'firebase/firestore';
import styles from './Dashboard.module.css';

// Import refactored modules
import { PropertyItem, InquiryItem } from './components/Dashboard/types';
import OverviewTab from './components/Dashboard/OverviewTab';
import PropertiesTab from './components/Dashboard/PropertiesTab';
import InquiriesTab from './components/Dashboard/InquiriesTab';
import ListPropertyTab from './components/Dashboard/ListPropertyTab';
import SwitchRoleTab from './components/Dashboard/SwitchRoleTab';
import WishlistTab from './components/Dashboard/WishlistTab';
import LoginView from './components/Dashboard/LoginView';
import RegistrationGate, { OwnerProfile, BrokerProfile, FirmProfile } from './components/Dashboard/RegistrationGate';
import Sidebar from './components/Dashboard/Sidebar';
import Header from './components/Dashboard/Header';

export type { OwnerProfile, BrokerProfile, FirmProfile };

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'properties' | 'inquiries' | 'wishlist' | 'switchRole'>('overview');
  
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
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const role = userDocSnap.data().role || null;
            setUserRole(role);

            // Fetch detailed profile based on role
            if (role && role !== 'tenant') {
              let profileCollection = '';
              if (role === 'owner') profileCollection = 'owners';
              else if (role === 'broker') profileCollection = 'brokers';
              else if (role === 'firm') profileCollection = 'firms';

              if (profileCollection) {
                const profileDocRef = doc(db, profileCollection, firebaseUser.uid);
                const profileDocSnap = await getDoc(profileDocRef);
                if (profileDocSnap.exists()) {
                  setUserProfile(profileDocSnap.data() as OwnerProfile | BrokerProfile | FirmProfile);
                }
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
        const propQuery = query(
          collection(db, 'properties'),
          where('createdBy', '==', user.uid)
        );
        const propSnapshot = await getDocs(propQuery);
        const loadedProps: PropertyItem[] = [];
        propSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedProps.push({
            id: docSnap.id,
            title: data.title || '',
            city: data.city || 'Mumbai',
            location: data.location || '',
            address: data.address || '',
            price: typeof data.price === 'number' ? `₹${data.price.toLocaleString('en-IN')}` : data.price || '',
            rating: data.rating || '5.0',
            badge: data.badge || data.propertyType || '1 BHK',
            features: data.features || `${data.propertyType} • ${data.area || 0} sq.ft • ${data.furnishing || 'Semi-Furnished'}`,
            image: data.image || (data.images && data.images.length > 0 ? data.images[0] : '') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
            isUserAdded: true,
            indoorImages: data.indoorImages || [],
            outdoorImages: data.outdoorImages || [],
            securityFees: data.securityFees,
            advanceRentMonths: data.advanceRentMonths,
            brokerage: data.brokerage,
            totalAdvance: data.totalAdvance,
            listedByRole: data.listedByRole,
            description: data.description || '',
            overallscore: data.overallscore !== undefined ? data.overallscore : data.overallScore,
            pillars: data.pillars || data.neighborhoodPillars || null,
            meta: data.meta || null,
            confidence: data.confidence !== undefined ? data.confidence : data.neighborhoodConfidence || null
          });
        });
        setProperties(loadedProps);

        const inqQuery = query(
          collection(db, 'inquiries'),
          where('ownerId', '==', user.uid)
        );
        const inqSnapshot = await getDocs(inqQuery);
        const loadedInqs: InquiryItem[] = [];
        inqSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedInqs.push({
            id: docSnap.id,
            propertyId: data.propertyId || '',
            propertyTitle: data.propertyTitle || '',
            propertyPrice: data.propertyPrice || '',
            tenantName: data.tenantName || data.inquirerName || 'Anonymous',
            tenantEmail: data.tenantEmail || data.inquirerEmail || '',
            tenantPhone: data.tenantPhone || data.inquirerPhone || '',
            message: data.message || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
          });
        });
        
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
      await signInWithPopup(auth, googleProvider);
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
      await signOut(auth);
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

  const handleSwitchRoleTo = (_newRole: 'owner' | 'broker' | 'firm' | 'tenant') => {
    setUserRole(null);
    setUserProfile(null);
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
      // Find related inquiries
      const inqQuery = query(
        collection(db, 'inquiries'),
        where('propertyId', '==', id)
      );
      const inqSnapshot = await getDocs(inqQuery);

      // Delete property document and all related inquiries
      const deletePromises: Promise<void>[] = [];
      deletePromises.push(deleteDoc(doc(db, 'properties', id as string)));

      inqSnapshot.forEach((docSnap) => {
        deletePromises.push(deleteDoc(doc(db, 'inquiries', docSnap.id)));
      });

      await Promise.all(deletePromises);

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
      await deleteDoc(doc(db, 'inquiries', inqId));
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
      <div className={styles.loadingScreen}>
        {/* React 19 Document Metadata */}
        <title>SettleKar - Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className={styles.spinner}></div>
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
    <div className={styles.dashboardLayout}>
      {/* React 19 Document Metadata */}
      <title>SettleKar - Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />
      
      <Sidebar
        userRole={userRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        propertiesCount={properties.length}
        inquiriesCount={inquiries.length}
        handleSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <Header
          user={user}
          userRole={userRole}
          userProfile={userProfile}
        />

        {/* Dynamic Tab Body */}
        <div className={styles.container}>
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

          {activeTab === 'switchRole' && (
            <SwitchRoleTab 
              currentRole={userRole} 
              onSwitchRole={handleSwitchRoleTo} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
