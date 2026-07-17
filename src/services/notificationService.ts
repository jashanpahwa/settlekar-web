// notificationService.ts - Stub version for Web compatibility

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const notificationService = {
  async registerForPushNotifications(): Promise<string | null> {
    console.log('Push notifications are not supported on Web currently.');
    return null;
  },

  async savePushToken(_userId: string, _token: string): Promise<void> {
    console.log('Saving push token is not supported on Web.');
  },

  async sendPushNotification(_expoPushToken: string, _title: string, _body: string, _data: any = {}): Promise<any> {
    console.log('Sending push notifications via Expo is not supported on Web.');
    return { success: false, message: 'Not supported on Web' };
  },

  async notifyOwnerAboutInquiry(_ownerPushToken: string, _inquirerName: string, _propertyTitle: string, _ownerId: string, _propertyId: string): Promise<any> {
    console.log('Notifying owner about inquiry is a no-op on Web.');
    return null;
  },

  async notifyInquirerConfirmation(_inquirerPushToken: string, _propertyTitle: string, _ownerName: string, _propertyId: string): Promise<any> {
    console.log('Notifying inquirer is a no-op on Web.');
    return null;
  },

  setupNotificationListeners(_router: any): () => void {
    console.log('Notification listeners are a no-op on Web.');
    return () => {};
  },

  /**
   * Writes a notification to the user's private notifications subcollection.
   * Picked up by the real-time listener in Dashboard.tsx.
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
        title: '⏰ Listing Expired',
        body: `Your property "${meta?.propertyTitle || 'listing'}" has been auto-hidden. Open the Properties tab to re-enable it.`,
      },
      video_required: {
        title: '📹 Video Verification Needed',
        body: `Please upload a short verification video for "${meta?.propertyTitle || 'your property'}" to keep it verified.`,
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
  }
};

