import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Phone, Key, PlusCircle, Camera, CheckCircle2 } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
}

const tenantSteps: Step[] = [
  {
    number: '01',
    title: 'Explore Map',
    description: 'Browse verified rental listings directly on the interactive map. Filter by budget, rooms, and local amenities.',
    icon: <Search size={28} className="text-blue-400" />,
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  {
    number: '02',
    title: 'Connect Direct',
    description: "Get the property owner's contact details instantly. Zero brokers, zero commission, and zero hidden registration fees.",
    icon: <Phone size={28} className="text-emerald-400" />,
    glowColor: 'rgba(16, 185, 129, 0.3)',
  },
  {
    number: '03',
    title: 'Move In',
    description: 'Schedule property visits directly, finalize details, sign your rental agreement, and settle in your new home.',
    icon: <Key size={28} className="text-amber-400" />,
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
];

const ownerSteps: Step[] = [
  {
    number: '01',
    title: 'Quick Listing',
    description: 'Post your rental property in under 5 minutes. Enter pricing, set location on the map, and specify amenities.',
    icon: <PlusCircle size={28} className="text-purple-400" />,
    glowColor: 'rgba(168, 85, 247, 0.3)',
  },
  {
    number: '02',
    title: 'Upload Media',
    description: 'Upload high-quality indoor and outdoor photos of your property. Help renters visualize their future home.',
    icon: <Camera size={28} className="text-pink-400" />,
    glowColor: 'rgba(236, 72, 153, 0.3)',
  },
  {
    number: '03',
    title: 'Close Deal',
    description: 'Receive direct phone calls and inquiries from verified tenants. Finalize deals without paying commissions.',
    icon: <CheckCircle2 size={28} className="text-teal-400" />,
    glowColor: 'rgba(20, 184, 166, 0.3)',
  },
];

const HowItWorks: React.FC = () => {
  const [role, setRole] = useState<'tenant' | 'owner'>('tenant');

  const steps = role === 'tenant' ? tenantSteps : ownerSteps;

  return (
    <section className="relative w-full bg-[#0A0A0B] py-24 px-6 md:px-12 flex flex-col items-center justify-center font-sans overflow-hidden border-t border-white/5">
      {/* Dynamic Style Injection for Flow Line Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .flow-line {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981, #3b82f6);
          background-size: 200% 100%;
          animation: flow 6s linear infinite;
        }
        .flow-line-vertical {
          background: linear-gradient(180deg, #3b82f6, #8b5cf6, #10b981, #3b82f6);
          background-size: 100% 200%;
          animation: flow 6s linear infinite;
        }
      `}} />

      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-3xl md:text-5xl font-bold mt-4 tracking-tight">
            How SettleKar Works
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
            A simple, transparent step-by-step journey designed for direct renting.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="relative flex bg-[#121214] p-1 rounded-full border border-white/5 mb-20 select-none w-full max-w-[400px] mx-auto shadow-inner">
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

        {/* Flowchart Outer Wrapper */}
        <div className="w-full relative px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* DESKTOP FLOWCHART (lg and up) */}
              <div className="hidden lg:grid lg:grid-cols-3 relative w-full gap-8 py-8">
                {/* Horizontal flow line connecting the step nodes */}
                <div className="absolute top-[48px] left-[16.6%] right-[16.6%] h-[3px] flow-line opacity-40 z-0 pointer-events-none rounded-full" />
                
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center text-center relative z-10 group">
                    
                    {/* Node Circle Container */}
                    <div className="relative w-24 h-24 rounded-full bg-[#121214] border-2 border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-white/30 group-hover:scale-105">
                      
                      {/* Glow effect under the node */}
                      <div 
                        className="absolute inset-0 rounded-full blur-[20px] opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" 
                        style={{ background: step.glowColor }}
                      />
                      
                      {/* Icon */}
                      <div className="relative z-10 text-white transition-transform duration-500 group-hover:scale-110">
                        {step.icon}
                      </div>

                      {/* Floating Step Number */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1A1A1C] border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="mt-8 max-w-[280px]">
                      <h3 className="text-white font-bold text-lg mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-[1.6] select-none">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* MOBILE/TABLET FLOWCHART (under lg) */}
              <div className="flex lg:hidden flex-col gap-12 relative pl-8 py-4 max-w-[500px] mx-auto">
                {/* Vertical flow line connecting step nodes */}
                <div className="absolute left-[24px] top-6 bottom-6 w-[3px] flow-line-vertical opacity-40 z-0 pointer-events-none rounded-full" />

                {steps.map((step) => (
                  <div key={step.number} className="flex flex-row items-start relative z-10 gap-6 group">
                    {/* Node Circle */}
                    <div className="relative w-12 h-12 shrink-0 rounded-full bg-[#121214] border-2 border-white/10 flex items-center justify-center">
                      
                      {/* Glow effect */}
                      <div 
                        className="absolute inset-0 rounded-full blur-[10px] opacity-40 pointer-events-none"
                        style={{ background: step.glowColor }}
                      />

                      {/* Icon inside Node */}
                      <div className="relative z-10 text-white scale-90">
                        {step.icon}
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex flex-col">
                      <span className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-1">
                        Step {step.number}
                      </span>
                      <h3 className="text-white font-bold text-base mb-1 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed select-none">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
