import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PropertyItem } from './types';
import VerificationModal from './VerificationModal';
import VideoVerificationModal from './VideoVerificationModal';

interface PropertiesTabProps {
  properties: PropertyItem[];
  triggerEditProperty: (propId: string | number) => void;
  handleDeleteProperty: (propId: string | number) => void;
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries') => void;
  handleEnableAvailability: (propId: string) => Promise<void>;
  userPhone: string;
  userId: string;
  isPhoneVerified: boolean;
  phoneVerificationDue?: string;
  onPhoneVerified?: () => void;
  onVideoSubmitted?: () => void;
  handleToggleAvailability: (propId: string, available: boolean) => Promise<void>;
}

// ── Helper: days remaining from a future ISO date ─────────────────────────────
function getDaysRemaining(isoDate?: string): number | null {
  if (!isoDate) return null;
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ── Availability expiry chip ───────────────────────────────────────────────────
function AvailabilityChip({ expiresAt, available }: { expiresAt?: string; available?: boolean }) {
  if (available === false) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
        🔴 Hidden
      </span>
    );
  }

  const daysLeft = getDaysRemaining(expiresAt);

  if (daysLeft === null) {
    // Old listing — no expiry set yet
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-text-tertiary/10 text-text-tertiary border border-border rounded-full text-[10px] font-semibold uppercase tracking-wider">
        🟡 Legacy
      </span>
    );
  }

  if (daysLeft === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
        ⏰ Expired
      </span>
    );
  }

  if (daysLeft <= 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
        ⚠️ {daysLeft}d left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success border border-success/18 rounded-full text-[10px] font-semibold uppercase tracking-wider">
      🟢 {daysLeft}d left
    </span>
  );
}

// ── Video status chip ─────────────────────────────────────────────────────────
function VideoChip({ status }: { status?: PropertyItem['videoVerificationStatus'] }) {
  if (!status || status === 'none') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-text-tertiary/10 text-text-tertiary border border-border rounded-full text-[10px] font-semibold uppercase tracking-wider">
        📹 No Video
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
        🔄 Under Review
      </span>
    );
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success border border-success/18 rounded-full text-[10px] font-bold uppercase tracking-wider">
        ✅ Video OK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
      ❌ Rejected
    </span>
  );
}

// ── Phone status chip ─────────────────────────────────────────────────────────
function PhoneChip({ isVerified, dueDate }: { isVerified: boolean; dueDate?: string }) {
  const daysLeft = getDaysRemaining(dueDate);
  if (isVerified && daysLeft !== null && daysLeft > 5) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success border border-success/18 rounded-full text-[10px] font-semibold uppercase tracking-wider">
        📱 Phone OK
      </span>
    );
  }
  if (isVerified && daysLeft !== null && daysLeft <= 5) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
        📱 Due Soon
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
      📱 Verify Now
    </span>
  );
}

const PropertiesTab: React.FC<PropertiesTabProps> = ({
  properties,
  triggerEditProperty,
  handleDeleteProperty,
  setActiveTab,
  handleEnableAvailability,
  userPhone,
  userId,
  isPhoneVerified,
  phoneVerificationDue,
  onPhoneVerified,
  onVideoSubmitted,
  handleToggleAvailability,
}) => {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [enablingId, setEnablingId] = useState<string | null>(null);

  // Verification modal states
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [modalPropertyId, setModalPropertyId] = useState<string | undefined>();
  const [modalPropertyTitle, setModalPropertyTitle] = useState<string | undefined>();

  const handleCopyUid = (id: string | number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const openPhoneModal = () => {
    setPhoneModalOpen(true);
  };

  const openVideoModal = (prop: PropertyItem) => {
    setModalPropertyId(prop.id as string);
    setModalPropertyTitle(prop.title);
    setVideoModalOpen(true);
  };

  const handleReEnable = async (propId: string) => {
    setEnablingId(propId);
    try {
      await handleEnableAvailability(propId);
    } finally {
      setEnablingId(null);
    }
  };

  return (
    <>
      <div className="space-y-6 text-left">
        <div className="mb-6 space-y-1">
          <h2 className="font-head text-xl font-bold text-text-primary tracking-tight">My Listed Properties</h2>
          <p className="text-xs text-text-secondary">Manage, verify, and control availability of your listings.</p>
        </div>

        {/* Phone verification global banner */}
        {!isPhoneVerified && (
          <div className="flex items-center justify-between gap-4 p-4 bg-warning/8 border border-warning/25 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">📱</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">Monthly Phone Verification Due</p>
                <p className="text-xs text-text-secondary">Verify your phone number to keep all listings active.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={openPhoneModal}
              className="shrink-0 px-3 py-1.5 bg-warning text-white rounded-lg text-xs font-semibold hover:bg-warning/90 transition-colors border-0 cursor-pointer"
            >
              Verify Now
            </button>
          </div>
        )}

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-elevated rounded-2xl border border-border shadow-sm">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">No Properties Listed Yet</h2>
            <p className="text-sm text-text-secondary max-w-sm mb-6">You haven't listed any property yet. Open the "List Property" tab to post your first rental!</p>
            <button className="px-4 py-2 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer" onClick={() => setActiveTab('list')}>
              Post Listing Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop: PropertyItem) => {
              const isExpiredOrHidden =
                prop.available === false ||
                (prop.availabilityExpiresAt != null &&
                  new Date(prop.availabilityExpiresAt) <= new Date());

              const remainingMs = prop.availabilityExpiresAt ? new Date(prop.availabilityExpiresAt).getTime() - Date.now() : null;
              const isWithin12Hours = remainingMs !== null && remainingMs > 0 && remainingMs <= 12 * 60 * 60 * 1000;

              return (
                <div
                  key={prop.id}
                  className={`bg-surface-elevated rounded-2xl border overflow-hidden shadow-sm flex flex-col transition-all ${
                    isExpiredOrHidden ? 'border-error/30 opacity-80' : 'border-border'
                  }`}
                >
                  {/* Property image */}
                  <button
                    type="button"
                    onClick={() => triggerEditProperty(prop.id)}
                    className="block relative h-40 overflow-hidden cursor-pointer w-full border-0 p-0"
                    title="✏️ Edit Property"
                  >
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    {isExpiredOrHidden && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-wider bg-error/80 px-3 py-1 rounded-full">Hidden from Tenants</span>
                      </div>
                    )}
                  </button>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title + badge */}
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-base font-semibold text-text-primary">
                          <button
                            type="button"
                            onClick={() => triggerEditProperty(prop.id)}
                            className="text-left hover:text-primary-accent transition-colors cursor-pointer border-0 bg-transparent p-0 font-semibold text-text-primary"
                            title="✏️ Edit Property"
                          >
                            {prop.title}
                          </button>
                        </h3>
                        <span className="px-2.5 py-0.5 bg-primary-accent/10 text-primary-accent border border-primary-accent/18 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{prop.badge}</span>
                      </div>

                      {/* UID */}
                      <div className="flex items-center gap-1.5 text-xs text-text-tertiary mb-3">
                        <span className="font-medium">UID:</span>
                        <span className="font-mono bg-surface border border-border px-1.5 py-0.5 rounded text-text-secondary">{prop.id}</span>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 text-text-tertiary font-sans text-xs"
                          onClick={() => handleCopyUid(prop.id)}
                          title="Copy Property UID"
                          aria-label="Copy Property UID"
                        >
                          {copiedId === prop.id ? (
                            <><Check size={12} className="mr-0.5" /><span>Copied</span></>
                          ) : (
                            <><Copy size={12} className="mr-0.5" /><span>Copy</span></>
                          )}
                        </button>
                      </div>

                      {/* Address */}
                      <p className="text-sm text-text-secondary mb-3 flex items-center flex-wrap gap-1.5 text-left">
                        📍 {prop.address || (prop.location && !prop.location.startsWith('http') ? prop.location : '') || prop.city}
                        {prop.location && prop.location.startsWith('http') && (
                          <a
                            href={prop.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-primary-accent bg-primary-accent/10 border border-primary-accent/18 hover:bg-primary-accent/20 px-1.5 py-0.5 rounded font-medium transition-colors no-underline"
                            title="Open Google Maps"
                          >
                            🌐 Maps
                          </a>
                        )}
                      </p>

                      {/* Livability score */}
                      {prop.overallscore !== undefined && prop.overallscore !== null && (
                        <div className="text-left mb-3">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            prop.overallscore >= 80
                              ? 'bg-success/10 text-success border-success/18'
                              : prop.overallscore >= 60
                              ? 'bg-warning/10 text-warning border-warning/18'
                              : 'bg-error/10 text-error border-error/18'
                          }`}>
                            🛡️ Livability Score: <strong>{prop.overallscore}/100</strong>
                          </div>
                        </div>
                      )}

                      {/* ── Verification status row ── */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <PhoneChip isVerified={isPhoneVerified} dueDate={phoneVerificationDue} />
                        <VideoChip status={prop.videoVerificationStatus} />
                        <AvailabilityChip expiresAt={prop.availabilityExpiresAt} available={prop.available} />
                      </div>

                      {/* ── Availability Toggle ── */}
                      <div className="flex items-center justify-between bg-surface/50 border border-border/60 rounded-xl p-3 mb-3 text-left">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-text-primary">Available for Listing</span>
                          <span className="text-[10px] text-text-tertiary">
                            {prop.available 
                              ? 'Publicly visible (Reset 7-day timer)' 
                              : 'Hidden from public search'}
                          </span>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={!!prop.available}
                            onChange={async (e) => {
                              const checked = e.target.checked;
                              setEnablingId(prop.id as string);
                              try {
                                await handleToggleAvailability(prop.id as string, checked);
                              } catch (err) {
                                console.error(err);
                              } finally {
                                setEnablingId(null);
                              }
                            }}
                            className="sr-only peer"
                            disabled={enablingId === prop.id}
                          />
                          <div className="w-9 h-5 bg-border rounded-full peer peer-focus:ring-0 dark:bg-border-light peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-accent"></div>
                        </label>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div>
                      <p className="text-xs text-text-tertiary mb-4 text-left">{prop.features}</p>

                      {/* Re-enable / Extend availability button */}
                      {(isExpiredOrHidden || isWithin12Hours) && (
                        <button
                          type="button"
                          disabled={enablingId === prop.id}
                          onClick={() => handleReEnable(prop.id as string)}
                          className="w-full mb-3 py-2 bg-success/10 hover:bg-success/20 text-success border border-success/25 hover:border-success/50 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {enablingId === prop.id 
                            ? '⏳ Updating...' 
                            : isExpiredOrHidden 
                            ? '🟢 Re-enable Availability (Reset 7-day timer)' 
                            : '🔄 Extend Availability (Reset 7-day timer)'}
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border-light">
                        <span className="text-lg font-bold text-text-primary font-mono">{prop.price}</span>
                        <div className="flex flex-wrap gap-2">
                          {/* Upload video button */}
                          <button
                            type="button"
                            disabled={prop.videoVerificationStatus === 'pending' || prop.videoVerificationStatus === 'approved'}
                            className="px-2.5 py-1.5 text-xs font-semibold text-warning hover:bg-warning/10 border border-warning/30 hover:border-warning/50 rounded-lg transition-all cursor-pointer bg-transparent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:border-warning/10"
                            onClick={() => openVideoModal(prop)}
                            aria-label={`Upload verification video for ${prop.title}`}
                            title={
                              prop.videoVerificationStatus === 'pending'
                                ? "Verification video is under review"
                                : prop.videoVerificationStatus === 'approved'
                                ? "Verification video has been approved"
                                : "Upload verification video"
                            }
                          >
                            📹 Video
                          </button>
                          <button
                            type="button"
                            className="px-2.5 py-1.5 text-xs font-semibold text-primary-accent hover:bg-primary-accent/10 border border-primary-accent/30 hover:border-primary-accent/50 rounded-lg transition-all cursor-pointer bg-transparent"
                            onClick={() => triggerEditProperty(prop.id)}
                            aria-label={`Edit ${prop.title}`}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            className="px-2.5 py-1.5 text-xs font-semibold text-error hover:bg-error/10 border border-error/30 hover:border-error/50 rounded-lg transition-all cursor-pointer bg-transparent"
                            onClick={() => handleDeleteProperty(prop.id)}
                            aria-label={`Delete ${prop.title}`}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Phone Verification Modal */}
      <VerificationModal
        isOpen={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        userId={userId}
        userPhone={userPhone}
        onPhoneVerified={() => {
          setPhoneModalOpen(false);
          onPhoneVerified?.();
        }}
      />

      {/* Video Verification Modal */}
      {modalPropertyId && modalPropertyTitle && (
        <VideoVerificationModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          propertyId={modalPropertyId}
          propertyTitle={modalPropertyTitle}
          onVideoSubmitted={() => {
            // Close modal after a delay and refresh properties list
            setTimeout(() => {
              setVideoModalOpen(false);
              onVideoSubmitted?.();
            }, 1500);
          }}
        />
      )}
    </>
  );
};

export default PropertiesTab;
