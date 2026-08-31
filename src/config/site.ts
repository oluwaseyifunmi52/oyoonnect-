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
  nav: [
    { label: 'Manage Business', to: '/business' },
    { label: 'Find Jobs', to: '/jobs' },
    { label: 'Community', to: '/community' },
    { label: 'Help', to: '/help' },
  ] as const satisfies readonly NavItem[],
} as const