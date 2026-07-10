import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Check, AlertTriangle } from 'lucide-react';

interface PropertyTrustBannerProps {
  isVerified: boolean;
  verifiedDetails?: string[];
  propertyId: string;
}

const DEFAULT_VERIFIED_DETAILS = [
  'Owner identity and property titles cross-checked & confirmed',
  'Physical location visited & photos authenticated on-site by our agent',
  'Historical safety record and landlord reviews vetted',
  'Fair pricing and Zero Brokerage terms verified',
];

const PropertyTrustBanner: React.FC<PropertyTrustBannerProps> = ({
  isVerified,
  verifiedDetails,
  propertyId,
}) => {
  if (isVerified) {
    const items = verifiedDetails?.length ? verifiedDetails : DEFAULT_VERIFIED_DETAILS;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="bg-[#0B192E] border border-slate-800 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={28} className="text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-emerald-400 font-bold text-lg leading-snug">
                Verified by SettleKar
              </h3>
              <p className="text-slate-400 text-sm mt-0.5">
                This property has been independently inspected and verified by our team.
              </p>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="px-5 pb-5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15">
                    <Check size={12} className="text-emerald-400" />
                  </span>
                  <span className="text-slate-300 text-sm leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
          <span className="text-slate-500 text-xs">Something wrong?</span>
          <a
            href={`mailto:hello@settlekar.com?subject=Rapid%20Takedown%20Request%20-%20Property%20${encodeURIComponent(propertyId)}&body=I%20would%20like%20to%20report%20an%20issue%20with%20property%20${encodeURIComponent(propertyId)}.`}
            className="inline-flex items-center gap-1.5 text-red-400 text-xs font-semibold hover:text-red-300 transition-colors"
          >
            <AlertTriangle size={13} />
            Request 48-Hour Rapid Takedown
          </a>
        </div>
      </motion.div>
    );
  }

  // ── Unverified variant ──────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="bg-amber-50 border border-amber-200 rounded-2xl p-5"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={28} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-amber-800 font-bold text-lg leading-snug">
            Unverified Self-Listed Property
          </h3>
          <p className="text-amber-700 text-sm mt-1 leading-relaxed">
            This property was listed directly by the owner and has not yet been inspected or
            verified by our team. Pricing, photos, and details may not accurately reflect the
            actual property. Proceed with caution.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 mt-4 ml-[40px]">
        <a
          href={`mailto:inspections@settlekar.com?subject=Inspection%20Request%20-%20Property%20${encodeURIComponent(propertyId)}&body=I%20would%20like%20to%20request%20a%20SettleKar%20inspection%20for%20property%20${encodeURIComponent(propertyId)}.`}
          className="inline-flex items-center gap-1.5 bg-amber-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-amber-700 transition-colors"
        >
          Request SettleKar Inspection →
        </a>
        <a
          href={`mailto:safety@settlekar.com?subject=Suspicious%20Listing%20Report%20-%20Property%20${encodeURIComponent(propertyId)}&body=I%20would%20like%20to%20report%20property%20${encodeURIComponent(propertyId)}%20as%20suspicious.`}
          className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Report Suspicious Listing
        </a>
      </div>
    </motion.div>
  );
};

export default PropertyTrustBanner;
