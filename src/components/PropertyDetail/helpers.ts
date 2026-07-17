// Shared types and helpers for PropertyDetail components
import { PropertyData } from '../../services/propertyService';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Property extends PropertyData {
  id: string;
}

export type TagVariant = 'indigo' | 'green' | 'blue' | 'orange' | 'slate';

export interface SmartTag {
  label: string;
  icon: string; // lucide icon name used as reference
  variant: TagVariant;
}

export interface FraudRiskDetails {
  label: string;
  color: string;
  bg: string;
  border: string;
}

// ─── Tag variant styles (Tailwind classes) ─────────────────────────────────────

export const TAG_STYLES: Record<TagVariant, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
  green:  'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  blue:   'bg-sky-50 text-sky-600 border-sky-200/60',
  orange: 'bg-orange-50 text-orange-600 border-orange-200/60',
  slate:  'bg-slate-100 text-slate-500 border-slate-200/60',
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

export const getFraudRiskDetails = (rating: number | string | undefined, score: number | null): FraudRiskDetails => {
  const numRating = rating ? parseFloat(String(rating)) : null;
  const numScore = score != null ? Number(score) : null;

  if ((numRating !== null && numRating >= 4.0) || (numScore !== null && numScore >= 75)) {
    return { label: 'Secure', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' };
  }
  if ((numRating !== null && numRating >= 3.0) || (numScore !== null && numScore >= 50)) {
    return { label: 'Standard Check Required', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' };
  }
  if (numRating !== null || numScore !== null) {
    return { label: 'Caution: High Risk Flag', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' };
  }
  return { label: 'Under Review', color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' };
};

export const cleanLocation = (location?: string, address?: string, city?: string): string => {
  const candidates = [location, address, city].filter(Boolean) as string[];
  for (const c of candidates) {
    if (!c.startsWith('http') && !c.includes('google.com/maps') && !c.includes('maps.google')) {
      return c;
    }
  }
  return city || 'Location not specified';
};

export const formatPrice = (price: string | number | undefined): string => {
  if (!price) return 'Contact for Price';
  const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  if (isNaN(num)) return String(price);
  return `₹${num.toLocaleString('en-IN')}`;
};

export const scoreColor = (score: number) => {
  if (score >= 80) return { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.25)' };
  if (score >= 60) return { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' };
  return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.25)' };
};

export const pillarFillColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

// ─── Smart tag derivation ───────────────────────────────────────────────────────

export const deriveSmartTags = (prop: PropertyData): SmartTag[] => {
  const tags: SmartTag[] = [];
  const keywords: string[] = Array.isArray(prop.keywords) ? prop.keywords.map((k: any) => String(k).toLowerCase()) : [];
  const type = (prop.propertyType || '').toLowerCase();

  if (type) {
    tags.push({ label: type.toUpperCase(), icon: 'Home', variant: 'indigo' });
  }

  if (keywords.includes('bachelor friendly')) {
    tags.push({ label: 'Bachelor Friendly', icon: 'User', variant: 'blue' });
  }

  if (keywords.includes('women only') || keywords.includes('girls friendly') || keywords.includes('women')) {
    tags.push({ label: 'Women Only', icon: 'UserCheck', variant: 'orange' });
  }

  if (keywords.includes('family friendly') || keywords.includes('family')) {
    tags.push({ label: 'Family Friendly', icon: 'Users', variant: 'green' });
  }

  if (keywords.includes('student friendly') || keywords.includes('student')) {
    tags.push({ label: 'Student Friendly', icon: 'GraduationCap', variant: 'blue' });
  }

  if (keywords.includes('zero brokerage') || keywords.includes('no brokerage') || Number(prop.brokerage) === 0) {
    tags.push({ label: 'Zero Brokerage', icon: 'PartyPopper', variant: 'green' });
  }

  if (keywords.includes('fully furnished')) {
    tags.push({ label: 'Fully Furnished', icon: 'Sofa', variant: 'indigo' });
  } else if (keywords.includes('semi-furnished') || keywords.includes('semi furnished')) {
    tags.push({ label: 'Semi-Furnished', icon: 'Armchair', variant: 'slate' });
  } else if (keywords.includes('unfurnished')) {
    tags.push({ label: 'Unfurnished', icon: 'Package', variant: 'slate' });
  }

  if (keywords.includes('independent') || keywords.includes('independent house')) {
    tags.push({ label: 'Independent House', icon: 'House', variant: 'orange' });
  }

  if (keywords.includes('top floor')) {
    tags.push({ label: 'Top Floor', icon: 'Building2', variant: 'indigo' });
  }

  if (keywords.includes('parking') || keywords.includes('car park')) {
    tags.push({ label: 'Parking Available', icon: 'Car', variant: 'slate' });
  }

  if (keywords.includes('lift') || keywords.includes('elevator')) {
    tags.push({ label: 'Lift', icon: 'ArrowUpDown', variant: 'slate' });
  }

  if (keywords.includes('wifi') || keywords.includes('wi-fi') || keywords.includes('internet')) {
    tags.push({ label: 'WiFi Included', icon: 'Wifi', variant: 'blue' });
  }

  if (keywords.includes('ac') || keywords.includes('air conditioned') || keywords.includes('air conditioning')) {
    tags.push({ label: 'Air Conditioned', icon: 'Snowflake', variant: 'blue' });
  }

  if (keywords.includes('gym') || keywords.includes('fitness')) {
    tags.push({ label: 'Gym', icon: 'Dumbbell', variant: 'orange' });
  }

  if (keywords.includes('pet friendly') || keywords.includes('pets allowed')) {
    tags.push({ label: 'Pet Friendly', icon: 'PawPrint', variant: 'green' });
  }

  return tags;
};
