import React from 'react';
import { Link } from 'react-router-dom';
import { Star, KeyRound } from 'lucide-react';

interface PropertyRatingSectionProps {
  ratingAvg: string;
  ratingCount: number;
  userRating: number | null;
  hoveredStar: number | null;
  submittingRating: boolean;
  isSignedIn: boolean;
  onRate: (val: number) => void;
  onHoverStar: (star: number | null) => void;
}

const CARD_CLASS =
  'bg-white rounded-2xl p-6 mb-5 shadow-[0_1px_4px_rgba(15,23,42,0.06),0_4px_20px_rgba(15,23,42,0.03)] border border-slate-100';

const TITLE_CLASS =
  'text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2';

const PropertyRatingSection: React.FC<PropertyRatingSectionProps> = ({
  ratingAvg,
  ratingCount,
  userRating,
  hoveredStar,
  submittingRating,
  isSignedIn,
  onRate,
  onHoverStar,
}) => {
  const avgNum = parseFloat(ratingAvg) || 0;
  const stars = [1, 2, 3, 4, 5] as const;

  return (
    <div className={CARD_CLASS}>
      <h3 className={TITLE_CLASS}>
        <Star size={16} className="text-amber-500" />
        Community Ratings &amp; Security Check
      </h3>

      {/* ── Rating Overview ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100 mb-4">
        <span className="text-5xl font-extrabold text-slate-900 leading-none">
          {ratingAvg}
        </span>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-0.5">
            {stars.map((s) => (
              <Star
                key={s}
                size={18}
                className={
                  s <= Math.round(avgNum)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                }
              />
            ))}
          </div>
          <span className="text-[0.8rem] text-slate-400">
            Based on {ratingCount} user ratings &amp; reports
          </span>
        </div>
      </div>

      {/* ── Rating Action Box ─────────────────────────────────────── */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
        {userRating !== null ? (
          /* ── Success state ────────────────────────────────────── */
          <>
            <p className="text-sm font-bold text-slate-600 mb-2">
              Feedback Submitted
            </p>
            <div className="bg-emerald-50 text-emerald-700 rounded-lg p-3 text-sm">
              Thank you! You rated this listing {userRating} / 5 stars. Your
              report helps keep SettleKar safe from fraud.
            </div>
          </>
        ) : (
          /* ── Input state ─────────────────────────────────────── */
          <>
            <p className="text-sm font-bold text-slate-600 mb-1">
              Help the community: Is this listing accurate?
            </p>
            <p className="text-[0.8rem] text-slate-400 mb-3">
              Rate based on photo accuracy, owner/broker behavior, and
              description correctness:
            </p>

            <div className="flex items-center gap-1">
              {stars.map((s) => {
                const isHighlighted =
                  hoveredStar !== null && s <= hoveredStar;

                return (
                  <button
                    key={s}
                    type="button"
                    disabled={submittingRating}
                    onClick={() => onRate(s)}
                    onMouseEnter={() => onHoverStar(s)}
                    onMouseLeave={() => onHoverStar(null)}
                    className="p-0.5 transition-transform duration-150 ease-out disabled:opacity-50 cursor-pointer"
                    aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={28}
                      className={
                        isHighlighted
                          ? 'text-amber-400 fill-amber-400 scale-110 transition-all duration-150'
                          : 'text-slate-200 transition-all duration-150'
                      }
                    />
                  </button>
                );
              })}
            </div>

            {!isSignedIn && (
              <p className="text-[0.75rem] text-amber-600 font-medium mt-2.5 flex items-center gap-1.5">
                <KeyRound size={13} />
                Note: You must be signed in to submit a rating.{' '}
                <Link
                  to="/dashboard"
                  className="underline underline-offset-2 hover:text-amber-700"
                >
                  Sign in
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyRatingSection;
