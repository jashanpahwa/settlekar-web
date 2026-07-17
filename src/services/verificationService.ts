/**
 * verificationService.ts
 *
 * Centralizes all three pillars of the SettleKar property verification system:
 *   1. Monthly phone OTP re-verification (per-user, Firebase Phone Auth)
 *   2. Video proof upload at GPS location
 *   3. 7-day availability expiry management
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
  unlink,
  ConfirmationResult,
} from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { verificationRepo } from '../repositories';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhoneVerificationStatus {
  isVerified: boolean;
  phoneVerifiedAt: Date | null;
  phoneVerificationDue: Date | null;
  daysRemaining: number;
  isOverdue: boolean;
  phone?: string;
}

export interface VideoVerificationStatus {
  status: 'pending' | 'approved' | 'rejected' | 'none';
  videoUrl?: string;
  submittedAt?: Date;
  location?: { lat: number; lng: number };
}

// ─── Module-level state for OTP flow ─────────────────────────────────────────
let _confirmationResult: ConfirmationResult | null = null;
let _recaptchaVerifier: RecaptchaVerifier | null = null;

/** Tears down the reCAPTCHA verifier and clears the container. */
export function destroyRecaptcha(): void {
  try { _recaptchaVerifier?.clear(); } catch (_) {}
  _recaptchaVerifier = null;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const verificationService = {

  // ─── Phone OTP ──────────────────────────────────────────────────────────────

  /**
   * Renders the reCAPTCHA widget into the given container element.
   * Call this when the phone tab becomes visible.
   * @param container  The DOM element to render the reCAPTCHA widget into.
   * @param onSolved   Called automatically when the user completes reCAPTCHA.
   * @param onExpired  Called when the reCAPTCHA token expires.
   */
  setupVisibleRecaptcha(
    container: HTMLElement,
    onSolved: () => void,
    onExpired: () => void
  ): void {
    // Clear any previous verifier first
    try { _recaptchaVerifier?.clear(); } catch (_) {}
    _recaptchaVerifier = null;

    _recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: 'normal',          // visible "I'm not a robot" checkbox
      callback: () => {
        onSolved();            // enable the Send OTP button
      },
      'expired-callback': () => {
        onExpired();           // disable Send OTP button again
      },
    });

    // Render the widget immediately into the container
    _recaptchaVerifier.render().catch((err) => {
      console.error('reCAPTCHA render error:', err);
    });
  },

  /**
   * Sends an OTP to the given phone number.
   * Links the phone number to the current user profile if logged in.
   */
  async sendPhoneOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!_recaptchaVerifier) {
        return { success: false, error: 'reCAPTCHA not ready. Please complete the verification.' };
      }

      const currentUser = auth.currentUser;

      if (currentUser) {
        // If this phone number is already linked, unlink it first so we can re-link/verify it
        if (currentUser.phoneNumber === phoneNumber) {
          try {
            // Check if they have other providers (so we don't leave them with zero providers)
            if (currentUser.providerData.length > 1) {
              await unlink(currentUser, 'phone');
            }
          } catch (unlinkErr) {
            console.warn('Failed to unlink phone prior to verification:', unlinkErr);
          }
        }

        // Link the phone number to the active user profile
        _confirmationResult = await linkWithPhoneNumber(currentUser, phoneNumber, _recaptchaVerifier);
      } else {
        // Fallback to sign-in if no active user session (should not happen on dashboard)
        _confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, _recaptchaVerifier);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      // Clear verifier on error so user can retry
      try { _recaptchaVerifier?.clear(); } catch (_) {}
      _recaptchaVerifier = null;

      let friendlyMsg = 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        friendlyMsg = 'Too many requests. SMS verification has been temporarily blocked for security. Please wait 10-15 minutes before trying again.';
      } else if (error.code === 'auth/quota-exceeded') {
        friendlyMsg = 'Daily SMS limit exceeded. Please try again tomorrow or contact support.';
      } else if (error.code === 'auth/invalid-phone-number') {
        friendlyMsg = 'Invalid phone number format. Please check your profile and try again.';
      } else if (error.code === 'auth/captcha-check-failed') {
        friendlyMsg = 'reCAPTCHA check failed. Please resolve the captcha again.';
      } else if (error.message) {
        friendlyMsg = error.message;
      }

      return { success: false, error: friendlyMsg };
    }
  },



  /**
   * Confirms the OTP entered by the user.
   * On success, marks the phone as verified in Firestore (per-user, 30-day window).
   */
  async confirmPhoneOTP(
    otp: string,
    userId: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!_confirmationResult) {
        return { success: false, error: 'No OTP session found. Please request a new OTP.' };
      }

      await _confirmationResult.confirm(otp);
      _confirmationResult = null;
      destroyRecaptcha(); // Clean up after successful confirmation


      // Mark phone as verified in Firestore for this user
      await verificationRepo.markPhoneVerified(userId, phone);
      return { success: true };
    } catch (error: any) {
      console.error('Error confirming OTP:', error);
      const friendlyMsg =
        error.code === 'auth/invalid-verification-code'
          ? 'Invalid OTP. Please check and try again.'
          : error.code === 'auth/code-expired'
          ? 'OTP has expired. Please request a new one.'
          : 'OTP verification failed. Please try again.';
      return { success: false, error: friendlyMsg };
    }
  },

  /**
   * Returns the current phone verification status for a user.
   */
  async getPhoneVerificationStatus(userId: string): Promise<PhoneVerificationStatus> {
    const status = await verificationRepo.getPhoneVerificationStatus(userId);
    const isOverdue = !status.isVerified && status.phoneVerifiedAt !== null && status.daysRemaining === 0;
    return { ...status, isOverdue };
  },

  // ─── Video Verification ───────────────────────────────────────────────────

  /**
   * Captures GPS location from the browser, then uploads the video file
   * to Firebase Storage and saves the verification record to the property doc.
   *
   * The owner/broker must be physically at the property when doing this —
   * GPS coordinates are stored alongside the video URL for admin review.
   */
  async submitVideoVerification(
    propertyId: string,
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Step 1: Capture GPS location
      const gpsLocation = await verificationService.captureGPSLocation();

      // Step 2: Upload video to Firebase Storage
      const videoUrl = await verificationRepo.uploadVerificationVideo(
        propertyId,
        videoFile,
        onProgress
      );

      // Step 3: Save verification record to property document
      await verificationRepo.submitVideoVerification(propertyId, videoUrl, gpsLocation);

      return { success: true };
    } catch (error: any) {
      console.error('Error submitting video verification:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit video verification.',
      };
    }
  },

  /**
   * Returns the GPS coordinates from the browser.
   * Throws if location permission is denied.
   */
  async captureGPSLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      const getPosition = (highAccuracy: boolean) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            if (highAccuracy && error.code !== error.PERMISSION_DENIED) {
              console.warn('High accuracy geolocation timed out/failed, retrying with low accuracy...');
              getPosition(false);
            } else {
              const msg =
                error.code === error.PERMISSION_DENIED
                  ? 'Location access was denied. Please enable location permission and try again.'
                  : 'Unable to retrieve your location. Please try again.';
              reject(new Error(msg));
            }
          },
          highAccuracy
            ? { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
            : { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
        );
      };

      getPosition(true);
    });
  },

  async getVideoVerificationStatus(propertyId: string): Promise<VideoVerificationStatus> {
    return verificationRepo.getVideoVerificationStatus(propertyId);
  },

  // ─── Availability Management ─────────────────────────────────────────────

  /**
   * Schedules reminder notifications for verification needs.
   * Writes to users/{userId}/notifications subcollection (picked up by realtime listener).
   */
  async scheduleVerificationReminder(
    userId: string,
    type: 'phone_due' | 'availability_expiring' | 'video_required',
    meta?: Record<string, any>
  ): Promise<void> {
    const messages: Record<typeof type, { title: string; body: string }> = {
      phone_due: {
        title: '📱 Phone Verification Required',
        body: 'Your monthly phone number verification is due. Please re-verify to keep your listings active.',
      },
      availability_expiring: {
        title: '⏰ Listing Expiring Soon',
        body: `Your property "${meta?.propertyTitle || 'listing'}" will auto-hide in ${meta?.daysLeft ?? 1} day(s). Open your dashboard to re-enable it.`,
      },
      video_required: {
        title: '📹 Video Verification Needed',
        body: `Please upload a short verification video for "${meta?.propertyTitle || 'your property'}" to keep it verified on SettleKar.`,
      },
    };

    const { title, body } = messages[type];

    try {
      await addDoc(collection(db, 'users', userId, 'notifications'), {
        title,
        body,
        read: false,
        createdAt: serverTimestamp(),
        type,
        meta: meta ?? {},
      });
    } catch (error) {
      console.warn('Could not schedule verification reminder:', error);
    }
  },
};
