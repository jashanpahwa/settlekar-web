import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { scoreColor, pillarFillColor } from './helpers';

interface PropertyNeighbourhoodProps {
  pillars: Record<string, any> | null | undefined;
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

const formatPillarName = (key: string): string =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const PropertyNeighbourhood: React.FC<PropertyNeighbourhoodProps> = ({ pillars }) => {
  if (!pillars || Object.keys(pillars).length === 0) return null;

  const entries = Object.entries(pillars);

  return (
    <motion.div className={CARD_CLASS} {...fadeUp}>
      <h3 className={TITLE_CLASS}>
        <Shield size={16} className="text-[#0A2540]" />
        Neighbourhood Score Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {entries.map(([key, value]) => {
          const score =
            typeof value === 'number'
              ? value
              : typeof value === 'object' && value !== null
                ? Number(value.score ?? value.value ?? 0)
                : Number(value) || 0;

          const clampedScore = Math.min(100, Math.max(0, score));
          const colors = scoreColor(clampedScore);
          const fillColor = pillarFillColor(clampedScore);

          return (
            <div
              key={key}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col gap-1.5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[0.8rem] font-semibold text-slate-600">
                  {formatPillarName(key)}
                </span>
                <span
                  className="text-[0.72rem] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {clampedScore}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: fillColor }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${clampedScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' as const }}
                  viewport={{ once: true }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PropertyNeighbourhood;
