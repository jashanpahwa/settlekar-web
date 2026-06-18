import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import styles from './Dashboard.module.css';
import logoImage from '/logo.png';

// Import refactored modules
import { PropertyItem, InquiryItem } from './components/Dashboard/types';
import OverviewTab from './components/Dashboard/OverviewTab';
import PropertiesTab from './components/Dashboard/PropertiesTab';
import InquiriesTab from './components/Dashboard/InquiriesTab';
import ListPropertyTab from './components/Dashboard/ListPropertyTab';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'properties' | 'inquiries'>('overview');
  
  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data States
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);

  // 1. Listen to Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Owner Properties & Inquiries from Firestore
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
            outdoorImages: data.outdoorImages || []
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
  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        {/* React 19 Document Metadata */}
        <title>SettleKar - Owner Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className={styles.spinner}></div>
        <p>Connecting to SettleKar...</p>
      </div>
    );
  }

  // Google Authentication Gate
  if (!user) {
    return (
      <div className={styles.signInContainer}>
        {/* React 19 Document Metadata */}
        <title>SettleKar - Owner Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
        <div className={styles.signInCard}>
          <div className={styles.signInHeader}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.signInLogo} />
            </Link>
            <span className={styles.signInBadge}>Owner Portal</span>
          </div>
          
          <h2>Manage Your Listings Hassle-Free</h2>
          <p>
            Sign in with your Google account to list apartments, review incoming inquiries from tenants in real-time, and settle deals directly without middle-men.
          </p>

          <div className={styles.bullets}>
            <div className={styles.bulletItem}>
              <span className={styles.bulletIcon}>⚡</span>
              <div>
                <h4>Direct Connections</h4>
                <p>Chat directly with verified tenants—no brokers, zero brokerage fees.</p>
              </div>
            </div>
            <div className={styles.bulletItem}>
              <span className={styles.bulletIcon}>🌐</span>
              <div>
                <h4>Multi-Platform Sync</h4>
                <p>Your listed properties and inquiries sync directly to SettleKar mobile apps instantly.</p>
              </div>
            </div>
          </div>

          {authError && <div className={styles.authError}>{authError}</div>}

          <button onClick={handleSignIn} className={styles.googleSignInBtn} disabled={authSubmitting}>
            {authSubmitting ? (
              <span className={styles.submittingSpan}>Signing in...</span>
            ) : (
              <>
                <span className={styles.googleIcon}>G</span> Sign In with Google
              </>
            )}
          </button>
          
          <Link to="/" className={styles.backHomeLink}>
            ← Back to SettleKar Home
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated Portal View
  return (
    <div className={styles.dashboardLayout}>
      {/* React 19 Document Metadata */}
      <title>SettleKar - Owner Dashboard</title>
      <meta name="robots" content="noindex, nofollow" />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logoLink}>
            <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
          </Link>
          <span className={styles.portalBadge}>Owner Portal</span>
        </div>
        
        <nav className={styles.menu}>
          <button
            className={`${styles.menuItem} ${activeTab === 'overview' ? styles.activeMenu : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.icon}>📊</span> Overview
          </button>
          <button
            className={`${styles.menuItem} ${activeTab === 'list' ? styles.activeMenu : ''}`}
            onClick={() => {
              setEditingProperty(null);
              setActiveTab('list');
            }}
          >
            <span className={styles.icon}>➕</span> List Property
          </button>
          <button
            className={`${styles.menuItem} ${activeTab === 'properties' ? styles.activeMenu : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <span className={styles.icon}>🏠</span> My Properties
            {properties.length > 0 && <span className={styles.badgeCount}>{properties.length}</span>}
          </button>
          <button
            className={`${styles.menuItem} ${activeTab === 'inquiries' ? styles.activeMenu : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <span className={styles.icon}>✉️</span> Inquiries
            {inquiries.length > 0 && <span className={styles.badgeCountBlue}>{inquiries.length}</span>}
          </button>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleSignOut} className={styles.backHomeBtn}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top bar header */}
        <header className={styles.topHeader}>
          <div className={styles.headerInfo}>
            <h1>Welcome Back, {user.displayName ? user.displayName.split(' ')[0] : 'Landlord'}!</h1>
            <p>Manage your properties, handle direct inquiries, and see coverage growth.</p>
          </div>
          <div className={styles.ownerProfile}>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Profile'} className={styles.profileAvatarImg} />
            ) : (
              <div className={styles.profileAvatar}>
                {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'SK'}
              </div>
            )}
            <div className={styles.profileDetails}>
              <h4>{user.displayName || 'SettleKar Owner'}</h4>
              <span>Google Verified</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className={styles.container}>
          {activeTab === 'overview' && (
            <OverviewTab
              properties={properties}
              inquiries={inquiries}
              setActiveTab={setActiveTab}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'list' && (
            <ListPropertyTab
              user={user}
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
