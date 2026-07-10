import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { propertyService, PropertyData } from '../services/propertyService';
import { inquiryService } from '../services/inquiryService';
import { ratingService } from '../services/ratingService';
import { wishlistService } from '../services/wishlistService';
import { auth } from '../firebase';
import logoImage from '/logo.png';
import styles from '../styles/PropertyDetailPage.module.css';

// ─── helpers ─────────────────────────────────────────────────────────────────

const getFraudRiskDetails = (rating: number | string | undefined, score: number | null) => {
  const numRating = rating ? parseFloat(String(rating)) : null;
  const numScore = score != null ? Number(score) : null;

  if ((numRating !== null && numRating >= 4.0) || (numScore !== null && numScore >= 75)) {
    return { label: 'Verified & Secure', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' };
  }
  if ((numRating !== null && numRating >= 3.0) || (numScore !== null && numScore >= 50)) {
    return { label: 'Standard Check Required', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' };
  }
  if (numRating !== null || numScore !== null) {
    return { label: 'Caution: High Risk Flag', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' };
  }
  return { label: 'Under Review', color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' };
};

// Returns a human-readable location string, stripping any raw Google Maps URLs
const cleanLocation = (location?: string, address?: string, city?: string): string => {
  const candidates = [location, address, city].filter(Boolean) as string[];
  for (const c of candidates) {
    // Skip anything that looks like a maps URL
    if (!c.startsWith('http') && !c.includes('google.com/maps') && !c.includes('maps.google')) {
      return c;
    }
  }
  // All candidates were URLs — fall back to city or generic
  return city || 'Location not specified';
};

const formatPrice = (price: string | number | undefined): string => {
  if (!price) return 'Contact for Price';
  const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  if (isNaN(num)) return String(price);
  return `₹${num.toLocaleString('en-IN')}`;
};

const scoreColor = (score: number) => {
  if (score >= 80) return { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.25)' };
  if (score >= 60) return { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' };
  return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.25)' };
};

const pillarFillColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

// ─── Smart tag derivation ─────────────────────────────────────────────────────
// Reads property fields and description text to build relevant highlight tags.

type TagVariant = 'tagPurple' | 'tagGreen' | 'tagBlue' | 'tagOrange' | 'tagSlate';

interface SmartTag {
  label: string;
  emoji: string;
  variant: TagVariant;
}

const deriveSmartTags = (prop: PropertyData): SmartTag[] => {
  const tags: SmartTag[] = [];
  const keywords: string[] = Array.isArray(prop.keywords) ? prop.keywords.map(k => String(k).toLowerCase()) : [];
  const type = (prop.propertyType || '').toLowerCase();

  // ── Property type tag ──
  if (type) {
    tags.push({ label: type.toUpperCase(), emoji: '🏠', variant: 'tagPurple' });
  }

  // ── Tenant-type tags ──
  if (keywords.includes('bachelor friendly')) {
    tags.push({ label: 'Bachelor Friendly', emoji: '👨', variant: 'tagBlue' });
  }

  if (keywords.includes('women only') || keywords.includes('girls friendly') || keywords.includes('women')) {
    tags.push({ label: 'Women Only', emoji: '👩', variant: 'tagOrange' });
  }

  if (keywords.includes('family friendly') || keywords.includes('family')) {
    tags.push({ label: 'Family Friendly', emoji: '👨‍👩‍👧', variant: 'tagGreen' });
  }

  if (keywords.includes('student friendly') || keywords.includes('student')) {
    tags.push({ label: 'Student Friendly', emoji: '🎓', variant: 'tagBlue' });
  }

  // ── Brokerage tag ──
  if (keywords.includes('zero brokerage') || keywords.includes('no brokerage') || Number(prop.brokerage) === 0) {
    tags.push({ label: 'Zero Brokerage', emoji: '🎉', variant: 'tagGreen' });
  }

  // ── Furnishing tag ──
  if (keywords.includes('fully furnished')) {
    tags.push({ label: 'Fully Furnished', emoji: '🛋️', variant: 'tagPurple' });
  } else if (keywords.includes('semi-furnished') || keywords.includes('semi furnished')) {
    tags.push({ label: 'Semi-Furnished', emoji: '🪑', variant: 'tagSlate' });
  } else if (keywords.includes('unfurnished')) {
    tags.push({ label: 'Unfurnished', emoji: '📦', variant: 'tagSlate' });
  }

  // ── Independence tag ──
  if (keywords.includes('independent') || keywords.includes('independent house')) {
    tags.push({ label: 'Independent House', emoji: '🏡', variant: 'tagOrange' });
  }

  // ── Location / Top Floor tag ──
  if (keywords.includes('top floor')) {
    tags.push({ label: 'Top Floor', emoji: '🏢', variant: 'tagPurple' });
  }

  // ── Amenity-based tags from keywords ──
  if (keywords.includes('parking') || keywords.includes('car park')) {
    tags.push({ label: 'Parking Available', emoji: '🚗', variant: 'tagSlate' });
  }

  if (keywords.includes('lift') || keywords.includes('elevator')) {
    tags.push({ label: 'Lift', emoji: '🛗', variant: 'tagSlate' });
  }

  if (keywords.includes('wifi') || keywords.includes('wi-fi') || keywords.includes('internet')) {
    tags.push({ label: 'WiFi Included', emoji: '📶', variant: 'tagBlue' });
  }

  if (keywords.includes('ac') || keywords.includes('air conditioned') || keywords.includes('air conditioning')) {
    tags.push({ label: 'Air Conditioned', emoji: '❄️', variant: 'tagBlue' });
  }

  if (keywords.includes('gym') || keywords.includes('fitness')) {
    tags.push({ label: 'Gym', emoji: '💪', variant: 'tagOrange' });
  }

  if (keywords.includes('pet friendly') || keywords.includes('pets allowed')) {
    tags.push({ label: 'Pet Friendly', emoji: '🐾', variant: 'tagGreen' });
  }

  return tags;
};

// ─── types ────────────────────────────────────────────────────────────────────

interface Property extends PropertyData {
  id: string;
}

// ─── Lightbox component ───────────────────────────────────────────────────────

interface LightboxProps {
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, title, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setZoomed(false); setIndex((i) => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setZoomed(false); setIndex((i) => (i + 1) % images.length); };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      { onClose(); }
      if (e.key === 'ArrowLeft')   { setZoomed(false); setIndex((i) => (i - 1 + images.length) % images.length); }
      if (e.key === 'ArrowRight')  { setZoomed(false); setIndex((i) => (i + 1) % images.length); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Sync index when startIndex changes
  useEffect(() => { setIndex(startIndex); }, [startIndex]);

  return (
    <div className={styles.lbOverlay} onClick={onClose}>
      {/* Main viewer */}
      <div className={styles.lbMain} onClick={(e) => e.stopPropagation()}>

        {/* Top bar */}
        <div className={styles.lbTopBar}>
          <span className={styles.lbCounter}>{index + 1} / {images.length}</span>
          <button className={styles.lbClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Image */}
        <div
          className={`${styles.lbImgWrap} ${zoomed ? styles.lbZoomed : ''}`}
          onClick={() => setZoomed((z) => !z)}
          title={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
        >
          <img
            src={images[index]}
            alt={`${title} – photo ${index + 1}`}
            className={styles.lbImg}
            draggable={false}
          />
          {!zoomed && (
            <div className={styles.lbZoomHint}>🔍 Click to zoom</div>
          )}
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button className={`${styles.lbNavBtn} ${styles.lbPrev}`} onClick={prev} aria-label="Previous">‹</button>
            <button className={`${styles.lbNavBtn} ${styles.lbNext}`} onClick={next} aria-label="Next">›</button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className={styles.lbThumbStrip} onClick={(e) => e.stopPropagation()}>
          {images.map((src, i) => (
            <button
              key={i}
              className={`${styles.lbThumb} ${i === index ? styles.lbThumbActive : ''}`}
              onClick={() => { setZoomed(false); setIndex(i); }}
              aria-label={`View photo ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Photo Slider component ───────────────────────────────────────────────────

interface SliderProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
}

const PhotoSlider: React.FC<SliderProps> = ({ images, title, onImageClick }) => {
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent((i) => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent((i) => (i + 1) % images.length); };

  // Keyboard navigation (only when lightbox is NOT open)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  setCurrent((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrent((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length]);

  if (images.length === 0) {
    return <div className={styles.noImage}>🏠</div>;
  }

  if (images.length === 1) {
    return (
      <div className={styles.sliderSection}>
        <div className={styles.singleImgWrap}>
          <img
            src={images[0]}
            alt={title}
            className={`${styles.singleImgContained} ${styles.sliderClickable}`}
            onClick={() => onImageClick(0)}
          />
          <div className={styles.expandHintSingle} onClick={() => onImageClick(0)}>🔍 Tap to expand</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sliderSection}>
      <div className={styles.sliderTrack}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} – photo ${i + 1}`}
            className={`${styles.sliderImg} ${styles.sliderClickable} ${i === current ? styles.active : ''}`}
            onClick={() => onImageClick(i)}
          />
        ))}

        {/* Prev / Next buttons */}
        <button className={`${styles.sliderBtn} ${styles.sliderBtnPrev}`} onClick={prev} aria-label="Previous photo">‹</button>
        <button className={`${styles.sliderBtn} ${styles.sliderBtnNext}`} onClick={next} aria-label="Next photo">›</button>

        {/* Expand hint */}
        <div className={styles.expandHint} onClick={() => onImageClick(current)}>🔍 Tap to expand</div>

        {/* Counter */}
        <div className={styles.sliderCounter}>{current + 1} / {images.length}</div>

        {/* Dot indicators */}
        {images.length <= 12 && (
          <div className={styles.sliderDots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Inquiry form
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [message, setMessage] = useState('Hi, I am interested in this property. Please share more details.');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  // Share
  const [copied, setCopied] = useState(false);

  // Lightbox
  const [lbOpen, setLbOpen]   = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // Rating states
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [ratingAvg, setRatingAvg] = useState<string>('5.0');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  // Listen to auth state to check if property is in wishlist
  useEffect(() => {
    if (!id) return;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await wishlistService.isInWishlist(user.uid, id);
          setInWishlist(res.exists);
        } catch (err) {
          console.error('Error checking wishlist status:', err);
        }
      } else {
        setInWishlist(false);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleToggleWishlist = async () => {
    if (!id) return;
    if (!auth.currentUser) {
      alert('Please sign in to save properties to your wishlist.');
      navigate('/dashboard');
      return;
    }
    setTogglingWishlist(true);
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(auth.currentUser.uid, id);
        setInWishlist(false);
      } else {
        await wishlistService.addToWishlist(auth.currentUser.uid, id);
        setInWishlist(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update wishlist.');
    } finally {
      setTogglingWishlist(false);
    }
  };

  const openLightbox = (i: number) => { setLbIndex(i); setLbOpen(true); };
  const closeLightbox = () => setLbOpen(false);

  // ── Fetch property ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    propertyService
      .getPropertyById(id)
      .then((data) => {
        setProperty(data as Property);
        setRatingCount(Number(data.ratingCount) || 0);
        setRatingAvg(data.rating || '5.0');
      })
      .catch(() => setError('Property not found or an error occurred.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Listen to auth state to fetch user's rating dynamically
  useEffect(() => {
    if (!id) return;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const rating = await ratingService.getUserSubmittedRating(id, user.uid);
        setUserRating(rating);
      } else {
        setUserRating(null);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleRateProperty = async (val: number) => {
    if (!id || submittingRating || userRating !== null) return;
    if (!auth.currentUser) {
      alert('Please sign in to rate this listing.');
      navigate('/dashboard');
      return;
    }
    setSubmittingRating(true);
    try {
      const result = await ratingService.submitRating(id, val);
      setUserRating(val);
      setRatingAvg(result.average.toFixed(1));
      setRatingCount(result.count);
    } catch (err: any) {
      alert(err.message || 'Failed to submit rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  // ── Collect all images ──────────────────────────────────────────────────────
  const allImages = useCallback((): string[] => {
    if (!property) return [];
    const imgs: string[] = [];
    if (property.indoorImages?.length)  imgs.push(...property.indoorImages);
    if (property.outdoorImages?.length) imgs.push(...property.outdoorImages);
    if (!imgs.length && property.image)          imgs.push(property.image);
    if (!imgs.length && property.images?.length) imgs.push(...property.images);
    return imgs.filter(Boolean);
  }, [property]);

  // ── Inquiry submit ──────────────────────────────────────────────────────────
  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !name || !phone) return;
    setSending(true);
    try {
      await inquiryService.sendInquiry({
        propertyId:    property.id,
        propertyTitle: property.title,
        propertyPrice: property.price,
        ownerId:       property.createdBy || '',
        ownerName:     property.ownerName || null,
        inquirerId:    `web_${Date.now()}`,
        inquirerName:  name,
        inquirerPhone: phone,
        message,
      });
      setSent(true);
    } catch {
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // ── Share ───────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: property?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Pillars renderer ────────────────────────────────────────────────────────
  const renderPillars = (pillars: any) => {
    if (!pillars || typeof pillars !== 'object') return null;
    const entries = Object.entries(pillars) as [string, any][];
    if (!entries.length) return null;

    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🛡️ Neighbourhood Score Breakdown</h2>
        <div className={styles.pillarsGrid}>
          {entries.map(([key, val]) => {
            const score    = typeof val === 'object' ? (val?.score ?? val) : val;
            const numScore = Number(score) || 0;
            const col      = pillarFillColor(numScore);
            const textCol  = scoreColor(numScore);
            return (
              <div key={key} className={styles.pillarItem}>
                <div className={styles.pillarHeader}>
                  <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                  <span
                    className={styles.pillarScore}
                    style={{ background: textCol.bg, color: textCol.text }}
                  >
                    {numScore}/100
                  </span>
                </div>
                <div className={styles.pillarBar}>
                  <div
                    className={styles.pillarFill}
                    style={{ width: `${Math.min(numScore, 100)}%`, background: col }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <span>Loading property details…</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.loadingWrap}>
        <span style={{ fontSize: '2.5rem' }}>🏠</span>
        <p style={{ fontWeight: 600, color: '#b1b3b8' }}>{error || 'Property not found.'}</p>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>← Go Back</button>
      </div>
    );
  }

  // ── Derived values ──────────────────────────────────────────────────────────
  const imgs         = allImages();
  const overallScore = property.overallscore ?? property.overallScore ?? null;
  const sc           = overallScore != null ? scoreColor(overallScore) : null;
  const smartTags    = deriveSmartTags(property);
  const riskDetails  = getFraudRiskDetails(ratingAvg, overallScore);

  const featuresList: string[] = Array.isArray(property.features)
    ? property.features
    : typeof property.features === 'string'
    ? property.features.split(',').map((f: string) => f.trim()).filter(Boolean)
    : [];

  const canonicalUrl = `https://settlekar.in/property/${property.id}`;
  const metaTitle    = `${property.title} | SettleKar`;
  const metaDesc     = `${property.propertyType?.toUpperCase() || 'Rental'} in ${property.location || property.city}. ${formatPrice(property.price)}/month. Verified owner listing on SettleKar.`;

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── SEO Metadata ──────────────────────────────────────────────────── */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image"       content={imgs[0] || 'https://settlekar.in/logo.png'} />
      <meta property="og:url"         content={canonicalUrl} />

      {/* ── Slim Top Bar (not floating) ────────────────────────────────────── */}
      <div className={styles.topBar}>
        <div className={`${styles.container} ${styles.topBarInner}`}>
          <Link to="/">
            <img src={logoImage} alt="SettleKar" className={styles.topBarLogo} />
          </Link>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      {/* ── Photo Slider ──────────────────────────────────────────────────── */}
      <PhotoSlider images={imgs} title={property.title} onImageClick={openLightbox} />

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lbOpen && (
        <Lightbox
          images={imgs}
          startIndex={lbIndex}
          title={property.title}
          onClose={closeLightbox}
        />
      )}

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className={styles.container}>

        {/* Verified Trust Layer / Unverified Warning */}
        {property.isVerified ? (
          <div className={styles.verifiedTrustContainer}>
            <div className={styles.verifiedHeader}>
              <span className={styles.verifiedShield}>🛡️</span>
              <div>
                <h3 className={styles.verifiedHeading}>Verified by SettleKar</h3>
                <p className={styles.verifiedSubheading}>This listing has been fully verified and authenticated by the SettleKar team.</p>
              </div>
            </div>
            <div className={styles.verifiedChecklist}>
              {(property.verifiedDetails && property.verifiedDetails.length > 0 ? property.verifiedDetails : [
                "Owner identity and property titles cross-checked & confirmed",
                "Physical location visited & photos authenticated on-site by our agent",
                "Historical safety record and landlord reviews vetted",
                "Fair pricing and Zero Brokerage terms verified"
              ]).map((detail, idx) => (
                <div key={idx} className={styles.checklistItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
            <div className={styles.verifiedFooter}>
              <span>Something wrong with this listing?</span>
              <a
                href={`mailto:jashanphw@gmail.com?subject=Rapid%20Takedown%20Request%20-%20Property%20${property.id}&body=Hi%20SettleKar%20team,%20I%20would%20like%20to%20report%20property%20listing%20${property.id}%20(${window.location.href})%20for%20investigation.%20Reason:%20`}
                className={styles.takedownLink}
              >
                ⚡ Request 48-Hour Rapid Takedown
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.unverifiedBanner}>
            <span className={styles.unverifiedAlert}>⚠️</span>
            <div>
              <strong className={styles.unverifiedHeading}>Unverified Self-Listed Property</strong>
              <p className={styles.unverifiedText}>
                This listing was submitted directly by a user and has not undergone SettleKar's physical inspection. Always verify in person and do not pay any deposits in advance before visiting.
              </p>
              <div className={styles.unverifiedActions}>
                <a
                  href={`mailto:jashanphw@gmail.com?subject=Verification%20Request%20-%20Property%20${property.id}`}
                  className={styles.verifyRequestLink}
                >
                  Request SettleKar Inspection →
                </a>
                <a
                  href={`mailto:jashanphw@gmail.com?subject=Report%20Listing%20-%20Property%20${property.id}&body=Hi%20SettleKar%20team,%20I%20would%20like%20to%20report%20this%20unverified%20listing:%20${window.location.href}`}
                  className={styles.reportListingLink}
                >
                  Report Suspicious Listing
                </a>
              </div>
            </div>
          </div>
        )}

        <div className={styles.contentGrid}>

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div>
            {/* Title block */}
            <div className={styles.titleBlock}>

              {/* Smart Tags */}
              {smartTags.length > 0 && (
                <div className={styles.tagRow}>
                  {smartTags.map((tag, i) => (
                    <span key={i} className={`${styles.tag} ${styles[tag.variant]}`}>
                      {tag.emoji} {tag.label}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.titleWithWishlist}>
                <h1 className={styles.propertyTitle}>{property.title}</h1>
                <button
                  onClick={handleToggleWishlist}
                  disabled={togglingWishlist}
                  className={`${styles.wishlistBtn} ${inWishlist ? styles.inWishlist : ''}`}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <span className={styles.wishlistIcon}>{inWishlist ? '❤️' : '🤍'}</span>
                  <span>{inWishlist ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>

              <div className={styles.locationRow}>
                <span>📍</span>
                <span>{cleanLocation(property.location, property.address, property.city)}</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceAmount}>{formatPrice(property.price)}</span>
                <span className={styles.priceUnit}>/month</span>
              </div>

              {/* Fraud Risk Label */}
              <div
                className={styles.fraudRiskBadge}
                style={{
                  background: riskDetails.bg,
                  color: riskDetails.color,
                  border: `1px solid ${riskDetails.border}`,
                }}
              >
                🛡️ Fraud Risk Status: <strong>{riskDetails.label}</strong>
              </div>

              {overallScore != null && sc && (
                <div
                  className={styles.scoreBadge}
                  style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                >
                  🛡️ Livability Score: <strong>{overallScore}/100</strong>
                </div>
              )}
            </div>

            {/* About */}
            {property.description && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>About this Property</h2>
                <p className={styles.description}>{property.description}</p>
              </div>
            )}

            {/* Property Details */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Property Details</h2>
              <div className={styles.detailsGrid}>
                {property.city && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>City</span>
                    <span className={styles.detailValue}>{property.city}</span>
                  </div>
                )}
                {property.area && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Area</span>
                    <span className={styles.detailValue}>{property.area} sq ft</span>
                  </div>
                )}
                {property.furnishing && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Furnishing</span>
                    <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>
                      {property.furnishing}
                    </span>
                  </div>
                )}
                {property.securityFees != null && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Security Deposit</span>
                    <span className={styles.detailValue}>{formatPrice(property.securityFees)}</span>
                  </div>
                )}
                {property.advanceRentMonths != null && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Advance Rent</span>
                    <span className={styles.detailValue}>
                      {property.advanceRentMonths} month{property.advanceRentMonths !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {property.brokerage != null && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Brokerage</span>
                    <span className={styles.detailValue}>
                      {Number(property.brokerage) === 0 ? 'Zero Brokerage 🎉' : formatPrice(property.brokerage)}
                    </span>
                  </div>
                )}
                {property.isIndependent != null && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Property Style</span>
                    <span className={styles.detailValue}>
                      {property.isIndependent ? 'Independent' : 'In a Society'}
                    </span>
                  </div>
                )}
                {property.listedByRole && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Listed By</span>
                    <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>
                      {property.listedByRole}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {featuresList.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Amenities & Features</h2>
                <ul className={styles.featuresList}>
                  {featuresList.map((f, i) => (
                    <li key={i} className={styles.featureTag}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Neighbourhood pillars */}
            {property.pillars && renderPillars(property.pillars)}

            {/* Community Rating & Review Input */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>⭐ Community Ratings & Security Check</h2>
              <div className={styles.ratingOverview}>
                <div className={styles.ratingBigNumber}>{ratingAvg}</div>
                <div className={styles.ratingMeta}>
                  <div className={styles.starsDisplay}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= parseFloat(ratingAvg) ? styles.starFilled : styles.starEmpty}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className={styles.ratingCountText}>
                    Based on {ratingCount} user ratings & reports
                  </div>
                </div>
              </div>

              <div className={styles.ratingActionBox}>
                <h4 className={styles.ratingActionTitle}>
                  {userRating !== null ? 'Feedback Submitted' : 'Help the community: Is this listing accurate?'}
                </h4>
                {userRating !== null ? (
                  <p className={styles.ratingSuccessText}>
                    Thank you! You rated this listing <strong>{userRating} / 5 stars</strong>. Your report helps keep SettleKar safe from fraud.
                  </p>
                ) : (
                  <div>
                    <p className={styles.ratingActionSub}>
                      Rate based on photo accuracy, owner/broker behavior, and description correctness:
                    </p>
                    <div className={styles.starInputRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.starInputBtn} ${
                            star <= (hoveredStar ?? 0) ? styles.starInputHovered : ''
                          }`}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(null)}
                          onClick={() => handleRateProperty(star)}
                          disabled={submittingRating}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    {!auth.currentUser && (
                      <p style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '10px', fontWeight: 500 }}>
                        🔑 Note: You must be <Link to="/dashboard" style={{ textDecoration: 'underline', fontWeight: 700, color: 'inherit' }}>signed in</Link> to submit a rating.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN – Sidebar ───────────────────────────────────── */}
          <aside className={styles.sidebar}>

            {/* CTA Card */}
            <div className={styles.ctaCard}>
              <p className={styles.ctaCardTitle}>Interested in this property?</p>
              <p className={styles.ctaCardSub}>Contact the owner directly — zero brokerage.</p>

              <a
                href="https://play.google.com/store/apps/details?id=com.settlekar.settlekar"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaPrimary}
              >
                📱 Open in SettleKar App
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.settlekar.settlekar"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaSecondary}
              >
                ↓ Download App
              </a>

              {property.ownerName && (
                <>
                  <hr className={styles.divider} />
                  <div className={styles.ownerInfo}>
                    <div className={styles.ownerAvatar}>
                      {property.ownerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.ownerName}>{property.ownerName}</p>
                      <p className={styles.ownerRole}>
                        {property.listedByRole === 'broker' ? '🏢 Broker' : '🏠 Property Owner'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Inquiry Form */}
            <div className={styles.inquiryCard}>
              <h3 className={styles.inquiryTitle}>📩 Send an Inquiry</h3>
              {sent ? (
                <div className={styles.successMsg}>
                  ✅ Inquiry sent! The owner will reach out to you shortly.
                </div>
              ) : (
                <form onSubmit={handleInquiry} noValidate>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="inq-name">Your Name</label>
                    <input
                      id="inq-name"
                      className={styles.formInput}
                      type="text"
                      placeholder="e.g. Ravi Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="inq-phone">Phone Number</label>
                    <input
                      id="inq-phone"
                      className={styles.formInput}
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="inq-msg">Message</label>
                    <textarea
                      id="inq-msg"
                      className={styles.formTextarea}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.formSubmit}
                    disabled={sending || !name || !phone}
                  >
                    {sending ? 'Sending…' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>

            {/* Share */}
            <div className={styles.shareCard}>
              <span className={styles.shareLabel}>Share this listing</span>
              <button className={styles.shareBtn} onClick={handleShare}>
                {copied ? '✅ Copied!' : '🔗 Share Link'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
