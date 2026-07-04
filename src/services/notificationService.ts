// notificationService.ts - Stub version for Web compatibility

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
  }
};
