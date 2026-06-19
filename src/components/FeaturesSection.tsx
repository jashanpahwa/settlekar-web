import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Home, Zap } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
      className="relative flex flex-col justify-start items-start w-full group mx-auto"
    >
      {/* Glow Background (Crucial) */}
      <div
        className="absolute inset-0 w-full h-[260px] md:h-[300px] opacity-60 rounded-[40px] pointer-events-none transition-all duration-500 group-hover:scale-105 group-hover:opacity-85"
        style={{
          background: gradient,
          filter: 'blur(45px)',
        }}
      />

      {/* Foreground Card with Gradient Border (Crucial) */}
      <div
        className="relative self-stretch h-[260px] md:h-[300px] rounded-[40px] z-10 overflow-hidden"
        style={{
          border: '8px solid transparent',
          background: `linear-gradient(#1A1A1C, #1A1A1C) padding-box, ${gradient} border-box`,
        }}
      >
        {/* Content Inner Layout */}
        <div className="w-full h-full p-7 flex flex-col justify-between select-none">
          <div className="text-white/90">
            {icon}
          </div>
          <div className="flex-grow flex flex-col justify-end mt-4">
            <h3 className="text-white font-medium text-xl mb-2 tracking-tight">
              {title}
            </h3>
            <p className="text-gray-400 text-[14px] leading-[1.6] font-normal selection:bg-white/20">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const cardsData = [
    {
      title: 'Map Search',
      description: 'Find rental properties with our interactive map. View exact locations, filter by proximity, and easily locate your next home.',
      icon: <MapPin size={32} strokeWidth={2.5} />,
      gradient: 'linear-gradient(137deg, #FF3D77 0%, #FFB1CE 45%, #FF9D3C 100%)',
      delay: 0.1,
    },
    {
      title: 'List Property',
      description: 'Easily list your rental property in minutes. Reach thousands of verified tenants actively looking for their next home.',
      icon: <Home size={32} strokeWidth={2.5} />,
      gradient: 'linear-gradient(137deg, #FFFFFF 0%, #7DD3FC 45%, #06B6D4 100%)',
      delay: 0.2,
    },
    {
      title: 'Rental Platform',
      description: "India's first dedicated rental-only marketplace. Designed to bridge the gap between landlords and tenants seamlessly.",
      icon: <Zap size={32} strokeWidth={2.5} />,
      gradient: 'linear-gradient(137deg, #4361EE 0%, #E0AEFF 45%, #F72585 100%)',
      delay: 0.3,
    },
  ];

  return (
    <section className="relative w-full bg-[#0A0A0B] py-24 px-6 md:px-12 flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1200px] mb-12 text-center">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
          Features
        </span>
        <h2 className="text-white text-3xl md:text-4xl font-bold mt-4 tracking-tight">
          Why Choose SettleKar?
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
          India's 1st rental-only platform designed to simplify your home finding journey.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-8 w-full max-w-[1200px]">
        {cardsData.map((card, index) => (
          <FeatureCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            gradient={card.gradient}
            delay={card.delay}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
