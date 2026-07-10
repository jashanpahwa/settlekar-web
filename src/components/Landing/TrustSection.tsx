import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, Eye, AlertTriangle } from 'lucide-react';

const pillars = [
  {
    title: 'Owner Identity Verified',
    description: 'Government ID crosscheck + title deed authentication by our field agents before any listing goes live.',
    Icon: ShieldCheck,
    accent: '#10B981',
    tag: '100% Verified',
    tagBg: 'rgba(16,185,129,0.1)',
  },
  {
    title: '48-Hour Takedown Guarantee',
    description: 'Report a fraudulent listing. Our team investigates and removes it within 48 hours — guaranteed.',
    Icon: Clock,
    accent: '#F59E0B',
    tag: 'Rapid Action',
    tagBg: 'rgba(245,158,11,0.1)',
  },
  {
    title: 'Full Audit Trail Visible',
    description: 'Every verified listing shows exactly what was checked — photo dates, owner name, safety scores, all of it.',
    Icon: Eye,
    accent: '#818CF8',
    tag: 'Total Transparency',
    tagBg: 'rgba(129,140,248,0.1)',
  },
];

export const TrustSection: React.FC = () => {
  return (
    <section
      className="relative w-full bg-[#0A0A0B] overflow-hidden border-t border-slate-900/60"
      style={{ fontFamily: 'inherit' }}
    >
      {/* ── Decorative top rule ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {/* ── Ambient glow ── */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 py-24">

        {/* ── Header ── */}
        <div className="mb-16">
          <motion.div
            viewport={{ once: true }}
            className="flex flex-col items-start gap-4"
          >
           
            <h2 className="text-white text-4xl md:text-[52px] font-extrabold tracking-tight leading-tight max-w-3xl">
              Fraud-proof renting.{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #0A2540, #0a3d6f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our promise.
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
              Trust is our core product. We make verification details public, action rapid, and fraud impossible to hide.
            </p>
          </motion.div>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {pillars.map((p) => (
           
             

              <div className="p-8 flex flex-col gap-5 h-full">
               

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 tracking-tight leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-[3px] w-10 rounded-full mt-2 group-hover:w-16 transition-all duration-400"
                  style={{ backgroundColor: "#ffffff" }}
                />
              </div>
           
          ))}
        </div>

        {/* ── CTA banner ── */}
        <motion.div
         
          className="relative rounded-[24px] overflow-hidden border border-red-950/50 bg-[#130a0a] flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 to-transparent pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <span className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertTriangle size={20} />
            </span>
            <div>
              <h4 className="text-white font-bold text-base">Spot a suspicious listing?</h4>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                File a rapid takedown report. We investigate every report within 48 hours, guaranteed.
              </p>
            </div>
          </div>
          <a
            href="mailto:jashanphw@gmail.com?subject=Fraud%20Listing%20Report&body=Hi%20SettleKar%20team,%20I%20want%20to%20report%20a%20listing.%20Details:%20"
            className="relative shrink-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-widest uppercase py-3.5 px-7 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/20"
          >
            🚨 File Rapid Report
          </a>
        </motion.div>
      </div>
    </section>
  );
};
