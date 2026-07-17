import { FirebasePropertyRepository } from './firebase/propertyRepository';
import { FirebaseWishlistRepository } from './firebase/wishlistRepository';
import { FirebaseInquiryRepository } from './firebase/inquiryRepository';
import { FirebaseUserRepository } from './firebase/userRepository';
import { FirebaseOwnerBrokerRepository } from './firebase/ownerBrokerRepository';
import { FirebaseRatingRepository } from './firebase/ratingRepository';
import { FirebaseStorageRepository } from './firebase/storageRepository';
import { FirebaseReferencePropertyRepository } from './firebase/referencePropertyRepository';

export const propertyRepo = new FirebasePropertyRepository();
export const wishlistRepo = new FirebaseWishlistRepository();
export const inquiryRepo = new FirebaseInquiryRepository();
export const userRepo = new FirebaseUserRepository();
export const ownerBrokerRepo = new FirebaseOwnerBrokerRepository();
export const ratingRepo = new FirebaseRatingRepository();
export const storageRepo = new FirebaseStorageRepository();
export const referencePropertyRepo = new FirebaseReferencePropertyRepository();

export * from './types';
