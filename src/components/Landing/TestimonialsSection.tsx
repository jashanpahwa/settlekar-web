import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  avatar: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Tenant in Bangalore',
    comment: 'Finding a flat in Koramangala was a breeze with SettleKar. I contacted the owner directly, scheduled a visit, and closed the deal in 2 days. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Property Owner in Mumbai',
    comment: 'As a landlord, I was tired of paying huge brokerage fees. SettleKar connected me with genuine, verified tenants directly. The listing process took less than 5 minutes!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 3,
    name: 'Amit Desai',
    role: 'Tenant in Pune',
    comment: 'The location-based search is a lifesaver. I wanted a 1 BHK near my office in Viman Nagar and the interactive map took me straight to the best available listings nearby.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const current = testimonialsData[currentIndex];

  return (
    <section className="w-full bg-[#0A0A0B] py-20 px-6 md:px-12 flex flex-col items-center justify-center font-sans overflow-hidden">
       {/* Decorative ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-[1200px] bg-[#EAEAEA] rounded-[32px] p-8 md:p-16 flex flex-col justify-between min-h-[460px] md:min-h-[420px] relative"
      >
        
        {/* Top Header Row */}
        <div className="w-full">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest block mb-4 select-none">
            Customer Feedback
          </span>
          <div className="w-full h-[1px] bg-gray-300/60 mb-8" />
        </div>

        {/* Testimonial Quote Block */}
        <div className="relative flex-grow flex items-center justify-start overflow-hidden py-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative"
            >
              <blockquote className="text-gray-800 text-xl sm:text-2xl md:text-4xl lg:text-4xl font-normal leading-[1.5] md:leading-[1.3] tracking-tight relative max-w-[1000px] select-text pr-10">
                <span className="text-gray-400 font-serif mr-1">«</span>
                {current.comment}
                {/* Visual fade-out mask to replicate premium edge truncation look */}
                <span className="absolute bottom-0 right-0 h-8 w-24 bg-gradient-to-r from-transparent to-[#EAEAEA] pointer-events-none" />
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation & Profile Row */}
        <div className="w-full mt-6">
          <div className="w-full h-[1px] bg-gray-300/60 mb-6" />
          
          <div className="flex items-center justify-between">
            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                loading="lazy"
              />
              <div>
                <h4 className="text-gray-900 font-semibold text-sm md:text-base">
                  {current.name}
                </h4>
                <p className="text-gray-500 text-xs md:text-sm">
                  {current.role}
                </p>
              </div>
            </div>

            {/* Dot indicators for mobile view, buttons for desktop */}
            <div className="flex items-center gap-4">
              {/* Dot Indicators */}
              <div className="flex gap-1.5 items-center">
                {testimonialsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex ? 'bg-gray-800 w-4' : 'bg-gray-400 w-2'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Slider Arrow Controls (hidden on mobile for thumb friendliness, visible on md and up) */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full bg-gray-300/40 hover:bg-gray-300/80 active:scale-95 flex items-center justify-center text-gray-700 transition-all duration-200 cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-gray-300/40 hover:bg-gray-300/80 active:scale-95 flex items-center justify-center text-gray-700 transition-all duration-200 cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
