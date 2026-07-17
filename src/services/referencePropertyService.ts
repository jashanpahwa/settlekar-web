import { referencePropertyRepo } from '../repositories';

export interface ReferenceProperty {
  id?: string;
  title: string;
  price: number;
  city: string;
  createdAt?: Date;
  expiryDate?: Date;
  [key: string]: any;
}

export const referencePropertyService = {
  addReferenceProperty: async (referenceData: Omit<ReferenceProperty, 'id'>): Promise<void> => {
    return referencePropertyRepo.addReferenceProperty(referenceData);
  },

  getAllReferenceProperties: async (): Promise<ReferenceProperty[]> => {
    return referencePropertyRepo.getAllReferenceProperties();
  },

  getReferencePropertiesRealtime: (
    onUpdate: (references: ReferenceProperty[]) => void,
    onError: (error: any) => void
  ): (() => void) => {
    return referencePropertyRepo.getReferencePropertiesRealtime(onUpdate, onError);
  },

  getReferencePropertyById: async (referenceId: string): Promise<ReferenceProperty | null> => {
    return referencePropertyRepo.getReferencePropertyById(referenceId);
  },
};
