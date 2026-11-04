export interface NavItem {
  label: string
  to: string
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
  // Core platform modules — flat navigation, no submenus
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Jobs', to: '/jobs' },
    { label: 'Businesses', to: '/business' },
    { label: 'Community', to: '/community' },
    { label: 'Watch', to: '/watch' },
    { label: 'Messages', to: '/messages' },
    { label: 'Services', to: '/services' },
    { label: 'Wallet', to: '/wallet' },
  ] as const satisfies readonly NavItem[],
}
