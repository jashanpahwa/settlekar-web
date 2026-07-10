import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Download, Building2, Home, Send, CheckCircle2, Link2 } from 'lucide-react';

interface PropertySidebarProps {
  ownerName?: string;
  listedByRole?: string | null;
  // Inquiry form
  name: string;
  phone: string;
  message: string;
  sending: boolean;
  sent: boolean;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onInquirySubmit: (e: React.FormEvent) => void;
  // Share
  copied: boolean;
  onShare: () => void;
}

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.settlekar';

const PropertySidebar: React.FC<PropertySidebarProps> = ({
  ownerName,
  listedByRole,
  name,
  phone,
  message,
  sending,
  sent,
  onNameChange,
  onPhoneChange,
  onMessageChange,
  onInquirySubmit,
  copied,
  onShare,
}) => {
  const isBroker = listedByRole?.toLowerCase() === 'broker';

  return (
    <motion.div
      className="sticky top-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Card 1 — CTA Card */}
      <div className="bg-gradient-to-br from-[#0A2540] to-[#1a3a5c] rounded-2xl p-6 text-white mb-4 shadow-lg shadow-slate-900/15">
        <h3 className="text-lg font-extrabold mb-1">Interested in this property?</h3>
        <p className="text-[0.8rem] text-white/60 mb-5">
          Contact the owner directly — zero brokerage.
        </p>

        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/30 transition-all duration-200 no-underline mb-2.5"
        >
          <Smartphone size={16} />
          Open in SettleKar App
        </a>

        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-white/8 text-white/85 text-[0.86rem] font-semibold border border-white/15 rounded-xl hover:bg-white/15 transition-colors no-underline"
        >
          <Download size={16} />
          Download App
        </a>

        {ownerName && (
          <>
            <div className="border-t border-white/12 my-4" />
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] rounded-full bg-[#0A2540] flex items-center justify-center text-white font-bold text-base shrink-0">
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold">{ownerName}</div>
                <div className="flex items-center gap-1 text-xs text-white/50">
                  {isBroker ? (
                    <>
                      <Building2 size={12} />
                      Broker
                    </>
                  ) : (
                    <>
                      <Home size={12} />
                      Property Owner
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card 2 — Inquiry Form */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(15,23,42,0.06),0_4px_20px_rgba(15,23,42,0.03)] border border-slate-100 mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4">
          <Send size={16} className="text-[#0A2540]" />
          Send an Inquiry
        </div>

        {sent ? (
          <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm font-semibold">
            <CheckCircle2 size={20} className="mx-auto mb-1.5" />
            Your inquiry has been sent successfully!
          </div>
        ) : (
          <form onSubmit={onInquirySubmit}>
            <div className="mb-3">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/10 focus:bg-white transition-all"
              />
            </div>

            <div className="mb-3">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="Your phone number"
                required
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/10 focus:bg-white transition-all"
              />
            </div>

            <div className="mb-3">
              <label className="text-[0.72rem] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="I'm interested in this property…"
                rows={3}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none focus:border-[#0A2540] focus:ring-2 focus:ring-[#0A2540]/10 focus:bg-white transition-all resize-y min-h-20"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-[#0A2540] hover:bg-[#11385f] text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {sending ? 'Sending…' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>

      {/* Card 3 — Share Card */}
      <div className="bg-white rounded-2xl px-5 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.06)] border border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[0.82rem] font-semibold text-slate-400">Share this listing</span>
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[0.8rem] font-semibold text-slate-600 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 size={14} />
              Copied!
            </>
          ) : (
            <>
              <Link2 size={14} />
              Share Link
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PropertySidebar;
