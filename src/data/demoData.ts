import { DemoLookupProfile, HistoryEntry, MemberProfile, RewardDefinition } from '../types';

export const ASSETS = {
  avatarMaria: '/src/assets/images/avatar_maria_1795006929637.jpg',
  coffee: '/src/assets/images/reward_specialty_coffee_1795006929434.jpg',
  pastry: '/src/assets/images/reward_artisan_pastry_1795006929468.jpg',
  cake: '/src/assets/images/reward_artisan_cake_1795006929745.jpg',
  beans: '/src/assets/images/reward_coffee_beans_1795006930148.jpg',
  brunch: '/src/assets/images/reward_brunch_table_1795006930364.jpg',
  tote: '/src/assets/images/reward_olive_tote_1795006930482.jpg',
};

export const INITIAL_MEMBER: MemberProfile = {
  id: 'member-maria-01',
  customerCode: 'MAR4821',
  fullName: 'María Rodríguez',
  firstName: 'María',
  email: 'maria.rodriguez@ejemplo.com',
  phone: '+54 9 376 123 4567',
  birthDate: '1996-05-14',
  memberSince: '2025-03',
  avatarUrl: ASSETS.avatarMaria,
  points: 850,
  lifetimePoints: 2350,
  redeemedPoints: 1500,
  nextRewardTarget: 1000,
  favoriteBranch: 'La Ruedita — Casa Central',
  whatsappOptIn: false,
  notificationsPreviewEnabled: false,
  isCustomDemoAccount: false,
};

export const SECONDARY_LOOKUP_MEMBER: DemoLookupProfile = {
  customerCode: 'SOF4821',
  fullName: 'Sofía Martínez',
  points: 1240,
  nextRewardTarget: 1500,
  memberSince: '2024-11',
  favoriteBranch: 'La Ruedita — Jardín Botánico',
  lastVisitDate: '2026-11-15',
};

export const BRANCH_OPTIONS = [
  'La Ruedita — Casa Central',
  'La Ruedita — Jardín Botánico',
  'La Ruedita — Mercado del Sur',
];

export const REWARDS_CATALOG: RewardDefinition[] = [
  {
    id: 'specialty-coffee',
    pointsRequired: 300,
    category: 'cafe',
    imageUrl: ASSETS.coffee,
    featured: true,
    codePrefix: 'CAFE',
  },
  {
    id: 'artisan-pastry',
    pointsRequired: 450,
    category: 'bakery',
    imageUrl: ASSETS.pastry,
    featured: true,
    codePrefix: 'HORN',
  },
  {
    id: 'citrus-olive-cake',
    pointsRequired: 650,
    category: 'bakery',
    imageUrl: ASSETS.cake,
    featured: false,
    codePrefix: 'TART',
  },
  {
    id: 'coffee-beans-bag',
    pointsRequired: 1000,
    category: 'cafe',
    imageUrl: ASSETS.beans,
    featured: true,
    codePrefix: 'GRAN',
  },
  {
    id: 'brunch-for-two',
    pointsRequired: 1200,
    category: 'experiences',
    imageUrl: ASSETS.brunch,
    featured: false,
    codePrefix: 'BRUN',
  },
  {
    id: 'olive-canvas-tote',
    pointsRequired: 1500,
    category: 'boutique',
    imageUrl: ASSETS.tote,
    featured: false,
    codePrefix: 'TOTE',
  },
];

export const INITIAL_HISTORY: HistoryEntry[] = [
  {
    id: 'hist-01',
    type: 'earned',
    pointsDelta: 120,
    dateIso: '2026-11-14',
    titleKey: 'hist_morning_visit_title',
    descriptionKey: 'hist_morning_visit_desc',
    branchName: 'Casa Central',
  },
  {
    id: 'hist-02',
    type: 'redeemed',
    pointsDelta: -300,
    dateIso: '2026-11-08',
    titleKey: 'hist_redeem_coffee_title',
    descriptionKey: 'hist_redeem_coffee_desc',
    rewardId: 'specialty-coffee',
    voucherCode: 'LR-DEMO-3041',
    branchName: 'Casa Central',
  },
  {
    id: 'hist-03',
    type: 'earned',
    pointsDelta: 240,
    dateIso: '2026-11-02',
    titleKey: 'hist_weekend_brunch_title',
    descriptionKey: 'hist_weekend_brunch_desc',
    branchName: 'Jardín Botánico',
  },
  {
    id: 'hist-04',
    type: 'earned',
    pointsDelta: 150,
    dateIso: '2026-10-25',
    titleKey: 'hist_bakery_box_title',
    descriptionKey: 'hist_bakery_box_desc',
    branchName: 'Casa Central',
  },
  {
    id: 'hist-05',
    type: 'used',
    pointsDelta: -450,
    dateIso: '2026-10-18',
    titleKey: 'hist_redeem_pastry_title',
    descriptionKey: 'hist_redeem_pastry_desc',
    rewardId: 'artisan-pastry',
    voucherCode: 'LR-DEMO-2189',
    branchName: 'Mercado del Sur',
  },
  {
    id: 'hist-06',
    type: 'earned',
    pointsDelta: 200,
    dateIso: '2026-10-10',
    titleKey: 'hist_welcome_bonus_title',
    descriptionKey: 'hist_welcome_bonus_desc',
    branchName: 'Club La Ruedita',
  },
];

export const POINT_MILESTONES = [300, 650, 1000, 1500];
