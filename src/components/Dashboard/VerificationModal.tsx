import React, { useState, useEffect, useRef } from 'react';
import { verificationService, destroyRecaptcha } from '../../services/verificationService';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userPhone: string;
  onPhoneVerified?: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  userId,
  userPhone,
  onPhoneVerified,
}) => {
  // ── Phone OTP state ──────────────────────────────────────────────────
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [recaptchaSolved, setRecaptchaSolved] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setOtpSent(false);
      setOtpCode('');
      setOtpCountdown(0);
      setPhoneError('');
      setPhoneSuccess(false);
      setRecaptchaSolved(false);
      destroyRecaptcha();
    }
  }, [isOpen]);

  // Render reCAPTCHA when modal is active and OTP hasn't been sent yet
  useEffect(() => {
    if (!isOpen || otpSent || phoneSuccess) return;
    if (!recaptchaContainerRef.current) return;

    setRecaptchaSolved(false);
    verificationService.setupVisibleRecaptcha(
      recaptchaContainerRef.current,
      () => setRecaptchaSolved(true),
      () => setRecaptchaSolved(false),
    );

    return () => { destroyRecaptcha(); };
  }, [isOpen, otpSent, phoneSuccess]);

  if (!isOpen) return null;

  // ── Phone number normalization ────────────────────────────────────────
  const normalizeToE164 = (phone: string): string | null => {
    const cleaned = phone.replace(/[\s\-().]/g, '');
    if (/^\+91\d{10}$/.test(cleaned)) return cleaned;
    if (/^\+\d{12}$/.test(cleaned)) return cleaned;
    if (/^91\d{10}$/.test(cleaned)) return `+${cleaned}`;
    if (/^0\d{10}$/.test(cleaned)) return `+91${cleaned.slice(1)}`;
    if (/^\d{10}$/.test(cleaned)) return `+91${cleaned}`;
    return null;
  };

  const normalizedPhone = normalizeToE164(userPhone);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    setPhoneError('');

    if (!normalizedPhone) {
      setPhoneError(`Cannot send OTP: "${userPhone}" is not a valid phone number. Please update with a valid 10-digit mobile number.`);
      return;
    }
    if (!recaptchaSolved) {
      setPhoneError('Please complete the reCAPTCHA verification above first.');
      return;
    }

    setPhoneSending(true);
    try {
      const result = await verificationService.sendPhoneOTP(normalizedPhone);
      if (result.success) {
        setOtpSent(true);
        setOtpCountdown(60);
      } else {
        setPhoneError(result.error || 'Failed to send OTP.');
        setRecaptchaSolved(false);
      }
    } catch (err: any) {
      setPhoneError(err.message || 'Unexpected error sending OTP.');
      setRecaptchaSolved(false);
    } finally {
      setPhoneSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      setPhoneError('Please enter the 6-digit OTP.');
      return;
    }
    setPhoneError('');
    setPhoneVerifying(true);
    try {
      const result = await verificationService.confirmPhoneOTP(otpCode, userId, userPhone);
      if (result.success) {
        setPhoneSuccess(true);
        onPhoneVerified?.();
      } else {
        setPhoneError(result.error || 'OTP verification failed.');
      }
    } catch (err: any) {
      setPhoneError(err.message || 'Unexpected error verifying OTP.');
    } finally {
      setPhoneVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface-elevated border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-head text-lg font-bold text-text-primary">Phone Verification</h2>
            <p className="text-xs text-text-secondary mt-0.5">Verify your mobile number to keep your listings active</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-border-light text-text-tertiary transition-colors border-0 bg-transparent cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-5">
            <div className="bg-primary-accent/5 border border-primary-accent/18 rounded-xl p-4 text-sm text-text-secondary leading-relaxed">
              Verify your mobile number once every <strong className="text-text-primary">30 days</strong>. An OTP will be sent to your registered number.
            </div>

            {phoneSuccess ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-full flex items-center justify-center text-3xl">✅</div>
                <h3 className="font-head text-base font-bold text-text-primary">Phone Verified!</h3>
                <p className="text-sm text-text-secondary">Your phone number is verified for the next 30 days.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-primary-accent text-white rounded-xl text-sm font-semibold hover:bg-primary-accent/90 transition-colors cursor-pointer border-0"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Phone number display */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Registered Phone Number
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 bg-surface border rounded-xl ${normalizedPhone ? 'border-border' : 'border-error/40 bg-error/5'}`}>
                    <span className="text-lg">📱</span>
                    <div className="flex flex-col min-w-0">
                      {normalizedPhone ? (
                        <>
                          <span className="font-mono text-sm text-text-primary font-semibold">{normalizedPhone}</span>
                          {normalizedPhone !== userPhone && (
                            <span className="text-[10px] text-text-tertiary mt-0.5">Stored as: {userPhone}</span>
                          )}
                        </>
                      ) : (
                        <span className="font-mono text-sm text-error font-semibold">{userPhone || 'No phone registered'}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs text-text-tertiary shrink-0">Read-only</span>
                  </div>
                  {!normalizedPhone && userPhone && (
                    <p className="text-xs text-error mt-1.5">
                      ⚠️ Invalid format. Please update your profile with a valid 10-digit mobile number.
                    </p>
                  )}
                  {!userPhone && (
                    <p className="text-xs text-error mt-1.5">
                      ⚠️ No phone number found. Please update your profile first.
                    </p>
                  )}
                </div>

                {/* Visible reCAPTCHA widget */}
                {!otpSent && (
                  <div className="flex justify-center my-3 min-h-[78px]">
                    <div ref={recaptchaContainerRef} id="recaptcha-container" />
                  </div>
                )}

                {/* OTP input */}
                {otpSent && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="_ _ _ _ _ _"
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl font-mono text-lg text-center text-text-primary tracking-[0.5em] focus:outline-none focus:border-primary-accent/50 focus:ring-2 focus:ring-primary-accent/10 transition-all"
                    />
                    {otpCountdown > 0 && (
                      <p className="text-xs text-text-tertiary mt-2 text-center">
                        OTP expires in <strong className="text-text-secondary">{otpCountdown}s</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* Error */}
                {phoneError && (
                  <div className="p-3 bg-error/8 border border-error/20 rounded-xl text-sm text-error">
                    ⚠️ {phoneError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={phoneSending || !normalizedPhone || !recaptchaSolved}
                      className="w-full py-3 bg-primary-accent text-white rounded-xl text-sm font-semibold hover:bg-primary-accent/90 transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {phoneSending ? '⏳ Sending OTP...' : 'Send OTP'}
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={phoneVerifying || otpCode.length !== 6}
                        className="w-full py-3 bg-primary-accent text-white rounded-xl text-sm font-semibold hover:bg-primary-accent/90 transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {phoneVerifying ? '⏳ Verifying...' : '✓ Verify OTP'}
                      </button>
                      {otpCountdown === 0 && (
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtpCode(''); }}
                          className="w-full py-2.5 text-sm text-text-secondary hover:text-text-primary border border-border rounded-xl transition-colors bg-transparent cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
