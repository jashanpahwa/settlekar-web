import React from 'react';
import { X, Check, Minus, Star } from 'lucide-react';

interface SearchProperty {
  id: string;
  title: string;
  city: string;
  location: string;
  address: string;
  price: number | string;
  rating: string;
  badge: string;
  features: string;
  image: string;
  description?: string;
  propertyType?: string;
  furnishing?: string;
  isIndependent?: boolean;
  bachelorFriendly?: boolean;
  womenOnly?: boolean;
  isTopFloor?: boolean;
  isVerified?: boolean;
  verifiedDetails?: string[];
  ratingCount?: number;
  overallscore?: number;
  petFriendly?: boolean;
}

interface CompareViewProps {
  properties: SearchProperty[];
  onRemove: (property: SearchProperty) => void;
  onClose: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  properties,
  onRemove,
  onClose,
}) => {
  if (properties.length === 0) return null;

  // Helper to extract numerical price
  const getNumericalPrice = (p: SearchProperty): number => {
    if (typeof p.price === 'number') return p.price;
    return parseInt(p.price.replace(/[^\d]/g, ''), 10) || 0;
  };

  // Find min price to highlight best value
  const prices = properties.map(getNumericalPrice);
  const minPrice = Math.min(...prices);

  // Helper to extract safety/livability score
  const getSafetyScore = (p: SearchProperty): number => {
    return p.overallscore !== undefined ? p.overallscore : parseFloat(p.rating || '0') * 20;
  };

  // Find max score to highlight best safety
  const scores = properties.map(getSafetyScore);
  const maxScore = Math.max(...scores);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base md:text-lg">Property Comparison</h3>
            <p className="text-xs text-slate-500 font-medium">Evaluate up to 5 properties side-by-side</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Table wrapper */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-[650px]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-1/4 text-left font-bold text-xs text-slate-400 uppercase tracking-wider pb-6 align-bottom">
                    Features
                  </th>
                  {properties.map((p) => {
                    const priceVal = getNumericalPrice(p);
                    const isBestPrice = priceVal === minPrice && properties.length > 1;
                    return (
                      <th key={p.id} className="w-1/4 px-4 pb-6 text-center align-top relative">
                        <button
                          onClick={() => onRemove(p)}
                          className="absolute top-0 right-2 p-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-full text-slate-400 transition-all cursor-pointer shadow-sm"
                          title="Remove from comparison"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="flex flex-col items-center text-center space-y-2">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-24 h-20 object-cover rounded-xl shadow-sm border border-slate-100"
                          />
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-xs text-slate-800 line-clamp-1 max-w-[150px] mx-auto">
                              {p.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              {p.propertyType || p.badge}
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="font-extrabold text-sm text-slate-900">
                              ₹{priceVal.toLocaleString('en-IN')}/mo
                            </span>
                            {isBestPrice && (
                              <span className="text-[9px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full mt-1">
                                Best Budget
                              </span>
                            )}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs">
                
                {/* 1. Verified */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Owner Verification</td>
                  {properties.map((p) => (
                    <td key={p.id} className="py-4 px-4 text-center">
                      {p.isVerified ? (
                        <span className="inline-flex items-center gap-1 font-bold text-[#10b981] bg-[#10b981]/5 px-2.5 py-1 rounded-lg border border-[#10b981]/10">
                          🛡️ Verified Owner
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                          Under Review
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 2. Safety/Livability Score */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Safety & Livability Score</td>
                  {properties.map((p) => {
                    const score = getSafetyScore(p);
                    const isBestScore = score === maxScore && properties.length > 1;
                    return (
                      <td key={p.id} className={`py-4 px-4 text-center ${isBestScore ? 'bg-emerald-50/20' : ''}`}>
                        <div className="flex flex-col items-center">
                          <span className={`font-extrabold text-sm ${score >= 80 ? 'text-[#10b981]' : score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                            {score}/100
                          </span>
                          {isBestScore && (
                            <span className="text-[9px] font-bold text-emerald-600 mt-0.5">Top Safe</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* 3. Rating */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">User Rating</td>
                  {properties.map((p) => (
                    <td key={p.id} className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating || '4.8'}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 4. Furnishing status */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Furnishing</td>
                  {properties.map((p) => {
                    const furn = p.furnishing || 'unfurnished';
                    return (
                      <td key={p.id} className="py-4 px-4 text-center font-bold text-slate-800 uppercase tracking-wide text-[10px]">
                        {furn.includes('fully') ? '🛋️ Fully Furnished' : furn.includes('semi') ? '🪑 Semi Furnished' : '📦 Unfurnished'}
                      </td>
                    );
                  })}
                </tr>

                {/* 5. Independent vs Shared */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Independence</td>
                  {properties.map((p) => (
                    <td key={p.id} className="py-4 px-4 text-center">
                      {p.isIndependent ? (
                        <span className="font-bold text-slate-700">🏠 Independent Unit</span>
                      ) : (
                        <span className="font-semibold text-slate-500">🏢 Shared Society</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6. Bachelor Friendly */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Bachelor Friendly</td>
                  {properties.map((p) => (
                    <td key={p.id} className="py-4 px-4 text-center">
                      {p.bachelorFriendly ? (
                        <Check className="h-4.5 w-4.5 text-[#10b981] mx-auto stroke-[3]" />
                      ) : (
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Family Preferred</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 7. Women Only */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Women Only</td>
                  {properties.map((p) => (
                    <td key={p.id} className="py-4 px-4 text-center">
                      {p.womenOnly ? (
                        <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px]">Yes (Girls Only)</span>
                      ) : (
                        <Minus className="h-4 w-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* 8. Floor */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Floor Level</td>
                  {properties.map((p) => (
                    <td key={p.id} className="py-4 px-4 text-center text-slate-700 font-semibold">
                      {p.isTopFloor ? 'Top Floor (Terrace Access)' : 'Middle / Ground Floor'}
                    </td>
                  ))}
                </tr>

                {/* 9. Description */}
                <tr>
                  <td className="py-4 font-bold text-slate-700">Highlights</td>
                  {properties.map((p) => (
                    <td key={p.id} className="py-4 px-4 text-center">
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-3 leading-relaxed max-w-[180px] mx-auto">
                        {p.description || p.features}
                      </p>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4.5 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-bold text-xs transition-all active:scale-98 cursor-pointer shadow-md"
          >
            Close Comparison
          </button>
        </div>
        
      </div>
    </div>
  );
};
export default CompareView;
