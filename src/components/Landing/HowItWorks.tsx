import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Phone, Key, PlusCircle, Camera, CheckCircle2, ArrowRight } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const tenantSteps: Step[] = [
  {
    number: '01',
    title: 'Explore Map',
    description: 'Browse verified rental listings directly on the interactive map. Filter by budget, rooms, and local amenities.',
    icon: <Search size={28} className="text-blue-400" />,
  },
  {
    number: '02',
    title: 'Connect Direct',
    description: "Get the property owner's contact details instantly. Zero brokers, zero commission, and zero hidden registration fees.",
    icon: <Phone size={28} className="text-emerald-400" />,
  },
  {
    number: '03',
    title: 'Move In',
    description: 'Schedule property visits directly, finalize details, sign your rental agreement, and settle in your new home.',
    icon: <Key size={28} className="text-amber-400" />,
  },
];

const ownerSteps: Step[] = [
  {
    number: '01',
    title: 'Quick Listing',
    description: 'Post your rental property in under 5 minutes. Enter pricing, set location on the map, and specify amenities.',
    icon: <PlusCircle size={28} className="text-purple-400" />,
  },
  {
    number: '02',
    title: 'Upload Media',
    description: 'Upload high-quality indoor and outdoor photos of your property. Help renters visualize their future home.',
    icon: <Camera size={28} className="text-pink-400" />,
  },
  {
    number: '03',
    title: 'Close Deal',
    description: 'Receive direct phone calls and inquiries from verified tenants. Finalize deals without paying commissions.',
    icon: <CheckCircle2 size={28} className="text-teal-400" />,
  },
];

const HowItWorks: React.FC = () => {
  const [role, setRole] = useState<'tenant' | 'owner'>('tenant');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = role === 'tenant' ? tenantSteps : ownerSteps;

  // Reset index and scroll on tab toggle
  useEffect(() => {
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0 });
    }
  }, [role]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const percentage = scrollLeft / maxScroll;
    const index = Math.round(percentage * 2);
    setActiveIndex(index);
  };

  return (
    <section className="relative w-full bg-[#0A0A0B] py-20 px-6 md:px-12 flex flex-col items-center justify-center font-sans overflow-hidden border-t border-white/5">
      {/* Hide scrollbars style */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
            Process Flow
          </span>
          <h2 className="text-white text-3xl md:text-5xl font-bold mt-4 tracking-tight">
            How SettleKar Works
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
            A simple, transparent step-by-step journey designed for direct renting.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="relative flex bg-[#121214] p-1 rounded-full border border-white/5 mb-16 select-none w-full max-w-[400px] mx-auto">
          <button
            onClick={() => setRole('tenant')}
            className={`flex-1 text-center py-3 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 cursor-pointer ${
              role === 'tenant' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            For Tenants
          </button>
          <button
            onClick={() => setRole('owner')}
            className={`flex-1 text-center py-3 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 cursor-pointer ${
              role === 'owner' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            For Owners / Brokers
          </button>
          {/* Sliding pill background indicator */}
          <motion.div
            className="absolute top-1 bottom-1 left-1 bg-white/10 rounded-full border border-white/10"
            animate={{
              x: role === 'tenant' ? '0%' : '100%',
            }}
            style={{
              width: 'calc(50% - 4px)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Steps Flow Container (Horizontal Swipeable Carousel on Mobile, Grid on Desktop) */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full flex lg:grid lg:grid-cols-5 items-center gap-6 lg:gap-0 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none scroll-smooth pb-4 no-scrollbar"
        >
          <AnimatePresence mode="wait">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <React.Fragment key={`${role}-${step.number}`}>
                  {/* Step Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                    className="w-[85vw] max-w-[340px] lg:w-auto lg:max-w-none shrink-0 snap-center lg:snap-align-none lg:col-span-1 bg-[#121214] border border-white/5 rounded-[28px] p-8 flex flex-col justify-between min-h-[260px] relative group hover:border-white/10 transition-all duration-300"
                  >
                    {/* Background glow lines */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 to-blue-500/2 opacity-0 group-hover:opacity-100 rounded-[28px] transition-all duration-500 pointer-events-none" />

                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {step.icon}
                      </div>
                      <span className="text-3xl font-extrabold text-white/5 tracking-wider">
                        {step.number}
                      </span>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 text-[15px] leading-[1.7]">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Flow Arrow (Only on Desktop, Hidden on Mobile) */}
                  {!isLast && (
                    <div className="hidden lg:flex lg:col-span-1 items-center justify-center py-0">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.3 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-1.5 text-gray-500"
                      >
                        <div className="w-8 h-[2px] bg-gradient-to-r from-gray-500 to-transparent" />
                        <ArrowRight size={18} />
                        <div className="w-8 h-[2px] bg-gradient-to-l from-gray-500 to-transparent" />
                      </motion.div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Carousel Dot Indicators for Mobile */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-4 relative z-10">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!containerRef.current) return;
                const { scrollWidth, clientWidth } = containerRef.current;
                const maxScroll = scrollWidth - clientWidth;
                containerRef.current.scrollTo({
                  left: (maxScroll / 2) * idx,
                  behavior: 'smooth',
                });
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex ? 'bg-blue-400 w-5' : 'bg-gray-600 w-2.5'
              }`}
              aria-label={`Go to step slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
