import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, storage } from '../../firebase';
import { IStorageRepository } from '../types';

export class FirebaseStorageRepository implements IStorageRepository {
  async uploadImage(file: File | Blob, path: string = 'properties/'): Promise<string> {
    try {
      const getFileExtension = (fileObj: File | Blob): string => {
        if ('name' in fileObj && fileObj.name) {
          const parts = fileObj.name.split('.');
          if (parts.length > 1) return parts[parts.length - 1];
        }
        const mimeType = fileObj.type || '';
        const parts = mimeType.split('/');
        if (parts.length === 2) return parts[1];
        return 'jpg';
      };

      const fileExtension = getFileExtension(file);
      const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
      const cleanPath = path.endsWith('/') ? path : `${path}/`;
      const storageRef = ref(storage, `${cleanPath}${uniqueFileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: {
          ownerId: auth.currentUser?.uid || 'unknown',
          originalFileName: 'name' in file ? file.name : 'unknown',
          uploadedAt: new Date().toISOString(),
          fileType: file.type || 'image/jpeg'
        }
      });

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async uploadMultipleImages(files: (File | Blob)[], path: string, maxConcurrent: number = 3): Promise<string[]> {
    try {
      const results: PromiseSettledResult<string>[] = [];
      const queue = [...files];

      while (queue.length > 0) {
        const currentBatch = queue.splice(0, maxConcurrent);
        const uploadPromises = currentBatch.map(file =>
          this.uploadImage(file, path)
        );

        const batchResults = await Promise.allSettled(uploadPromises);
        results.push(...batchResults);
      }

      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
        .map(result => result.value);

      const failedUploads = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map((result, index) => ({
          file: files[index],
          error: result.reason
        }));

      if (failedUploads.length > 0) {
        console.warn('Some uploads failed:', failedUploads);
      }

      return successfulUploads;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
      if (imageUrl.startsWith(baseUrl)) {
        const encodedPath = imageUrl.split('/o/')[1]?.split('?')[0];
        if (encodedPath) {
          const decodedPath = decodeURIComponent(encodedPath);
          const imageRef = ref(storage, decodedPath);
          await deleteObject(imageRef);
          return;
        }
      }

      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      console.warn('Image deletion failed, but continuing operation');
    }
  }
}
