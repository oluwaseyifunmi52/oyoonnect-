import type { Location } from '../types/business'

export const locations: Location[] = [
  {
    id: 'afijio',
    name: 'Afijio',
    tagline: 'Explore businesses in Afijio',
  },
  {
    id: 'akinyele',
    name: 'Akinyele',
    tagline: 'Explore businesses in Akinyele',
  },
  {
    id: 'atiba',
    name: 'Atiba',
    tagline: 'Explore businesses in Atiba',
  },
  {
    id: 'atisbo',
    name: 'Atisbo',
    tagline: 'Explore businesses in Atisbo',
  },
  {
    id: 'egbeda',
    name: 'Egbeda',
    tagline: 'Explore businesses in Egbeda',
  },
  {
    id: 'ibadan-north',
    name: 'Ibadan North',
    tagline: 'Explore businesses in Ibadan North',
  },
  {
    id: 'ibadan-north-east',
    name: 'Ibadan North-East',
    tagline: 'Explore businesses in Ibadan North-East',
  },
  {
    id: 'ibadan-north-west',
    name: 'Ibadan North-West',
    tagline: 'Explore businesses in Ibadan North-West',
  },
  {
    id: 'ibadan-south-east',
    name: 'Ibadan South-East',
    tagline: 'Explore businesses in Ibadan South-East',
  },
  {
    id: 'ibadan-south-west',
    name: 'Ibadan South-West',
    tagline: 'Explore businesses in Ibadan South-West',
  },
  {
    id: 'ibarapa-central',
    name: 'Ibarapa Central',
    tagline: 'Explore businesses in Ibarapa Central',
  },
  {
    id: 'ibarapa-east',
    name: 'Ibarapa East',
    tagline: 'Explore businesses in Ibarapa East',
  },
  {
    id: 'ibarapa-north',
    name: 'Ibarapa North',
    tagline: 'Explore businesses in Ibarapa North',
  },
  {
    id: 'ido',
    name: 'Ido',
    tagline: 'Explore businesses in Ido',
  },
  {
    id: 'irepo',
    name: 'Irepo',
    tagline: 'Explore businesses in Irepo',
  },
  {
    id: 'iseyin',
    name: 'Iseyin',
    tagline: 'Explore businesses in Iseyin',
  },
  {
    id: 'itesiwaju',
    name: 'Itesiwaju',
    tagline: 'Explore businesses in Itesiwaju',
  },
  {
    id: 'iwajowa',
    name: 'Iwajowa',
    tagline: 'Explore businesses in Iwajowa',
  },
  {
    id: 'kajola',
    name: 'Kajola',
    tagline: 'Explore businesses in Kajola',
  },
  {
    id: 'lagelu',
    name: 'Lagelu',
    tagline: 'Explore businesses in Lagelu',
  },
  {
    id: 'ogbomoso-north',
    name: 'Ogbomoso North',
    tagline: 'Explore businesses in Ogbomoso North',
  },
  {
    id: 'ogbomoso-south',
    name: 'Ogbomoso South',
    tagline: 'Explore businesses in Ogbomoso South',
  },
  {
    id: 'ogo-oluwa',
    name: 'Ogo-Oluwa',
    tagline: 'Explore businesses in Ogo-Oluwa',
  },
  {
    id: 'olorunsogo',
    name: 'Olorunsogo',
    tagline: 'Explore businesses in Olorunsogo',
  },
  {
    id: 'oluyole',
    name: 'Oluyole',
    tagline: 'Explore businesses in Oluyole',
  },
  {
    id: 'ona-ara',
    name: 'Ona-Ara',
    tagline: 'Explore businesses in Ona-Ara',
  },
  {
    id: 'oorelope',
    name: 'Oorelope',
    tagline: 'Explore businesses in Oorelope',
  },
  {
    id: 'oriire',
    name: 'Oriire',
    tagline: 'Explore businesses in Oriire',
  },
  {
    id: 'oyo-east',
    name: 'Oyo East',
    tagline: 'Explore businesses in Oyo East',
  },
  {
    id: 'oyo-west',
    name: 'Oyo West',
    tagline: 'Explore businesses in Oyo West',
  },
  {
    id: 'saki-east',
    name: 'Saki East',
    tagline: 'Explore businesses in Saki East',
  },
  {
    id: 'saki-west',
    name: 'Saki West',
    tagline: 'Explore businesses in Saki West',
  },
  {
    id: 'surulere',
    name: 'Surulere',
    tagline: 'Explore businesses in Surulere',
  },
]

/**
 * Towns/Cities within each LGA.
 * Used for the Town/City dropdown after selecting an LGA.
 */
export const townsByLocation: Record<string, string[]> = {
  afijio: ['Jobele', 'Ilora', 'Fiditi', 'Akinmorin', 'Awe'],
  akinyele: ['Moniya', 'Ojoo', 'Sasa', 'Ikereku', 'Iroko', 'Olorunsogo'],
  atiba: ['Oyo Town', 'Offa Meta', 'Owode', 'Apaara', 'Ilora'],
  atisbo: ['Tede', 'Ago-Are', 'Temidire', 'Ilero'],
  egbeda: ['Egbeda', 'Akobo', 'Alakia', 'Olodo', 'Olorunda', 'Kute', 'Erinwusi'],
  'ibadan-north': ['Bodija', 'Agodi', 'UI', 'Sango', 'Mokola', 'Samonda', 'Yemetu', 'Dugbe'],
  'ibadan-north-east': ['Iwo Road', 'Orita-Merin', 'Oje', 'Monatan', 'Ogunpa', 'Kudeti'],
  'ibadan-north-west': ['Onireke', 'Eleyele', 'Abadina', 'Ologuneru', 'Apata', 'Alesinloye'],
  'ibadan-south-east': ['Mapo', 'Oke-Aremo', 'Challenge', 'Molete', 'Owode', 'Bere'],
  'ibadan-south-west': ['Ring Road', 'Jericho', 'Eleyele', 'Apata', 'Oluyole', 'Onireke', 'Stadium'],
  'ibarapa-central': ['Igboora', 'Idere', 'Ayete'],
  'ibarapa-east': ['Eruwa', 'Lanlate', 'Mayin'],
  'ibarapa-north': ['Ayete', 'Igangan', 'Tapa', 'Igbole'],
  ido: ['Ido', 'Omi-Adio', 'Apata', 'Akufo', 'Kumapayi', 'Gidado', 'Iyana-Offa'],
  irepo: ['Kisi', 'Igboho', 'Oke-Amu'],
  iseyin: ['Iseyin', 'Oke-Ola', 'Isalu', 'Ekunle', 'Molete', 'Koso', 'Aso-Oke'],
  itesiwaju: ['Otu', 'Ilero'],
  iwajowa: ['Iwere-Ile', 'Ilero'],
  kajola: ['Okeho', 'Ayegun', 'Ilero'],
  lagelu: ['Iyana-Offa', 'Lalupon', 'Oyedeji', 'Monatan', 'Ogunjobi', 'Ajibode'],
  'ogbomoso-north': ['Kinnira', 'Oja-Igbo', 'Sabo', 'Under-G', 'Careful', 'Abaa'],
  'ogbomoso-south': ['Arowomole', 'Isale-Afon', 'Oke-Ado', 'Takie', 'Oja-Tuntun', 'Masifa'],
  'ogo-oluwa': ['Ajaawa', 'Odo-Oba', 'Ikoyi-Ile'],
  olorunsogo: ['Igbeti', 'Oke-Amu', 'Kisi'],
  oluyole: ['Idi-Ayunre', 'Apata', 'Alesinloye', 'Challenge', 'Oluyole Estate', 'Ring Road', 'Oke-Ado'],
  'ona-ara': ['Akanran', 'Oyedeji', 'Akobo', 'Olodo', 'Iwo Road', 'Ojurin'],
  oorelope: ['Igboho', 'Igbeti', 'Kisi'],
  oriire: ['Ikoyi', 'Temidire', 'Olokoto', 'Ahoro-Dada'],
  'oyo-east': ['Kosobo', 'Oyo Town', 'Owode', 'Sabo', 'Apaara', 'Akeetan'],
  'oyo-west': ['Ojongbodu', 'Owode', 'Palace Road', 'Oyo Town', 'Idi-Ope', 'Sabo', 'Ilora'],
  'saki-east': ['Ago-Amodu', 'Korede', 'Sepeteri'],
  'saki-west': ['Saki', 'Oke-Afin', 'Isale-Oyo', 'Ago-Are'],
  surulere: ['Iresaadu', 'Oko', 'Orile Igbon', 'Surulere'],
}

/**
 * Bus stops / transport points / popular landmarks by LGA.
 *
 * These are intended as user-friendly location selectors,
 * not as an official exhaustive government bus-stop register.
 */
export const busStopsByLocation: Record<string, string[]> = {
  afijio: [
    'Jobele',
    'Ilora',
    'Jobele Junction',
    'Ilora Junction',
    'Akinmorin Road',
    'Jobele Market',
  ],

  akinyele: [
    'Moniya',
    'Moniya Garage',
    'Ojoo',
    'Ojoo Bus Stop',
    'Sasa',
    'Akinyele Junction',
    'IITA',
    'Olorunsogo',
    'Ikereku',
    'Igbo-Oloyin',
  ],

  atiba: [
    'Offa Meta',
    'Offa Meta Junction',
    'Oyo Town',
    'Oyo Palace',
    'Owode',
    'Oja-Agbe',
    'Idi-Ayunre Road',
  ],

  atisbo: [
    'Tede',
    'Tede Junction',
    'Ago-Are',
    'Ago-Are Junction',
    'Temidire',
    'Ago-Are Road',
  ],

  egbeda: [
    'Egbeda',
    'Egbeda Junction',
    'Akobo',
    'Alakia',
    'Iyana-Church',
    'Olodo',
    'Olorunda',
    'Kute',
    'Akinyele Road',
  ],

   'ibadan-north': [
    'Bodija',
    'Bodija Market',
    'Agodi Gate',
    'UI Gate',
    'University of Ibadan',
    'Sango',
    'Mokola',
    'Secretariat',
    'Samonda',
    'Yemetu',
    'Dugbe',
  ],

  'ibadan-north-east': [
    'Iwo Road',
    'Iwo Road Interchange',
    'Gate',
    'Challenge Road Junction',
    'Orita-Merin',
    'Kudeti',
    'Oje',
    'Monatan',
    'Ojoo Road',
    'Ogunpa',
  ],

  'ibadan-north-west': [
    'Onireke',
    'Eleyele',
    'Eleyele Junction',
    'Abadina',
    'Ologuneru',
    'Apata',
    'Sango',
    'Mokola',
    'Alesinloye',
  ],

  'ibadan-south-east': [
    'Mapo',
    'Mapo Junction',
    'Oke-Aremo',
    'Orita-Merin',
    'Gate',
    'Odo-Ona',
    'Challenge',
    'Molete',
    'Owode',
    'Bere',
  ],

  'ibadan-south-west': [
    'Ring Road',
    'Alesinloye',
    'Jericho',
    'Eleyele',
    'Apata',
    'Odo-Ona',
    'Oluyole',
    'Onireke',
    'Mokola',
    'Stadium',
  ],

  'ibarapa-central': [
    'Igboora',
    'Igboora Garage',
    'Igboora Market',
    'Igboora Junction',
    'Ayete Road',
    'Eruwa Road',
    'Idere Road',
  ],

  'ibarapa-east': [
    'Eruwa',
    'Eruwa Garage',
    'Eruwa Motor Park',
    'Town Centre',
    'Oja-Oba',
    'Lanlate Junction',
    'Akinyele Road',
  ],

  'ibarapa-north': [
    'Ayete',
    'Ayete Junction',
    'Igangan',
    'Igangan Junction',
    'Tapa',
    'Igbole',
    'Igboora Road',
  ],

  ido: [
    'Ido',
    'Ido Junction',
    'Omi-Adio',
    'Apata',
    'Akufo',
    'Kumapayi',
    'Gidado',
    'Iyana-Offa',
  ],

  irepo: [
    'Kisi',
    'Kisi Garage',
    'Kisi Junction',
    'Kisi Market',
    'Kishi-Oyo Road',
    'Igboho Road',
  ],

  iseyin: [
    'Iseyin',
    'Iseyin Garage',
    'Iseyin Motor Park',
    'Oke-Ola',
    'Isalu',
    'Ekunle',
    'Molete',
    'Koso',
    'Aso-Oke',
    'Iseyin-Oyo Road',
  ],

  itesiwaju: [
    'Otu',
    'Otu Junction',
    'Otu Garage',
    'Ilero',
    'Ilero Junction',
    'Iseyin-Otu Road',
  ],

  iwajowa: [
    'Iwere-Ile',
    'Iwere-Ile Junction',
    'Iwere-Ile Garage',
    'Ilero',
    'Ilero Junction',
    'Iwere Road',
  ],

  kajola: [
    'Okeho',
    'Okeho Garage',
    'Okeho Junction',
    'Ilero Road',
    'Ayegun',
    'Imeko Road',
  ],

  lagelu: [
    'Iyana-Offa',
    'Iyana-Offa Junction',
    'Lalupon',
    'Lalupon Garage',
    'Oyedeji',
    'Monatan',
    'Ogunjobi',
    'Ajibode',
  ],

  'ogbomoso-north': [
    'Kinnira',
    'Kinnira Junction',
    'Oja-Igbo',
    'Oja-Igbo Market',
    'Sabo',
    'Under-G',
    'Ilorin Road',
    'Careful Junction',
    'Abaa',
  ],

  'ogbomoso-south': [
    'Arowomole',
    'Arowomole Junction',
    'Arowomole Garage',
    'Isale-Afon',
    'Oke-Ado',
    'Sabo',
    'Takie',
    'Oja-Tuntun',
    'Masifa',
  ],

  'ogo-oluwa': [
    'Ajaawa',
    'Ajaawa Junction',
    'Ajaawa Market',
    'Odo-Oba',
    'Odo-Oba Junction',
    'Ikoyi-Ile Road',
  ],

  olorunsogo: [
    'Igbeti',
    'Igbeti Garage',
    'Igbeti Market',
    'Igbeti Junction',
    'Ilorin Road',
    'Oke-Amu',
    'Kisi Road',
  ],

  oluyole: [
    'Idi-Ayunre',
    'Idi-Ayunre Junction',
    'Apata',
    'Alesinloye',
    'Odo-Ona',
    'Challenge',
    'Oluyole Estate',
    'Ring Road',
    'Oke-Ado',
  ],

  'ona-ara': [
    'Akanran',
    'Akanran Junction',
    'Oyedeji',
    'Akobo',
    'Olodo',
    'Iwo Road',
    'Idi-Ayunre Road',
    'Ojurin',
  ],

  oorelope: [
    'Igboho',
    'Igboho Garage',
    'Igboho Junction',
    'Igboho Market',
    'Igbeti Road',
    'Kisi Road',
    'Igboho-Oyo Road',
  ],

  oriire: [
    'Ikoyi',
    'Ikoyi Junction',
    'Ikoyi Market',
    'Temidire',
    'Ogbomoso Road',
    'Olokoto',
    'Ahoro-Dada',
  ],

  'oyo-east': [
    'Kosobo',
    'Kosobo Junction',
    'Oyo Town',
    'Oyo Palace',
    'Owode',
    'Sabo',
    'Apaara',
    'Akeetan',
  ],

  'oyo-west': [
    'Ojongbodu',
    'Ojongbodu Junction',
    'Owode',
    'Palace Road',
    'Oyo Town',
    'Idi-Ope',
    'Sabo',
    'Ilora Road',
  ],

  'saki-east': [
    'Ago-Amodu',
    'Ago-Amodu Junction',
    'Ago-Amodu Garage',
    'Korede',
    'Sepeteri Road',
    'Saki-Oyo Road',
  ],

  'saki-west': [
    'Saki',
    'Saki Garage',
    'Saki Motor Park',
    'Main Market',
    'Oke-Afin',
    'Isale-Oyo',
    'Ago-Are Road',
    'Saki-Oyo Road',
    'Ogunpa',
  ],

  surulere: [
    'Iresaadu',
    'Iresaadu Junction',
    'Iresaadu Garage',
    'Oko',
    'Orile Igbon',
    'Ogbomoso Road',
    'Igbeti Road',
    'Surulere Market',
  ],
}

/**
 * Get one LGA by name.
 */
export function locationByName(name: string): Location | undefined {
  return locations.find(
    (location) =>
      location.name.toLowerCase() === name.toLowerCase(),
  )
}

/**
 * Get LGA by ID.
 */
export function locationById(id: string): Location | undefined {
  return locations.find((location) => location.id === id)
}

/**
 * Get towns/cities for an LGA.
 */
export function getTownsForLocation(locationId: string): string[] {
  return townsByLocation[locationId] || []
}

/**
 * Get bus stops for an LGA.
 */
export function getBusStopsForLocation(locationId: string): string[] {
  return busStopsByLocation[locationId] || []
}

/**
 * Get all LGA names.
 */
export function getAllLocationNames(): string[] {
  return locations.map((location) => location.name)
}

/**
 * Get areas for a location (alias for getTownsForLocation for backward compatibility).
 */
export function getAreasForLocation(locationName: string): string[] {
  const location = locations.find((l) => l.name === locationName)
  return location ? getTownsForLocation(location.id) : []
}

/**
 * Get all LGA IDs.
 */
export function getAllLocationIds(): string[] {
  return locations.map((location) => location.id)
}

/**
 * Get the center coordinates for an LGA (approximate).
 * Used for initial map positioning.
 */
export function getLocationCenter(locationId: string): { lat: number; lng: number } | undefined {
  const centers: Record<string, { lat: number; lng: number }> = {
    afijio: { lat: 7.8333, lng: 3.8667 },
    akinyele: { lat: 7.5167, lng: 3.8667 },
    atiba: { lat: 7.8500, lng: 3.9333 },
    atisbo: { lat: 8.3500, lng: 4.1000 },
    egbeda: { lat: 7.3833, lng: 3.9167 },
    'ibadan-north': { lat: 7.4333, lng: 3.9000 },
    'ibadan-north-east': { lat: 7.4167, lng: 3.9333 },
    'ibadan-north-west': { lat: 7.4333, lng: 3.8833 },
    'ibadan-south-east': { lat: 7.3833, lng: 3.9000 },
    'ibadan-south-west': { lat: 7.3833, lng: 3.8833 },
    'ibarapa-central': { lat: 7.5167, lng: 3.3833 },
    'ibarapa-east': { lat: 7.5167, lng: 3.4167 },
    'ibarapa-north': { lat: 7.7167, lng: 3.3500 },
    ido: { lat: 7.4500, lng: 3.8000 },
    irepo: { lat: 8.7000, lng: 4.1000 },
    iseyin: { lat: 7.9667, lng: 3.6000 },
    itesiwaju: { lat: 8.2500, lng: 3.8667 },
    iwajowa: { lat: 8.1833, lng: 3.8667 },
    kajola: { lat: 8.2000, lng: 3.4000 },
    lagelu: { lat: 7.5333, lng: 3.8667 },
    'ogbomoso-north': { lat: 8.1333, lng: 4.2500 },
    'ogbomoso-south': { lat: 8.1167, lng: 4.2333 },
    'ogo-oluwa': { lat: 8.2167, lng: 4.1167 },
    olorunsogo: { lat: 8.6000, lng: 4.0000 },
    oluyole: { lat: 7.3833, lng: 3.8833 },
    'ona-ara': { lat: 7.3500, lng: 3.9167 },
    oorelope: { lat: 8.4167, lng: 3.9667 },
    oriire: { lat: 8.2167, lng: 4.1167 },
    'oyo-east': { lat: 7.8500, lng: 3.9333 },
    'oyo-west': { lat: 7.8500, lng: 3.9333 },
    'saki-east': { lat: 8.6667, lng: 3.4000 },
    'saki-west': { lat: 8.6667, lng: 3.3833 },
    surulere: { lat: 8.1333, lng: 4.0667 },
  }
  return centers[locationId]
}