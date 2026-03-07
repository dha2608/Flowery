export const ROLES = {
  USER: 'user',
  SHOP_OWNER: 'shop_owner',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const PAYMENT_METHODS = {
  COD: 'cod',
  VNPAY: 'vnpay',
  MOMO: 'momo',
  ZALOPAY: 'zalopay',
  BANK_TRANSFER: 'bank_transfer',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const EMOTIONS = [
  'romantic', 'grateful', 'joyful', 'sympathetic', 'respectful',
  'apologetic', 'celebratory', 'mourning', 'friendly', 'passionate',
] as const;

export type Emotion = typeof EMOTIONS[number];

export const OCCASIONS = [
  'birthday', 'anniversary', 'valentines', 'mothers_day', 'womens_day',
  'tet', 'graduation', 'wedding', 'funeral', 'get_well', 'custom',
] as const;

export type Occasion = typeof OCCASIONS[number];

export const RELATIONSHIP_TYPES = [
  'family', 'friend', 'lover', 'colleague', 'other',
] as const;

export type RelationshipType = typeof RELATIONSHIP_TYPES[number];

export const SEASONS = ['spring', 'summer', 'autumn', 'winter', 'all_year'] as const;
export type Season = typeof SEASONS[number];

export const PRODUCT_CATEGORIES = [
  'single_flower', 'bouquet', 'arrangement', 'basket', 'box', 'subscription_pack', 'custom',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const NOTIFICATION_TYPES = [
  'order_status', 'event_reminder', 'ai_suggestion', 'promo',
  'review_request', 'system', 'subscription_renewal', 'shop_reply',
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

export const SUBSCRIPTION_PLANS = ['weekly', 'biweekly', 'monthly'] as const;
export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[number];

export const EVENT_TYPES = [
  'birthday', 'anniversary', 'holiday', 'graduation', 'wedding', 'custom',
] as const;

export type EventType = typeof EVENT_TYPES[number];

export const CULTURAL_CONTEXTS = ['vietnam', 'general', 'western'] as const;
export type CulturalContext = typeof CULTURAL_CONTEXTS[number];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
