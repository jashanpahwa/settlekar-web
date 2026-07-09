import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { propertyService, PropertyData } from '../services/propertyService';
import { inquiryService } from '../services/inquiryService';
import logoImage from '/logo.png';
import styles from '../styles/PropertyDetailPage.module.css';

// ─── helpers ─────────────────────────────────────────────────────────────────

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
  const desc = (prop.description || '').toLowerCase();
  const title = (prop.title || '').toLowerCase();
  const combo = desc + ' ' + title;
  const type = (prop.propertyType || '').toLowerCase();

  // ── Property type tag ──
  if (type) {
    const typeLabel = type.toUpperCase();
    tags.push({ label: typeLabel, emoji: '🏠', variant: 'tagPurple' });
  }

  // ── Tenant-type tags ──
  if (
    combo.includes('bachelor') ||
    combo.includes('boys') ||
    combo.includes('males') ||
    combo.includes('gents')
  ) {
    tags.push({ label: 'Bachelor Friendly', emoji: '👨', variant: 'tagBlue' });
  }

  if (
    combo.includes('girls') ||
    combo.includes('female') ||
    combo.includes('ladies') ||
    combo.includes('women')
  ) {
    tags.push({ label: 'Girls Friendly', emoji: '👩', variant: 'tagOrange' });
  }

  if (combo.includes('family') || combo.includes('families')) {
    tags.push({ label: 'Family Friendly', emoji: '👨‍👩‍👧', variant: 'tagGreen' });
  }

  if (combo.includes('student') || combo.includes('college') || combo.includes('university')) {
    tags.push({ label: 'Student Friendly', emoji: '🎓', variant: 'tagBlue' });
  }

  // ── Brokerage tag ──
  const brokerage = Number(prop.brokerage);
  if (!isNaN(brokerage) && brokerage === 0) {
    tags.push({ label: 'Zero Brokerage', emoji: '🎉', variant: 'tagGreen' });
  }

  // ── Furnishing tag ──
  const furnishing = (prop.furnishing || '').toLowerCase();
  if (furnishing.includes('fully')) {
    tags.push({ label: 'Fully Furnished', emoji: '🛋️', variant: 'tagPurple' });
  } else if (furnishing.includes('semi')) {
    tags.push({ label: 'Semi-Furnished', emoji: '🪑', variant: 'tagSlate' });
  } else if (furnishing.includes('unfurnished') || furnishing.includes('bare')) {
    tags.push({ label: 'Unfurnished', emoji: '📦', variant: 'tagSlate' });
  }

  // ── Independence tag ──
  if (prop.isIndependent) {
    tags.push({ label: 'Independent House', emoji: '🏡', variant: 'tagOrange' });
  }

  // ── Amenity-based tags from description ──
  if (combo.includes('parking') || combo.includes('car park')) {
    tags.push({ label: 'Parking Available', emoji: '🚗', variant: 'tagSlate' });
  }

  if (combo.includes('lift') || combo.includes('elevator')) {
    tags.push({ label: 'Lift', emoji: '🛗', variant: 'tagSlate' });
  }

  if (combo.includes('wifi') || combo.includes('wi-fi') || combo.includes('internet')) {
    tags.push({ label: 'WiFi Included', emoji: '📶', variant: 'tagBlue' });
  }

  if (combo.includes('ac') || combo.includes('air condition') || combo.includes('air-condition')) {
    tags.push({ label: 'Air Conditioned', emoji: '❄️', variant: 'tagBlue' });
  }

  if (combo.includes('gym') || combo.includes('fitness')) {
    tags.push({ label: 'Gym', emoji: '💪', variant: 'tagOrange' });
  }

  if (combo.includes('pet') || combo.includes('dog') || combo.includes('cat')) {
    tags.push({ label: 'Pet Friendly', emoji: '🐾', variant: 'tagGreen' });
  }

  if (combo.includes('24') && (combo.includes('water') || combo.includes('supply'))) {
    tags.push({ label: '24h Water Supply', emoji: '💧', variant: 'tagBlue' });
  }

  if (combo.includes('metro') || combo.includes('bus stop') || combo.includes('near market')) {
    tags.push({ label: 'Near Transit', emoji: '🚇', variant: 'tagGreen' });
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

  const openLightbox = (i: number) => { setLbIndex(i); setLbOpen(true); };
  const closeLightbox = () => setLbOpen(false);

  // ── Fetch property ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    propertyService
      .getPropertyById(id)
      .then((data) => setProperty(data as Property))
      .catch(() => setError('Property not found or an error occurred.'))
      .finally(() => setLoading(false));
  }, [id]);

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

              <h1 className={styles.propertyTitle}>{property.title}</h1>

              <div className={styles.locationRow}>
                <span>📍</span>
                <span>{cleanLocation(property.location, property.address, property.city)}</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceAmount}>{formatPrice(property.price)}</span>
                <span className={styles.priceUnit}>/month</span>
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
