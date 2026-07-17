import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { IVerificationRepository } from '../types';
import { COLLECTIONS, DB_FIELDS } from '../../db/schema';

const VERIFICATION_EXPIRY_DAYS = 30;

export class FirebaseVerificationRepository implements IVerificationRepository {

  // ─── Phone OTP ──────────────────────────────────────────────────────────────

  /**
   * Called after a successful Firebase phone OTP confirmation.
   * Writes phoneVerifiedAt + phoneVerificationDue to the user's owner/broker profile.
   */
  async markPhoneVerified(userId: string, phone: string): Promise<{ success: boolean }> {
    try {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Day only
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + VERIFICATION_EXPIRY_DAYS);
      dueDate.setHours(0, 0, 0, 0); // Day only

      const verificationData = {
        [DB_FIELDS.PROFILE.PHONE]: phone,
        [DB_FIELDS.PROFILE.PHONE_VERIFIED_AT]: Timestamp.fromDate(now),
        [DB_FIELDS.PROFILE.PHONE_VERIFICATION_DUE]: Timestamp.fromDate(dueDate),
        [DB_FIELDS.PROFILE.IS_PHONE_VERIFIED]: true,
        [DB_FIELDS.PROFILE.UPDATED_AT]: serverTimestamp(),
      };

      // Update in all possible profile collections (owner, broker, firm)
      const collections = [COLLECTIONS.OWNERS, COLLECTIONS.BROKERS, COLLECTIONS.FIRMS];
      const updatePromises = collections.map(async (col) => {
        const docRef = doc(db, col, userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          await updateDoc(docRef, verificationData);
        }
      });
      await Promise.allSettled(updatePromises);

      // Also update in users collection for quick access
      const userDocRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        await updateDoc(userDocRef, {
          [DB_FIELDS.USER.USERNUMBER]: phone,
          [DB_FIELDS.USER.PHONE_VERIFIED_AT]: Timestamp.fromDate(now),
          [DB_FIELDS.USER.PHONE_VERIFICATION_DUE]: Timestamp.fromDate(dueDate),
          [DB_FIELDS.USER.IS_PHONE_VERIFIED]: true,
        });
      }

      await this.logVerificationEvent(userId, 'phone_otp', 'success', { phone });
      return { success: true };
    } catch (error) {
      console.error('Error marking phone verified:', error);
      await this.logVerificationEvent(userId, 'phone_otp', 'failed', {}).catch(() => {});
      throw error;
    }
  }

  /**
   * Returns current phone verification status for a user.
   */
  async getPhoneVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    phoneVerifiedAt: Date | null;
    phoneVerificationDue: Date | null;
    daysRemaining: number;
    phone?: string;
  }> {
    try {
      const userDocRef = doc(db, COLLECTIONS.USERS, userId);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        return { isVerified: false, phoneVerifiedAt: null, phoneVerificationDue: null, daysRemaining: 0 };
      }

      const data = snap.data();
      const verifiedAt: Date | null = data[DB_FIELDS.USER.PHONE_VERIFIED_AT]?.toDate?.() ?? null;
      const dueDate: Date | null = data[DB_FIELDS.USER.PHONE_VERIFICATION_DUE]?.toDate?.() ?? null;

      const now = new Date();
      const isVerified = dueDate ? now < dueDate : false;
      const daysRemaining = dueDate
        ? Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        isVerified,
        phoneVerifiedAt: verifiedAt,
        phoneVerificationDue: dueDate,
        daysRemaining,
        phone: data[DB_FIELDS.USER.USERNUMBER] ?? data.phone ?? data.phoneNumber ?? undefined,
      };
    } catch (error) {
      console.error('Error getting phone verification status:', error);
      return { isVerified: false, phoneVerifiedAt: null, phoneVerificationDue: null, daysRemaining: 0 };
    }
  }

  // ─── Video Verification ──────────────────────────────────────────────────────

  /**
   * Uploads a verification video to Firebase Storage with progress tracking.
   * Returns the download URL.
   */
  async uploadVerificationVideo(
    propertyId: string,
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const userId = auth.currentUser?.uid || 'unknown';
    const ext = videoFile.name.split('.').pop() || 'mp4';
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const storagePath = `verification_videos/${propertyId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, videoFile, {
      customMetadata: {
        ownerId: userId,
        propertyId,
        uploadedAt: new Date().toISOString(),
        fileType: videoFile.type || 'video/mp4',
        // Scheduled for deletion 7 days after upload (enforced by Cloud Function or admin)
        scheduledDeletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(Math.round(progress));
        },
        (error) => {
          console.error('Video upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  /**
   * Saves video verification data to the property document after upload.
   */
  async submitVideoVerification(
    propertyId: string,
    videoUrl: string,
    gpsLocation: { lat: number; lng: number }
  ): Promise<{ success: boolean }> {
    try {
      const userId = auth.currentUser?.uid || 'unknown';
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Day only
      // Schedule deletion 7 days from now (audit trail window)
      const scheduledDeletion = new Date(now);
      scheduledDeletion.setDate(scheduledDeletion.getDate() + 7);
      scheduledDeletion.setHours(0, 0, 0, 0); // Day only

      const propertyRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);
      await updateDoc(propertyRef, {
        [DB_FIELDS.PROPERTY.VIDEO_VERIFICATION_URL]: videoUrl,
        [DB_FIELDS.PROPERTY.VIDEO_VERIFICATION_STATUS]: 'pending',
        videoVerificationSubmittedAt: Timestamp.fromDate(now),
        [DB_FIELDS.PROPERTY.VIDEO_VERIFICATION_LOCATION]: gpsLocation,
        [DB_FIELDS.PROPERTY.VIDEO_VERIFICATION_DELETION]: Timestamp.fromDate(scheduledDeletion),
        [DB_FIELDS.PROPERTY.UPDATED_AT]: serverTimestamp(),
      });

      await this.logVerificationEvent(userId, 'video_upload', 'success', {
        propertyId,
        lat: gpsLocation.lat,
        lng: gpsLocation.lng,
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting video verification:', error);
      throw error;
    }
  }

  /**
   * Returns current video verification status for a property.
   */
  async getVideoVerificationStatus(propertyId: string): Promise<{
    status: 'pending' | 'approved' | 'rejected' | 'none';
    videoUrl?: string;
    submittedAt?: Date;
    location?: { lat: number; lng: number };
  }> {
    try {
      const propertyRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);
      const snap = await getDoc(propertyRef);

      if (!snap.exists()) return { status: 'none' };

      const data = snap.data();
      return {
        status: data[DB_FIELDS.PROPERTY.VIDEO_VERIFICATION_STATUS] ?? 'none',
        videoUrl: data[DB_FIELDS.PROPERTY.VIDEO_VERIFICATION_URL],
        submittedAt: data.videoVerificationSubmittedAt?.toDate?.() ?? undefined,
        location: data[DB_FIELDS.PROPERTY.VIDEO_VERIFICATION_LOCATION],
      };
    } catch (error) {
      console.error('Error getting video verification status:', error);
      return { status: 'none' };
    }
  }

  // ─── Audit Log ───────────────────────────────────────────────────────────────

  /**
   * Writes a verification event to the global verificationLogs collection.
   */
  async logVerificationEvent(
    userId: string,
    type: 'phone_otp' | 'video_upload' | 'availability_renewed',
    status: 'success' | 'failed',
    meta: Record<string, any> = {}
  ): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTIONS.VERIFICATION_LOGS), {
        [DB_FIELDS.VERIFICATION_LOG.USER_ID]: userId,
        [DB_FIELDS.VERIFICATION_LOG.TYPE]: type,
        [DB_FIELDS.VERIFICATION_LOG.STATUS]: status,
        [DB_FIELDS.VERIFICATION_LOG.TIMESTAMP]: serverTimestamp(),
        [DB_FIELDS.VERIFICATION_LOG.META]: meta,
      });
    } catch (error) {
      // Non-critical — don't throw
      console.warn('Could not write verification log:', error);
    }
  }
}
