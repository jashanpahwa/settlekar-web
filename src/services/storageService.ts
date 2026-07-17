import { storageRepo } from '../repositories';

export const storageService = {
  uploadImage: async (file: File | Blob, path: string = 'properties/'): Promise<string> => {
    return storageRepo.uploadImage(file, path);
  },

  uploadMultipleImages: async (files: (File | Blob)[], path: string, maxConcurrent: number = 3): Promise<string[]> => {
    return storageRepo.uploadMultipleImages(files, path, maxConcurrent);
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    return storageRepo.deleteImage(imageUrl);
  }
};
