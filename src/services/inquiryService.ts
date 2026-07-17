import { inquiryRepo } from '../repositories';
import { trackMetaEvent } from '../utils/metaPixel';

export interface InquiryData {
  propertyId: string;
  propertyTitle: string;
  propertyPrice?: string | number | null;
  ownerId: string;
  ownerName?: string | null;
  inquirerId: string;
  inquirerName?: string;
  inquirerEmail?: string;
  inquirerPhone?: string;
  message?: string;
  [key: string]: any;
}

export const inquiryService = {
  clearCache() {
    inquiryRepo.clearCache();
  },

  async sendInquiry(inquiryData: InquiryData) {
    trackMetaEvent("Lead", {
      property_id: inquiryData.propertyId
    });
    return inquiryRepo.sendInquiry(inquiryData);
  },

  async getInquiriesByOwner(ownerId: string, bypassCache: boolean = false) {
    return inquiryRepo.getInquiriesByOwner(ownerId, bypassCache);
  },

  async getInquiriesByProperty(ownerId: string, propertyId: string) {
    return inquiryRepo.getInquiriesByProperty(ownerId, propertyId);
  },

  async checkUserInquiry(inquirerId: string, propertyId: string) {
    return inquiryRepo.checkUserInquiry(inquirerId, propertyId);
  },

  async deleteInquiry(inquiryId: string) {
    return inquiryRepo.deleteInquiry(inquiryId);
  },

  async deleteInquiriesByProperty(propertyId: string) {
    return inquiryRepo.deleteInquiriesByProperty(propertyId);
  }
};
