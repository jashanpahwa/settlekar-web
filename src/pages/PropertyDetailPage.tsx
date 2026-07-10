import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { inquiryService } from '../services/inquiryService';
import { ratingService } from '../services/ratingService';
import { wishlistService } from '../services/wishlistService';
import { auth } from '../firebase';
import logoImage from '/logo.png';
import styles from '../styles/PropertyDetailPage.module.css';

// Sub-components
import PropertyHeroGallery from '../components/PropertyDetail/PropertyHeroGallery';
import PropertyTrustBanner from '../components/PropertyDetail/PropertyTrustBanner';
import PropertyInfoHeader from '../components/PropertyDetail/PropertyInfoHeader';
import PropertyDetailsCard from '../components/PropertyDetail/PropertyDetailsCard';
import PropertyNeighbourhood from '../components/PropertyDetail/PropertyNeighbourhood';
import PropertyRatingSection from '../components/PropertyDetail/PropertyRatingSection';
import PropertySidebar from '../components/PropertyDetail/PropertySidebar';

// Shared helpers
import {
  Property,
  deriveSmartTags,
  getFraudRiskDetails,
  cleanLocation,
  formatPrice,
  scoreColor,
} from '../components/PropertyDetail/helpers';

// ─── Main Component ───────────────────────────────────────────────────────────

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

  // Rating states
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [ratingAvg, setRatingAvg] = useState<string>('5.0');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  // ── Auth-dependent effects ──────────────────────────────────────────────────

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

  // ── Handlers ────────────────────────────────────────────────────────────────

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

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className={styles.spinner} />
        <span className="text-slate-400 text-sm font-medium">Loading property details…</span>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <span className="text-3xl">🏠</span>
        </div>
        <p className="font-semibold text-slate-400 text-sm">{error || 'Property not found.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-semibold px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
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
    <div
      className="min-h-screen bg-[#F8FAFC]"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── SEO Metadata ──────────────────────────────────────────────────── */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image"       content={imgs[0] || 'https://settlekar.in/logo.png'} />
      <meta property="og:url"         content={canonicalUrl} />

      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/">
            <img src={logoImage} alt="SettleKar" className="h-7 w-auto" />
          </Link>
          <button
            className="inline-flex items-center gap-1.5 text-slate-500 text-[0.85rem] font-semibold px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </div>

      {/* ── Photo Gallery ──────────────────────────────────────────────────── */}
      <PropertyHeroGallery images={imgs} title={property.title} />

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Trust Banner */}
        <div className="mt-5 mb-6">
          <PropertyTrustBanner
            isVerified={!!property.isVerified}
            verifiedDetails={property.verifiedDetails}
            propertyId={property.id}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 pb-16 items-start">

          {/* ── Left Column ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title / Tags / Price / Scores */}
            <PropertyInfoHeader
              title={property.title}
              location={cleanLocation(property.location, property.address, property.city)}
              price={formatPrice(property.price)}
              smartTags={smartTags}
              riskDetails={riskDetails}
              overallScore={overallScore}
              scoreColorData={sc}
              inWishlist={inWishlist}
              togglingWishlist={togglingWishlist}
              copied={copied}
              onToggleWishlist={handleToggleWishlist}
              onShare={handleShare}
            />

            {/* Property Details + Amenities */}
            <PropertyDetailsCard
              description={property.description}
              city={property.city}
              area={property.area}
              furnishing={property.furnishing}
              securityFees={property.securityFees}
              advanceRentMonths={property.advanceRentMonths}
              brokerage={property.brokerage}
              isIndependent={property.isIndependent ?? null}
              listedByRole={property.listedByRole}
              featuresList={featuresList}
            />

            {/* Neighbourhood Score Breakdown */}
            <PropertyNeighbourhood pillars={property.pillars} />

            {/* Community Ratings */}
            <PropertyRatingSection
              ratingAvg={ratingAvg}
              ratingCount={ratingCount}
              userRating={userRating}
              hoveredStar={hoveredStar}
              submittingRating={submittingRating}
              isSignedIn={!!auth.currentUser}
              onRate={handleRateProperty}
              onHoverStar={setHoveredStar}
            />
          </motion.div>

          {/* ── Right Column (Sidebar) ───────────────────────────────────── */}
          <aside className="lg:sticky lg:top-6">
            <PropertySidebar
              ownerName={property.ownerName}
              listedByRole={property.listedByRole}
              name={name}
              phone={phone}
              message={message}
              sending={sending}
              sent={sent}
              onNameChange={setName}
              onPhoneChange={setPhone}
              onMessageChange={setMessage}
              onInquirySubmit={handleInquiry}
              copied={copied}
              onShare={handleShare}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
