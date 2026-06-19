import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simulate API request success
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setRole('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#F4F4F6] text-black w-full max-w-[620px] rounded-[36px] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] z-10 border border-white/10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 active:scale-95 flex items-center justify-center transition-colors cursor-pointer text-black"
              aria-label="Close form"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-black mt-2">Thank you!</h3>
                <p className="text-black/60 text-sm max-w-xs mx-auto leading-relaxed">
                  Your message has been received. We'll be in touch with you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Header info matching screenshots styling */}
                <div className="text-center mb-4">
                  <h2 className="text-2xl md:text-3.5xl font-normal leading-[1.3] text-black tracking-tight select-text">
                    <span className="italic font-serif">Let's grow!</span> Fill in the form <br />
                    and we'll be in touch
                  </h2>
                  <p className="text-black/50 text-xs md:text-sm mt-3 tracking-wide select-text">
                    Ask us about SettleKar's direct listing verification or premium plans
                  </p>
                </div>

                {/* Form fields (Minimal underline style) */}
                <div className="flex flex-col gap-8">
                  {/* Name field */}
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-black/75 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Who's reaching out?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-black/10 py-2.5 text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors text-sm font-medium"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-black/75 uppercase tracking-wider mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Where can we reach you?"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-black/10 py-2.5 text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors text-sm font-medium"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-black/75 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Best number to call you on?"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-black/10 py-2.5 text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors text-sm font-medium"
                    />
                  </div>

                  {/* Role field (Instead of Farm/Company) */}
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-black/75 uppercase tracking-wider mb-1">
                      Role / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="Are you an Owner, Tenant, or Broker?"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-transparent border-b border-black/10 py-2.5 text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors text-sm font-medium"
                    />
                  </div>

                  {/* Message field (Tell Us More) */}
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-black/75 uppercase tracking-wider mb-1">
                      Tell Us More
                    </label>
                    <input
                      type="text"
                      placeholder="What would you like to discuss with us?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent border-b border-black/10 py-2.5 text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full max-w-[200px] mx-auto bg-black text-white hover:bg-black/85 active:scale-95 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 block mt-6 cursor-pointer"
                >
                  Send Message
                </button>

              </form>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
