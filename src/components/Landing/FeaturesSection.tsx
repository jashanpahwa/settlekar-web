import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Home, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
  to: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient,
  to,
}) => {
  return (
    <motion.div
   
      viewport={{ once: true }}
     
      className="feature-card-wrapper relative flex flex-col justify-start items-start w-full group mx-auto"
    >
      <Link
        to={to}
        className="w-full h-full block relative no-underline animate-none"
        onClick={(e) => {
          if (to === '/' && window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
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
          className="relative self-stretch h-[260px] md:h-[300px] rounded-[40px] z-10 overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
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
              <h3 className="text-white font-semibold text-xl mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-gray-300 text-[15px] leading-[1.7] font-normal selection:bg-white/20">
                {description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const cardsData = [
    {
      title: 'Map Search',
      description: 'Find rental properties with our interactive map. View exact locations, filter by proximity, and easily locate your next home.',
      Icon: MapPin,
      gradient: 'linear-gradient(137deg, #FF3D77 0%, #FFB1CE 45%, #FF9D3C 100%)',
      delay: 0.1,
      to: '/search',
      glowColor: 'rgba(255, 61, 119, 0.35)',
    },
    {
      title: 'List Property',
      description: 'Easily list your rental property in minutes. Reach thousands of verified tenants actively looking for their next home.',
      Icon: Home,
      gradient: 'linear-gradient(137deg, #FFFFFF 0%, #7DD3FC 45%, #06B6D4 100%)',
      delay: 0.2,
      to: '/dashboard',
      glowColor: 'rgba(125, 211, 252, 0.35)',
    },
    {
      title: 'Rental Platform',
      description: "India's first dedicated rental-only marketplace. Designed to bridge the gap between landlords and tenants seamlessly.",
      Icon: Zap,
      gradient: 'linear-gradient(137deg, #4361EE 0%, #E0AEFF 45%, #F72585 100%)',
      delay: 0.3,
      to: '/',
      glowColor: 'rgba(67, 97, 238, 0.35)',
    },
  ];

  return (
    <section className="relative w-full bg-[#0A0A0B] py-16 md:py-24 px-6 md:px-12 flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1200px] mb-12 md:mb-16 text-center">
        <h2 className="text-white text-3xl md:text-5xl font-bold mt-4 tracking-tight">
          Why Choose SettleKar?
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-3 max-w-xl mx-auto">
          India's 1st rental-only platform designed to simplify your home finding journey.
        </p>
      </div>

      {/* DESKTOP VIEW: Grid Layout (md and up) */}
      <div className="relative z-10 hidden md:grid md:grid-cols-3 gap-8 w-full max-w-[1200px]">
        {cardsData.map((card, index) => (
          <FeatureCard
            key={index}
            title={card.title}
            description={card.description}
            icon={<card.Icon size={32} strokeWidth={2.5} />}
            gradient={card.gradient}
            delay={card.delay}
            to={card.to}
          />
        ))}
      </div>

      {/* MOBILE VIEW: Compact Vertical Stack (under md) */}
      <div className="flex md:hidden flex-col gap-5 w-full max-w-[400px] mx-auto z-10 animate-none">
        {cardsData.map((card, index) => (
          <motion.div
            key={index}
           
            className="relative w-full group mx-auto"
          >
            <Link
              to={card.to}
              onClick={(e) => {
                if (card.to === '/' && window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="w-full h-[150px] block relative no-underline"
            >
              {/* Glow Background */}
              <div
                className="absolute inset-0 w-full h-[150px] opacity-60 rounded-[30px] pointer-events-none transition-all duration-500 group-hover:scale-105 group-hover:opacity-85"
                style={{
                  background: card.gradient,
                  filter: 'blur(30px)',
                }}
              />

              {/* Foreground Card with Gradient Border */}
              <div
                className="relative self-stretch h-[150px] rounded-[30px] z-10 overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                style={{
                  border: '5px solid transparent',
                  background: `linear-gradient(#1A1A1C, #1A1A1C) padding-box, ${card.gradient} border-box`,
                }}
              >
                {/* Content Inner Layout */}
                <div className="w-full h-full p-5 flex flex-row items-start gap-4 select-none">
                  {/* Icon */}
                  <div className="text-white shrink-0 mt-0.5">
                    <card.Icon size={24} strokeWidth={2.5} />
                  </div>
                  {/* Text details */}
                  <div className="flex flex-col justify-start">
                    <h3 className="text-white font-semibold text-base mb-1 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
