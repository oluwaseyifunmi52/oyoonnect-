export interface NavItem {
  label: string
  to: string
  submenu?: ReadonlyArray<{ label: string; to: string }>
}

export const siteConfig = {
  name: 'OyoConnect',
  tagline: 'Find trusted businesses, services & jobs in Oyo State',
  description:
    'OyoConnect is the easiest way to discover trusted businesses, verified services, local professionals and job opportunities across Oyo State, Nigeria.',
  state: 'Oyo State, Nigeria',
  email: 'oyoconnect5@gmail.com',
  phone: '+234 816 670 9577',
  url: 'https://oyoconnect.ng',
  // Core platform modules — kept in sync with PLATFORM_NAV in
  // src/components/navigation/PlatformNav.tsx. Home is excluded here because
  // the Logo already links to the home route.
  nav: [
    { label: 'Businesses', to: '/business' },
    { label: 'Search', to: '/search' },
    { label: 'Jobs', to: '/jobs' },
    { label: 'Community', to: '/community' },
    { label: 'Help', to: '/help' },
    { label: 'Services', to: '/services' },
  ] as const satisfies readonly NavItem[],
} as const