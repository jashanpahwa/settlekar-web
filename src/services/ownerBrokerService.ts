import { ownerBrokerRepo } from '../repositories';

export interface OwnerProfile {
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  govtIdType: string | null;
  govtIdNumber: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface BrokerProfile {
  userId: string;
  fullName: string;
  phone: string;
  reraNumber: string;
  city: string;
  agencyName: string | null;
  experience: number | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirmProfile {
  userId: string;
  firmName: string;
  reraNumber: string;
  contactPersonName: string;
  contactPhone: string;
  officeAddress: string;
  city: string;
  gstNumber: string | null;
  totalAgents: number | null;
  website: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export const ownerBrokerService = {
  // ─── OWNER ────────────────────────────────────────────────────────────────

  createOwnerProfile: async (userId: string, ownerData: Omit<OwnerProfile, 'userId'>) => {
    return ownerBrokerRepo.createOwnerProfile(userId, ownerData);
  },

  getOwnerProfile: async (userId: string): Promise<OwnerProfile | null> => {
    return ownerBrokerRepo.getOwnerProfile(userId);
  },

  // ─── BROKER ───────────────────────────────────────────────────────────────

  createBrokerProfile: async (userId: string, brokerData: Omit<BrokerProfile, 'userId'>) => {
    return ownerBrokerRepo.createBrokerProfile(userId, brokerData);
  },

  getBrokerProfile: async (userId: string): Promise<BrokerProfile | null> => {
    return ownerBrokerRepo.getBrokerProfile(userId);
  },

  // ─── FIRM ─────────────────────────────────────────────────────────────────

  createFirmProfile: async (userId: string, firmData: Omit<FirmProfile, 'userId'>) => {
    return ownerBrokerRepo.createFirmProfile(userId, firmData);
  },

  getFirmProfile: async (userId: string): Promise<FirmProfile | null> => {
    return ownerBrokerRepo.getFirmProfile(userId);
  },

  // ─── GENERIC HELPER ───────────────────────────────────────────────────────

  getProfileByRole: async (userId: string, role: 'owner' | 'broker' | 'firm' | 'tenant' | string): Promise<any | null> => {
    if (role === 'owner') return ownerBrokerService.getOwnerProfile(userId);
    if (role === 'broker') return ownerBrokerService.getBrokerProfile(userId);
    if (role === 'firm') return ownerBrokerService.getFirmProfile(userId);
    return null;
  },
};
