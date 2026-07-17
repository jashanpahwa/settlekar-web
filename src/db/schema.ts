/**
 * SettleKar Database Schema Registry
 * 
 * Provides a single source of truth for Firestore collection names 
 * and document field keys to guarantee consistency across all web 
 * services, repositories, and UI components.
 */

// ─── Collection Names ─────────────────────────────────────────────────────────
export const COLLECTIONS = {
  USERS: 'users',
  OWNERS: 'owners',
  BROKERS: 'brokers',
  FIRMS: 'firms',
  PROPERTIES: 'properties',
  INQUIRIES: 'inquiries',
  WISHLISTS: 'wishlists',
  REFERENCES: 'references',
  VERIFICATION_LOGS: 'verificationLogs',
} as const;

// ─── Subcollection Names ──────────────────────────────────────────────────────
export const SUB_COLLECTIONS = {
  USER_NOTIFICATIONS: 'notifications', // users/{userId}/notifications
  PROPERTY_RATINGS: 'userRatings',     // properties/{propertyId}/userRatings
} as const;

// ─── Field Names ─────────────────────────────────────────────────────────────
export const DB_FIELDS = {
  // Users Collection fields
  USER: {
    USER_ID: 'userId',
    EMAIL: 'email',
    FULL_NAME: 'fullName',
    ROLE: 'role',
    USERNUMBER: 'usernumber',
    CREATED_AT: 'createdAt',
    // Phone verification fields
    PHONE_VERIFIED_AT: 'phoneVerifiedAt',
    PHONE_VERIFICATION_DUE: 'phoneVerificationDue',
    IS_PHONE_VERIFIED: 'isPhoneCurrentlyVerified',
  },

  // Owner, Broker, and Firm Profile Collections
  PROFILE: {
    USER_ID: 'userId',
    FULL_NAME: 'fullName',
    PHONE: 'phone',
    CITY: 'city',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    // Phone verification fields
    PHONE_VERIFIED_AT: 'phoneVerifiedAt',
    PHONE_VERIFICATION_DUE: 'phoneVerificationDue',
    IS_PHONE_VERIFIED: 'isPhoneCurrentlyVerified',
  },

  // Properties Collection fields
  PROPERTY: {
    ID: 'id',
    TITLE: 'title',
    DESCRIPTION: 'description',
    PRICE: 'price',
    AREA: 'area',
    CITY: 'city',
    ADDRESS: 'address',
    LOCATION: 'location', // Maps link
    IMAGE: 'image',
    IMAGES: 'images',
    INDOOR_IMAGES: 'indoorImages',
    OUTDOOR_IMAGES: 'outdoorImages',
    AVAILABLE: 'available',
    CREATED_BY: 'createdBy',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    
    // Pillar details & Livability
    OVERALL_SCORE: 'overallscore',
    PILLARS: 'pillars',
    META: 'meta',
    CONFIDENCE: 'confidence',

    // Availability & Expiries
    LAST_AVAILABILITY_SET_AT: 'lastAvailabilitySetAt',
    AVAILABILITY_EXPIRES_AT: 'availabilityExpiresAt',

    // Video verification
    VIDEO_VERIFICATION_URL: 'videoVerificationUrl',
    VIDEO_VERIFICATION_STATUS: 'videoVerificationStatus',
    VIDEO_VERIFICATION_LOCATION: 'videoVerificationLocation',
    VIDEO_VERIFICATION_DELETION: 'videoVerificationScheduledDeletion',
  },

  // Verification Logs Collection fields
  VERIFICATION_LOG: {
    USER_ID: 'userId',
    PROPERTY_ID: 'propertyId',
    TYPE: 'type', // e.g. 'phone_otp', 'video_upload', 'availability_renewed'
    STATUS: 'status', // 'success' | 'failed'
    TIMESTAMP: 'timestamp',
    META: 'meta',
  }
} as const;
