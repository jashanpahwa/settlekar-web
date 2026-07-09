import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Globe, Shield, Zap, CheckCircle2, Apple } from 'lucide-react';

const DownloadSection: React.FC = () => {
  const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.settlekar.settlekar';

  const cards = [
    {
      title: 'Android App',
      description: 'Install SettleKar on your Android device from the Google Play Store for interactive maps and direct calling on the go.',
      actionText: 'Get on Google Play',
      actionUrl: googlePlayUrl,
      icon: <Smartphone size={22} className="text-[#FF8D3C]" />,
      gradient: 'linear-gradient(to top, rgba(255, 61, 119, 0.45) 0%, rgba(255, 157, 60, 0.15) 50%, rgba(0, 0, 0, 0) 100%)',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(255,141,60,0.15)]',
      accentColor: 'text-[#FF8D3C]',
      isComingSoon: false,
    },
    {
      title: 'iOS App',
      description: 'Get SettleKar from the Apple App Store. Experience smooth gestures, native map tools, and secure verified direct renting.',
      actionText: 'App Store Coming Soon',
      actionUrl: '#',
      icon: <Apple size={22} className="text-[#38BDF8]" />,
      gradient: 'linear-gradient(to top, rgba(56, 189, 248, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(0, 0, 0, 0) 100%)',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(56,189,248,0.15)]',
      accentColor: 'text-[#38BDF8]',
      isComingSoon: true,
    },
    {
      title: 'Web Platform',
      description: 'Prefer browsing on a larger screen? Access our responsive web portal to view location listings and manage your posts.',
      actionText: 'Search Properties',
      actionUrl: '/search',
      icon: <Globe size={22} className="text-[#34D399]" />,
      gradient: 'linear-gradient(to top, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(0, 0, 0, 0) 100%)',
      glowColor: 'group-hover:shadow-[0_20px_50px_rgba(52,211,153,0.15)]',
      accentColor: 'text-[#34D399]',
      isComingSoon: false,
    },
  ];

  return (
    <section 
      id="download" 
      className="relative w-full bg-[#0A0A0B] py-12 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center font-sans overflow-hidden border-t border-white/5"
    >
      <div className="relative z-10 w-full max-w-[1200px]">
        {/* Header Section */}
        <div className="mb-8 md:mb-16 max-w-2xl">
          <h2 className="text-white text-2xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
            Keep SettleKar in Your Pocket®
          </h2>
          <p className="text-gray-400 text-sm md:text-lg leading-[1.6] mb-2">
            Direct property searches, instant owner contacts, and real-time listings. SettleKar puts rental convenience right at your fingertips.
          </p>
          <p className="text-gray-500 text-xs md:text-sm font-medium">
            Download our app or browse web listings to start renting today.
          </p>
        </div>

        {/* Desktop View: Action Cards Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 w-full max-w-[1200px] mb-16">
          {cards.map((card, index) => {
            const isExternal = card.actionUrl.startsWith('http');
            const LinkComponent = 'a';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                className={`group relative bg-[#111113] rounded-[32px] border border-white/5 p-8 md:p-10 min-h-[360px] w-full flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-white/15 ${card.glowColor}`}
              >
                {/* Glow Background gradient rising from bottom */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-all duration-500 group-hover:scale-105"
                  style={{
                    background: card.gradient,
                  }}
                />

                {/* Card Top: Icon and Coming Soon badge */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {card.icon}
                  </div>
                  {card.isComingSoon && (
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                      Soon
                    </span>
                  )}
                </div>

                {/* Card Middle: Text */}
                <div className="mt-12 mb-8 relative z-10">
                  <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-[15px] leading-[1.7]">
                    {card.description}
                  </p>
                </div>

                {/* Card Bottom: Action Link */}
                <div className="relative z-10">
                  <LinkComponent
                    href={card.actionUrl}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center gap-2 font-semibold text-sm ${card.accentColor} group-hover:gap-3 transition-all duration-300`}
                  >
                    {card.actionText} <span>→</span>
                  </LinkComponent>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View: Compact Vertical List */}
        <div className="flex md:hidden flex-col gap-3 w-full mb-8">
          {cards.map((card, index) => {
            const isExternal = card.actionUrl.startsWith('http');
            const isSoon = card.isComingSoon;

            if (isSoon) {
              return (
                <div
                  key={index}
                  className="relative flex items-center justify-between p-4 rounded-2xl bg-[#111113] border border-white/5 overflow-hidden opacity-60"
                >
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                      background: card.gradient,
                    }}
                  />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold tracking-tight">
                        {card.title}
                      </span>
                      <span className="text-gray-400 text-xs mt-0.5">
                        App Store (Coming Soon)
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 shrink-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                      Soon
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={index}
                href={card.actionUrl}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="relative flex items-center justify-between p-4 rounded-2xl bg-[#111113] border border-white/5 overflow-hidden transition-all duration-300 active:scale-[0.98]"
              >
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: card.gradient,
                  }}
                />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold tracking-tight">
                      {card.title}
                    </span>
                    <span className="text-gray-400 text-xs mt-0.5">
                      {index === 0 ? 'Get on Google Play Store' : 'Search Web Properties'}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 shrink-0">
                  <span className={`text-lg font-bold ${card.accentColor}`}>→</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Horizontal Badges Footer */}
        <div className="w-full h-[1px] bg-white/5 mb-8" />
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Zap size={16} className="text-[#FF8D3C]" />
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Shield size={16} className="text-[#38BDF8]" />
            <span>Verified Landlords</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <CheckCircle2 size={16} className="text-[#34D399]" />
            <span>100% Free Search</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DownloadSection;
