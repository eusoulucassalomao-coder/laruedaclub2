export type Language = 'es' | 'en' | 'pt';

export type TabId = 'home' | 'points' | 'rewards' | 'history' | 'profile';

export type DevicePlatform =
  | 'android'
  | 'ios-safari'
  | 'ios-other'
  | 'desktop';

export type RewardCategory = 'cafe' | 'bakery' | 'experiences' | 'boutique';

export type HistoryEntryType = 'earned' | 'used' | 'redeemed';

export interface MemberProfile {
  id: string;
  customerCode: string;
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
  memberSince: string; // YYYY-MM
  avatarUrl: string | null;
  points: number;
  lifetimePoints: number;
  redeemedPoints: number;
  nextRewardTarget: number;
  favoriteBranch: string;
  whatsappOptIn: boolean;
  notificationsPreviewEnabled: boolean;
  isCustomDemoAccount?: boolean;
}

export interface DemoLookupProfile {
  customerCode: string;
  fullName: string;
  points: number;
  nextRewardTarget: number;
  memberSince: string;
  favoriteBranch: string;
  lastVisitDate: string;
}

export interface RewardDefinition {
  id: string;
  pointsRequired: number;
  category: RewardCategory;
  imageUrl: string;
  featured: boolean;
  codePrefix: string;
}

export interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  pointsDelta: number; // positive for earned, negative for used/redeemed
  dateIso: string; // YYYY-MM-DD
  titleKey?: string;
  descriptionKey?: string;
  customTitle?: string;
  customDescription?: string;
  rewardId?: string;
  voucherCode?: string;
  branchName?: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  action?: {
    type: 'navigate-rewards' | 'open-register' | 'lookup-sof' | 'lookup-mar' | 'navigate-profile-previews';
    label: string;
  };
}
