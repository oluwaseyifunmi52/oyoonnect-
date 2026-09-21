/**
 * Application-level feature flags.
 *
 * Each flag is a boolean that gates the visibility of a feature across the UI
 * (nav items, routes, etc.). Set the value to `true` to enable the feature or
 * `false` to hide it entirely (users will not see nav links and routes should
 * redirect/404).
 */
export const FEATURES = {
  /**
   * VTU (Value-Added Services) / digital-service modules.
   *
   * When `false`, the VTU-specific nav items (Data Bundles, Airtime, Electricity,
 * TV Subscriptions, Education, Recharge PIN, Digital Products, Games, Social
   * Media, Wallet, Profile) are hidden from the Services navbar. The public local
   * marketplace entry (`/services` → ServiceDiscovery) and the shared platform nav
   * (Home, Businesses, Search, Jobs, Community, Help, Services) remain visible.
   */
  VTU_SERVICES_ENABLED: false,
} as const

export type FeatureKey = keyof typeof FEATURES
