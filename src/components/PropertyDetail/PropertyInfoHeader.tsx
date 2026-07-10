import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Shield, Link2 } from 'lucide-react';
import { SmartTag, FraudRiskDetails, TAG_STYLES } from './helpers';

interface PropertyInfoHeaderProps {
  title: string;
  location: string;
  price: string;
  smartTags: SmartTag[];
  riskDetails: FraudRiskDetails;
  overallScore: number | null;
  scoreColorData: { bg: string; text: string; border: string } | null;
  inWishlist: boolean;
  togglingWishlist: boolean;
  copied: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

const PropertyInfoHeader: React.FC<PropertyInfoHeaderProps> = ({
  title,
  price,
  smartTags,
  riskDetails,
  overallScore,
  scoreColorData,
  inWishlist,
  togglingWishlist,
  copied,
  onToggleWishlist,
  onShare,
}) => {
  return (
    <motion.div
      className="mb-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Smart Tags */}
      {smartTags.length > 0 && (
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-3">
          {smartTags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-[0.72rem] font-bold tracking-wide px-3 py-1 rounded-full border ${TAG_STYLES[tag.variant]}`}
            >
              {tag.label}
            </span>
          ))}
        </motion.div>
      )}

      {/* Title + Wishlist */}
      <motion.div variants={fadeUp} className="flex items-start justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
          {title}
        </h1>
        <button
          onClick={onToggleWishlist}
          disabled={togglingWishlist}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
            inWishlist
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          } ${togglingWishlist ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <Heart
            size={15}
            className={inWishlist ? 'fill-red-500 text-red-500' : ''}
          />
          {inWishlist ? 'Wishlisted' : 'Save'}
        </button>
      </motion.div>

     

      {/* Price */}
      <motion.div variants={fadeUp} className="mt-3">
        <span className="text-3xl font-extrabold text-slate-900">{price}</span>
        <span className="text-sm text-slate-400 font-medium">/month</span>
      </motion.div>

      {/* Badges */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-2">
        {/* Fraud Risk Badge */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
          style={{
            backgroundColor: riskDetails.bg,
            color: riskDetails.color,
            borderColor: riskDetails.border,
          }}
        >
          <ShieldCheck size={14} />
          {riskDetails.label}
        </span>

        {/* Livability Score Badge */}
        {overallScore !== null && scoreColorData && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: scoreColorData.bg,
              color: scoreColorData.text,
              borderColor: scoreColorData.border,
            }}
          >
            <Shield size={14} />
            Livability {overallScore}/100
          </span>
        )}
      </motion.div>

      {/* Share */}
      <motion.div variants={fadeUp} className="mt-3">
        <button
          onClick={onShare}
          className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors"
        >
          <Link2 size={14} />
          {copied ? 'Copied!' : 'Share Link'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PropertyInfoHeader;
