import { Hero } from '../components/home/Hero'
import { PopularCategories } from '../components/home/PopularCategories'
import { FeaturedBusinesses } from '../components/home/FeaturedBusinesses'
import { PopularLocations } from '../components/home/PopularLocations'
import { HowItWorks } from '../components/home/HowItWorks'
import { ListBusinessCTA } from '../components/home/ListBusinessCTA'
import { JobsCTA } from '../components/home/JobsCTA'

function Home() {
  return (
    <>
      <Hero />
      <PopularCategories />
      <FeaturedBusinesses />
      <PopularLocations />
      <JobsCTA />
      <HowItWorks />
      <ListBusinessCTA />
    </>
  )
}

export default Home