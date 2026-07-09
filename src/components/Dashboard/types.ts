export interface PropertyItem {
  id: string | number;
  title: string;
  city: string;
  location: string;
  address?: string;
  price: string;
  rating: string;
  badge: string;
  features: string;
  image: string;
  isUserAdded?: boolean;
  indoorImages?: string[];
  outdoorImages?: string[];
  securityFees?: number;
  advanceRentMonths?: number;
  brokerage?: number;
  totalAdvance?: number;
  listedByRole?: 'owner' | 'broker' | 'firm';
  description?: string;
  overallscore?: number;
  pillars?: any;
  meta?: any;
  confidence?: number;
  available?: boolean;
  isIndependent?: boolean;
  bachelorFriendly?: boolean;
  womenOnly?: boolean;
  isTopFloor?: boolean;
}

export interface InquiryItem {
  id: string;
  propertyId: string | number;
  propertyTitle: string;
  propertyPrice: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  message: string;
  createdAt: string;
}
