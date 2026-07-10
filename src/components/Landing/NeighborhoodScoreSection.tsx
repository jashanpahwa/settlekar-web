import React from 'react';
import { motion } from 'motion/react';

const pillarConfig = [
  { key: 'safety&security',       label: 'Safety & Security',        },
  { key: 'connectivity', label: 'Connectivity', },
  { key: 'amenities',    label: 'Amenities',    },
  { key: 'environment',  label: 'Environment',  },
   { key: 'water&power reliability',  label: 'Water & Power Reliability',  },
     { key: 'flood&climate',  label: 'Flood & Climate',  },
  
];



export const NeighborhoodScoreSection: React.FC = () => {
 
  return (
    <section className="relative w-full bg-[#0A0A0B] overflow-hidden border-t border-slate-900/60">
      {/* Decorative top rule */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-600/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 py-24">

        {/* ── Header ── */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <motion.div
           
          >
           
            <h2 className="text-white text-4xl md:text-[52px] font-extrabold tracking-tight leading-tight">
              Know the area{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #0A2540, #0a3d6f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                before you settle.
              </span>
            </h2>
          </motion.div>
          <motion.p
           
            className="text-gray-400 text-sm md:text-base leading-relaxed md:text-right"
          >
            Every SettleKar listing is automatically scored across <strong className="text-gray-300">11 livability dimensions</strong> using real-time neighbourhood data with LiveableIndia® — so you move in with full confidence.
          </motion.p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* ── LEFT: Pillar explainers ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillarConfig.map((p) => (
              
               
               
                <div className="relative">
                  <h4 className="text-white font-bold text-sm mb-1">{p.label}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {p.key === 'safety&security' && 'Street lighting, historical indexes & community safety reports.'}
                    {p.key === 'connectivity' && 'Metro, bus stops, transit frequency & road accessibility.'}
                    {p.key === 'amenities' && 'Supermarkets, hospitals, schools & dining proximity.'}
                    {p.key === 'flood&climate' && 'Flood risk, climate resilience & environmental factors.'}
                     {p.key === 'environment' && 'Air quality, tree canopy, parks & ambient noise levels.'}
                     {p.key === 'water&power reliability' && 'Reliability of water and power supply in the area.'}
                  </p>
                 
                </div>
              
            ))}
          </div>

          
        </div>
      </div>
    </section>
  );
};
