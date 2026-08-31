import type { JobCategory } from '../types/jobs'

export const jobCategories: JobCategory[] = [
  {
    id: 'administration',
    name: 'Administration',
    slug: 'administration',
    icon: 'briefcase',
    description: 'Office admin, executive assistants, receptionists, and administrative support roles',
  },
  {
    id: 'accounting-finance',
    name: 'Accounting & Finance',
    slug: 'accounting-finance',
    icon: 'calculator',
    description: 'Accountants, auditors, financial analysts, bookkeepers, and finance professionals',
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    slug: 'sales-marketing',
    icon: 'megaphone',
    description: 'Sales representatives, marketing specialists, business development, and digital marketers',
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    slug: 'customer-service',
    icon: 'headphones',
    description: 'Call center agents, support specialists, client relations, and help desk roles',
  },
  {
    id: 'information-technology',
    name: 'Information Technology',
    slug: 'information-technology',
    icon: 'monitor',
    description: 'Software developers, system administrators, IT support, data analysts, and tech roles',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    slug: 'engineering',
    icon: 'cog',
    description: 'Mechanical, civil, electrical, chemical, and other engineering disciplines',
  },
  {
    id: 'construction',
    name: 'Construction',
    slug: 'construction',
    icon: 'hammer',
    description: 'Site managers, quantity surveyors, architects, and construction workers',
  },
  {
    id: 'electrical-solar',
    name: 'Electrical & Solar',
    slug: 'electrical-solar',
    icon: 'zap',
    description: 'Electricians, solar installers, inverter technicians, and renewable energy roles',
  },
  {
    id: 'education',
    name: 'Education',
    slug: 'education',
    icon: 'graduation-cap',
    description: 'Teachers, lecturers, tutors, trainers, and educational administrators',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    slug: 'healthcare',
    icon: 'heart-pulse',
    description: 'Doctors, nurses, pharmacists, lab technicians, and healthcare support staff',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    slug: 'hospitality',
    icon: 'utensils-crossed',
    description: 'Hotel staff, front desk, housekeeping, event coordinators, and tourism roles',
  },
  {
    id: 'restaurant-catering',
    name: 'Restaurant & Catering',
    slug: 'restaurant-catering',
    icon: 'chef-hat',
    description: 'Chefs, cooks, waiters, baristas, caterers, and food service professionals',
  },
  {
    id: 'driving-logistics',
    name: 'Driving & Logistics',
    slug: 'driving-logistics',
    icon: 'truck',
    description: 'Drivers, dispatch riders, logistics coordinators, warehouse, and supply chain roles',
  },
  {
    id: 'security',
    name: 'Security',
    slug: 'security',
    icon: 'shield',
    description: 'Security guards, supervisors, CCTV operators, and safety officers',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    slug: 'cleaning',
    icon: 'sparkles',
    description: 'Cleaners, janitors, sanitation workers, and facility maintenance staff',
  },
  {
    id: 'fashion-beauty',
    name: 'Fashion & Beauty',
    slug: 'fashion-beauty',
    icon: 'shirt',
    description: 'Tailors, fashion designers, makeup artists, hair stylists, and beauty professionals',
  },
  {
    id: 'skilled-trades',
    name: 'Skilled Trades',
    slug: 'skilled-trades',
    icon: 'wrench',
    description: 'Plumbers, welders, carpenters, mechanics, technicians, and artisans',
  },
  {
    id: 'retail',
    name: 'Retail',
    slug: 'retail',
    icon: 'store',
    description: 'Shop assistants, cashiers, store managers, merchandisers, and sales staff',
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    slug: 'agriculture',
    icon: 'tractor',
    description: 'Farm managers, agronomists, veterinary assistants, and agricultural workers',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    slug: 'manufacturing',
    icon: 'factory',
    description: 'Production supervisors, machine operators, quality control, and factory workers',
  },
  {
    id: 'internship',
    name: 'Internship',
    slug: 'internship',
    icon: 'graduation-cap',
    description: 'Internship opportunities for students and recent graduates',
  },
  {
    id: 'apprenticeship',
    name: 'Apprenticeship',
    slug: 'apprenticeship',
    icon: 'tool',
    description: 'Apprenticeship programs with hands-on training and certification',
  },
  {
    id: 'part-time',
    name: 'Part-Time Jobs',
    slug: 'part-time',
    icon: 'clock',
    description: 'Flexible part-time and weekend job opportunities',
  },
  {
    id: 'remote',
    name: 'Remote Jobs',
    slug: 'remote',
    icon: 'wifi',
    description: 'Work from home and remote opportunities across various fields',
  },
]

export function jobCategoryBySlug(slug: string): JobCategory | undefined {
  return jobCategories.find((category) => category.slug === slug)
}

export function jobCategoryByName(name: string): JobCategory | undefined {
  return jobCategories.find(
    (category) => category.name.toLowerCase() === name.toLowerCase(),
  )
}

export function getAllJobCategorySlugs(): string[] {
  return jobCategories.map((c) => c.slug)
}