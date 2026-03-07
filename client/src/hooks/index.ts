export { useAuth } from './use-auth';
export { useRequireAuth } from './use-require-auth';
export {
  useCreateOrder,
  useOrders,
  useOrder,
  useCancelOrder,
  useOrderTracking,
  type Order,
  type OrderItem,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus,
  type CreateOrderPayload,
  type OrderFilters,
} from './use-orders';

// ─── Profile ─────────────────────────────────────────────────────────────────
export {
  useProfile,
  useUpdateProfile,
  useUpdatePreferences,
  useUpdateAvatar,
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useResendVerification,
  profileQueryKey,
  type User,
  type UserAddress,
  type UserPreferences,
  type Address,
  type AddressInput,
} from './use-profile';

// ─── Relationships ────────────────────────────────────────────────────────────
export {
  useRelationships,
  useRelationship,
  useCreateRelationship,
  useUpdateRelationship,
  useDeleteRelationship,
  relationshipsQueryKey,
  type Relationship,
  type RelationshipType,
  type ImportantDate,
  type FlowerPreferences,
  type RelationshipsFilters,
  type PaginatedRelationships,
  type CreateRelationshipBody,
  type UpdateRelationshipBody,
} from './use-relationships';

// ─── Events ───────────────────────────────────────────────────────────────────
export {
  useEvents,
  useUpcomingEvents,
  useEvent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  eventsQueryKey,
  type Event,
  type EventType,
  type ReminderSettings,
  type EventsFilters,
  type PaginatedEvents,
  type CreateEventBody,
  type UpdateEventBody,
} from './use-events';

// ─── Flowers ──────────────────────────────────────────────────────────────────
export {
  useFlowers,
  useFlower,
  useFlowersByEmotion,
  useFlowersByOccasion,
  useFlowerMeanings,
  flowerKeys,
  type Flower,
  type FlowerMeaning,
  type FlowerFilters,
  type FlowerPagination,
} from './use-flowers';

// ─── Products ─────────────────────────────────────────────────────────────────
export {
  useProducts,
  useProduct,
  productKeys,
  type Product,
  type ProductFilters,
  type ProductPagination,
} from './use-products';

// ─── Shops ────────────────────────────────────────────────────────────────────
export {
  useShops,
  useShop,
  useShopProducts,
  shopKeys,
  type Shop,
  type ShopFilters,
  type ShopProductFilters,
  type ShopPagination,
} from './use-shops';

// ─── Recommendations ─────────────────────────────────────────────────────────
export {
  useQuizRecommendation,
  usePersonalizedRecommendations,
  useRecommendationHistory,
  type QuizInput,
  type RecommendedProduct,
} from './use-recommendations';

// ─── Notifications ────────────────────────────────────────────────────────────
export {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  notificationKeys,
  type Notification,
  type NotificationType,
  type NotificationFilters,
  type NotificationPagination,
} from './use-notifications';

// ─── Shop Management ──────────────────────────────────────────────────────────
export * from './use-shop-management';

// ─── Admin ───────────────────────────────────────────────────────────────────
export * from './use-admin';

// ─── Subscriptions ────────────────────────────────────────────────────────────
export {
  useSubscriptionPlans,
  useSubscriptions,
  useMySubscriptions,
  useSubscription,
  useCreateSubscription,
  useUpdateSubscription,
  usePauseSubscription,
  useResumeSubscription,
  useCancelSubscription,
  subscriptionKeys,
  type SubscriptionPlan,
  type SubscriptionPlanType,
  type SubscriptionStatus,
  type SubscriptionPaymentMethod,
  type SubscriptionPreferences,
  type SubscriptionDeliveryAddress,
  type Subscription,
  type CreateSubscriptionPayload,
  type UpdateSubscriptionPayload,
  type SubscriptionFilters,
} from './use-subscriptions';
