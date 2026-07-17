import { User as FirebaseAuthUser } from 'firebase/auth';
import { PropertyData } from '../services/propertyService';
import { InquiryData } from '../services/inquiryService';
import { UserData } from '../services/userCollectionService';
import { OwnerProfile, BrokerProfile, FirmProfile } from '../services/ownerBrokerService';
import { ReferenceProperty } from '../services/referencePropertyService';

export type AuthUser = FirebaseAuthUser;

export interface IPropertyRepository {
  clearCache(): void;
  getAllProperties(): Promise<any[]>;
  getPropertiesByCity(city: string): Promise<any[]>;
  getPropertiesRealtime(
    onUpdate: (properties: any[]) => void,
    onError: (error: any) => void
  ): () => void;
  getPropertyById(id: string): Promise<any>;
  searchProperties(searchText: string): Promise<any[]>;
  getFeaturedProperties(): Promise<any[]>;
  addProperty(
    propertyData: PropertyData,
    indoorImages?: (File | Blob)[],
    outdoorImages?: (File | Blob)[]
  ): Promise<any>;
  updateProperty(
    propertyId: string,
    propertyData: PropertyData,
    newIndoorImages?: (File | Blob)[],
    newOutdoorImages?: (File | Blob)[],
    imagesToDelete?: string[]
  ): Promise<{ success: boolean }>;
  getUserProperties(userId: string, bypassCache?: boolean): Promise<any[]>;
  deleteProperty(propertyId: string): Promise<{ success: boolean }>;
  // ─── Availability ───
  setAvailability(propertyId: string, available: boolean): Promise<{ success: boolean }>;
  checkAndExpireAvailabilities(propertyIds: string[]): Promise<string[]>;
}

export interface IWishlistRepository {
  addToWishlist(userId: string, propertyId: string): Promise<string>;
  getWishlistRealtime(userId: string, callback: (items: any[]) => void): () => void;
  getWishlistCountRealtime(userId: string, callback: (size: number) => void): () => void;
  removeFromWishlist(userId: string, propertyId: string): Promise<void>;
  removeFromWishlistById(wishlistId: string): Promise<void>;
  getWishlist(userId: string): Promise<any[]>;
  isInWishlist(userId: string, propertyId: string): Promise<{ exists: boolean; wishlistItemId: string | null }>;
  getWishlistedPropertyIds(userId: string): Promise<string[]>;
}

export interface IInquiryRepository {
  clearCache(): void;
  sendInquiry(inquiryData: InquiryData): Promise<{ success: boolean }>;
  getInquiriesByOwner(ownerId: string, bypassCache?: boolean): Promise<any[]>;
  getInquiriesByProperty(ownerId: string, propertyId: string): Promise<any[]>;
  checkUserInquiry(inquirerId: string, propertyId: string): Promise<{ hasInquired: boolean; inquiryId: string | null; inquiry?: any }>;
  deleteInquiry(inquiryId: string): Promise<{ success: boolean }>;
  deleteInquiriesByProperty(propertyId: string): Promise<{ success: boolean }>;
}

export interface IUserRepository {
  // Collection operations
  createOrUpdateUser(userData: UserData): Promise<UserData>;
  getUserById(userId: string): Promise<any | null>;
  updateUserProfile(userId: string, updates: Partial<UserData>): Promise<{ success: boolean }>;
  deleteUser(userId: string): Promise<{ success: boolean }>;

  // Auth operations
  googleSignIn(): Promise<AuthUser>;
  googleSignOut(): Promise<void>;
  isSignedInWithGoogle(): Promise<boolean>;
  getCurrentGoogleUser(): Promise<AuthUser | null>;
  register(email: string, password: string, name: string): Promise<AuthUser>;
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<{ success: boolean; message: string }>;
  autoLogin(): Promise<AuthUser | null>;
  getCurrentUser(): AuthUser | null;
}

export interface IOwnerBrokerRepository {
  createOwnerProfile(userId: string, ownerData: Omit<OwnerProfile, 'userId'>): Promise<{ success: boolean }>;
  getOwnerProfile(userId: string): Promise<OwnerProfile | null>;
  createBrokerProfile(userId: string, brokerData: Omit<BrokerProfile, 'userId'>): Promise<{ success: boolean }>;
  getBrokerProfile(userId: string): Promise<BrokerProfile | null>;
  createFirmProfile(userId: string, firmData: Omit<FirmProfile, 'userId'>): Promise<{ success: boolean }>;
  getFirmProfile(userId: string): Promise<FirmProfile | null>;
}

export interface IRatingRepository {
  submitRating(propertyId: string, ratingValue: number): Promise<{ average: number; count: number }>;
  getUserSubmittedRating(propertyId: string, userId: string): Promise<number | null>;
}

export interface IStorageRepository {
  uploadImage(file: File | Blob, path?: string): Promise<string>;
  uploadMultipleImages(files: (File | Blob)[], path: string, maxConcurrent?: number): Promise<string[]>;
  deleteImage(imageUrl: string): Promise<void>;
}

export interface IReferencePropertyRepository {
  addReferenceProperty(referenceData: Omit<ReferenceProperty, 'id'>): Promise<void>;
  getAllReferenceProperties(): Promise<ReferenceProperty[]>;
  getReferencePropertiesRealtime(
    onUpdate: (references: ReferenceProperty[]) => void,
    onError: (error: any) => void
  ): () => void;
  getReferencePropertyById(referenceId: string): Promise<ReferenceProperty | null>;
}

// ─── Verification Repository ─────────────────────────────────────────────────────

export interface IVerificationRepository {
  // Phone OTP
  markPhoneVerified(userId: string, phone: string): Promise<{ success: boolean }>;
  getPhoneVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    phoneVerifiedAt: Date | null;
    phoneVerificationDue: Date | null;
    daysRemaining: number;
    phone?: string;
  }>;

  // Video Verification
  submitVideoVerification(
    propertyId: string,
    videoUrl: string,
    gpsLocation: { lat: number; lng: number }
  ): Promise<{ success: boolean }>;
  getVideoVerificationStatus(propertyId: string): Promise<{
    status: 'pending' | 'approved' | 'rejected' | 'none';
    videoUrl?: string;
    submittedAt?: Date;
    location?: { lat: number; lng: number };
  }>;
  uploadVerificationVideo(
    propertyId: string,
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<string>;

  // Audit Log
  logVerificationEvent(
    userId: string,
    type: 'phone_otp' | 'video_upload' | 'availability_renewed',
    status: 'success' | 'failed',
    meta?: Record<string, any>
  ): Promise<void>;
}
