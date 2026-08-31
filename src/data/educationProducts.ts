import type { EducationProduct } from '../types/bills'

export const educationProducts: EducationProduct[] = [
  {
    id: 'waec-registration',
    name: 'WAEC Registration',
    type: 'waec',
    price: 18000,
    description: 'West African Senior School Certificate Examination (WASSCE) registration for school candidates',
    provider: 'WAEC Nigeria',
    image: '/images/education/waec.svg',
  },
  {
    id: 'waec-gce',
    name: 'WAEC GCE Registration',
    type: 'waec',
    price: 21000,
    description: 'West African Senior School Certificate Examination (WASSCE) registration for private candidates',
    provider: 'WAEC Nigeria',
    image: '/images/education/waec-gce.svg',
  },
  {
    id: 'neco-registration',
    name: 'NECO Registration',
    type: 'neco',
    price: 15000,
    description: 'National Examinations Council (NECO) Senior Secondary Certificate Examination registration',
    provider: 'NECO Nigeria',
    image: '/images/education/neco.svg',
  },
  {
    id: 'neco-gce',
    name: 'NECO GCE Registration',
    type: 'neco',
    price: 18000,
    description: 'NECO General Certificate Examination registration for private candidates',
    provider: 'NECO Nigeria',
    image: '/images/education/neco-gce.svg',
  },
  {
    id: 'nabteb-registration',
    name: 'NABTEB Registration',
    type: 'nabteb',
    price: 12000,
    description: 'National Business and Technical Examinations Board registration for technical/business exams',
    provider: 'NABTEB Nigeria',
    image: '/images/education/nabteb.svg',
  },
  {
    id: 'jamb-registration',
    name: 'JAMB UTME Registration',
    type: 'jamb',
    price: 6200,
    description: 'Joint Admissions and Matriculation Board Unified Tertiary Matriculation Examination registration',
    provider: 'JAMB Nigeria',
    image: '/images/education/jamb.svg',
  },
  {
    id: 'jamb-direct-entry',
    name: 'JAMB Direct Entry Registration',
    type: 'jamb',
    price: 6200,
    description: 'JAMB Direct Entry registration for candidates with A-level, ND, NCE, or equivalent qualifications',
    provider: 'JAMB Nigeria',
    image: '/images/education/jamb-de.svg',
  },
  {
    id: 'scratch-card-waec',
    name: 'WAEC Result Checker PIN',
    type: 'other',
    price: 500,
    description: 'Scratch card to check WAEC results online',
    provider: 'WAEC Nigeria',
    image: '/images/education/waec-pin.svg',
  },
  {
    id: 'scratch-card-neco',
    name: 'NECO Result Checker PIN',
    type: 'other',
    price: 500,
    description: 'Scratch card to check NECO results online',
    provider: 'NECO Nigeria',
    image: '/images/education/neco-pin.svg',
  },
  {
    id: 'jamb-profile',
    name: 'JAMB Profile Creation',
    type: 'jamb',
    price: 1000,
    description: 'Create JAMB profile and generate profile code for UTME/DE registration',
    provider: 'JAMB Nigeria',
    image: '/images/education/jamb-profile.svg',
  },
]

export function getEducationProductById(id: string): EducationProduct | undefined {
  return educationProducts.find((product) => product.id === id)
}

export function getEducationProductsByType(type: EducationProduct['type']): EducationProduct[] {
  return educationProducts.filter((product) => product.type === type)
}

export function getAllEducationProducts(): EducationProduct[] {
  return educationProducts
}