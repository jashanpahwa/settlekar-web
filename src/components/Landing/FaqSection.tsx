import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface CategoryData {
  id: string;
  label: string;
  faqs: FaqItem[];
}

const faqCategories: CategoryData[] = [
  {
    id: 'general',
    label: 'General',
    faqs: [
      {
        question: 'Is SettleKar free to use for tenants?',
        answer: 'Yes, SettleKar is 100% free for tenants! You can browse listings, filter by amenities, and connect with verified property owners directly without paying a single rupee of brokerage.',
      },
      {
        question: 'What cities does SettleKar cover?',
        answer: 'Currently, SettleKar is active across major tech hubs and metropolitan cities in India, including Bangalore, Mumbai, Pune, Delhi NCR, and Hyderabad, with plans to expand rapidly.',
      },
      {
        question: 'What types of properties can I find on SettleKar?',
        answer: 'SettleKar is a dedicated rental-only platform. You can find independent houses, 1/2/3/4 BHK apartments, studio flats, coliving spaces, and PG accommodations listed directly by owners.',
      },
      {
        question: 'Do I need to create an account to search for properties?',
        answer: 'No, you can browse and search for properties on our interactive map without creating an account. However, to contact owners directly or save properties to your wishlist, you will need to sign in quickly.',
      },
    ],
  },
  {
    id: 'owners',
    label: 'For Landlords',
    faqs: [
      {
        question: 'How do I list my property as a landlord?',
        answer: "Simply download the SettleKar mobile app, sign up as an Owner, click 'Post Listing', fill in your property details, upload photos, and select your preferred listing plan. Your property will go live instantly!",
      },
      {
        question: 'Are there charges for listing property?',
        answer: 'We offer multiple plans for property owners, including free basic listings and affordable premium featured options to boost visibility and reach verified tenants faster.',
      },
      {
        question: 'How long does it take for my property listing to go live?',
        answer: 'Once you complete your profile and submit your property listing with details and photos, it undergoes an automated verification check. Typically, listings go live within 5 to 15 minutes!',
      },
      {
        question: 'Can I edit my property listing after posting it?',
        answer: 'Yes, absolutely! You can edit any details of your property listing (price, photos, amenities, description) at any time through the SettleKar mobile app.',
      },
    ],
  },
  {
    id: 'trust',
    label: 'Trust & Safety',
    faqs: [
      {
        question: 'Are the property owners and listings verified?',
        answer: 'Yes! We require all landlords to verify their profiles. We also run automated check filters on listed properties and encourage user reporting to maintain a high-quality, authentic marketplace.',
      },
      {
        question: 'How do I connect with landlords safely?',
        answer: 'You can view contact details and connect with verified property owners directly. SettleKar recommends inspecting the property personally before making any rental deposits or signing agreements.',
      },
      {
        question: 'How does SettleKar protect me from fake listings?',
        answer: 'We employ landlord profile checks, map location validations, and automatic listing anomaly detection. Users can also report suspicious listings directly, which are reviewed by our moderation team within 24 hours.',
      },
      {
        question: 'Is direct communication between tenants and owners private?',
        answer: 'Yes, SettleKar facilitates direct connection between you and the property owner. We do not share your private contact information without your permission, and you can communicate securely.',
      },
    ],
  },
];

const FaqSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const currentCategory = faqCategories.find((cat) => cat.id === activeTab) || faqCategories[0];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full bg-[#0A0A0B] py-20 px-6 md:px-12 flex flex-col items-center justify-center font-sans overflow-hidden border-t border-white/5">
      {/* Dynamic Style Injection to hide scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="relative z-10 w-full max-w-[1200px]">
        {/* Top Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-7">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/80 tracking-wider uppercase mb-6 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              FAQ
            </div>
            
            <h2 className="text-white text-3xl md:text-5xl font-semibold leading-[1.15] tracking-tight max-w-[580px]">
              Answers to the questions that come up most.
            </h2>
          </div>
          
          <div className="lg:col-span-5 lg:pt-14">
            <p className="text-gray-400 text-sm md:text-base leading-[1.6]">
              Learn how SettleKar works, how the listing and rental search process flows, and what you can expect when finding your next direct home.
            </p>
          </div>
        </div>

        {/* FAQ Interactive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Menu Tabs & Support CTA */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Tab Menu Card (Horizontal Swipe Strip on Mobile, Vertical on Desktop) */}
            <div className="bg-[#121214] border border-white/5 rounded-[28px] p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-1 w-full">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveTab(category.id);
                    setOpenIndex(null);
                  }}
                  className={`relative shrink-0 text-center lg:text-left px-5 py-3 lg:px-6 lg:py-4 rounded-[20px] text-xs lg:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === category.id
                      ? 'text-white bg-white/10 border border-white/5 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* "Got Questions?" CTA Card */}
            <div className="bg-[#121214] border border-white/5 rounded-[28px] p-8 flex flex-col items-start gap-4">
              <h3 className="text-white font-semibold text-xl">
                Got Questions?
              </h3>
              <p className="text-gray-400 text-[14px] leading-[1.6]">
                Need help with something? Our team is here to make things easy. Don't hesitate to reach out.
              </p>
              <a
                href="mailto:support@settlekar.com"
                className="inline-flex items-center gap-2 text-white font-semibold text-[14px] hover:gap-3 transition-all duration-300 mt-2 hover:text-blue-400"
              >
                Email us <ArrowRight size={16} />
              </a>
            </div>

          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {currentCategory.faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="group relative bg-[#121214] border border-white/5 rounded-[24px] overflow-hidden transition-all duration-300 hover:border-white/15"
                >
                  {/* Subtle inner hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Header Button */}
                  <button
                    onClick={() => handleToggle(index)}
                    className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-6 cursor-pointer relative z-10"
                  >
                    <span className="text-white font-semibold text-base md:text-lg group-hover:text-white transition-colors duration-200">
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 ${
                        isOpen ? 'bg-white/10 border-white/20 text-white rotate-180' : 'group-hover:border-white/20 group-hover:text-white'
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Accordion Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 md:px-8 pb-6 text-gray-300 text-[15px] md:text-base leading-[1.7] relative z-10 border-t border-white/5 pt-4 selection:bg-white/20">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FaqSection;
