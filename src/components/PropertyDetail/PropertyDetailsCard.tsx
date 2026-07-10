import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  LayoutGrid,
  Building2,
  Ruler,
  Sofa,
  Lock,
  CalendarDays,
  BadgePercent,
  PartyPopper,
  Home,
  UserCircle,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from './helpers';

interface PropertyDetailsCardProps {
  description?: string;
  city?: string;
  area?: number;
  furnishing?: string;
  securityFees?: number;
  advanceRentMonths?: number;
  brokerage?: number;
  isIndependent?: boolean | null;
  listedByRole?: string | null;
  featuresList: string[];
}

const CARD_CLASS =
  'bg-white rounded-2xl p-6 mb-5 shadow-[0_1px_4px_rgba(15,23,42,0.06),0_4px_20px_rgba(15,23,42,0.03)] border border-slate-100';

const TITLE_CLASS =
  'text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: 'easeOut' as const },
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[0.7rem] uppercase tracking-wide font-semibold text-slate-400">
        {label}
      </span>
    </div>
    <span className="text-sm font-semibold text-slate-900">{value}</span>
  </div>
);

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({
  description,
  city,
  area,
  furnishing,
  securityFees,
  advanceRentMonths,
  brokerage,
  isIndependent,
  listedByRole,
  featuresList,
}) => {
  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return (
    <>
      {/* ── Card 1 — About this Property ─────────────────────────────── */}
      {description && (
        <motion.div className={CARD_CLASS} {...fadeUp}>
          <h3 className={TITLE_CLASS}>
            <FileText size={16} className="text-[#0A2540]" />
            About this Property
          </h3>
          <p className="text-[0.9rem] leading-relaxed text-slate-500 whitespace-pre-line">
            {description}
          </p>
        </motion.div>
      )}

      {/* ── Card 2 — Property Details ────────────────────────────────── */}
      <motion.div className={CARD_CLASS} {...fadeUp}>
        <h3 className={TITLE_CLASS}>
          <LayoutGrid size={16} className="text-[#0A2540]" />
          Property Details
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {city && (
            <DetailItem
              icon={<Building2 size={14} className="text-slate-400" />}
              label="City"
              value={city}
            />
          )}

          {area != null && area > 0 && (
            <DetailItem
              icon={<Ruler size={14} className="text-slate-400" />}
              label="Area"
              value={`${area.toLocaleString('en-IN')} sq ft`}
            />
          )}

          {furnishing && (
            <DetailItem
              icon={<Sofa size={14} className="text-slate-400" />}
              label="Furnishing"
              value={capitalize(furnishing)}
            />
          )}

          {securityFees != null && (
            <DetailItem
              icon={<Lock size={14} className="text-slate-400" />}
              label="Security Deposit"
              value={formatPrice(securityFees)}
            />
          )}

          {advanceRentMonths != null && (
            <DetailItem
              icon={<CalendarDays size={14} className="text-slate-400" />}
              label="Advance Rent"
              value={`${advanceRentMonths} month(s)`}
            />
          )}

          {brokerage != null && (
            <DetailItem
              icon={
                brokerage === 0 ? (
                  <PartyPopper size={14} className="text-emerald-500" />
                ) : (
                  <BadgePercent size={14} className="text-slate-400" />
                )
              }
              label="Brokerage"
              value={
                brokerage === 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    Zero Brokerage
                  </span>
                ) : (
                  formatPrice(brokerage)
                )
              }
            />
          )}

          {isIndependent != null && (
            <DetailItem
              icon={<Home size={14} className="text-slate-400" />}
              label="Property Style"
              value={isIndependent ? 'Independent' : 'In a Society'}
            />
          )}

          {listedByRole && (
            <DetailItem
              icon={<UserCircle size={14} className="text-slate-400" />}
              label="Listed By"
              value={capitalize(listedByRole)}
            />
          )}
        </div>
      </motion.div>

      {/* ── Card 3 — Amenities & Features ────────────────────────────── */}
      {featuresList.length > 0 && (
        <motion.div className={CARD_CLASS} {...fadeUp}>
          <h3 className={TITLE_CLASS}>
            <Sparkles size={16} className="text-[#0A2540]" />
            Amenities &amp; Features
          </h3>

          <div className="flex flex-wrap gap-2">
            {featuresList.map((feature) => (
              <span
                key={feature}
                className="bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-full text-[0.78rem] font-semibold"
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PropertyDetailsCard;
