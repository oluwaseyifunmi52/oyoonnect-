import { MapPin, HeartHandshake, LineChart, Users } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ButtonLink } from '../components/ui/Button'
import { siteConfig } from '../config/site'

const values = [
  {
    icon: MapPin,
    title: 'Rooted in Oyo State',
    description:
      'We exist to connect residents with the amazing businesses already serving their communities every day.',
  },
  {
    icon: HeartHandshake,
    title: 'Trust above all',
    description:
      'Verified listings, honest ratings and transparent details — so you can decide with peace of mind.',
  },
  {
    icon: LineChart,
    title: 'Growth for local business',
    description:
      'Every business, no matter how small, deserves a professional platform to reach new customers.',
  },
  {
    icon: Users,
    title: 'Built with the community',
    description:
      'Your feedback shapes the platform. We listen to customers and business owners across the state.',
  },
]

function About() {
  return (
    <main className="page">
      <div className="container container--narrow">
        <SectionHeading
          eyebrow="Our story"
          title={`About ${siteConfig.name}`}
          subtitle="The simplest way to find trusted local services in Oyo State."
        />

        <div className="about-card">
          <h2 className="about-card__title">What is OyoConnect?</h2>
          <p className="about-card__text">
            <strong>OyoConnect is Oyo State's local business discovery platform, built to connect people with trusted businesses and service providers in their communities.</strong>
          </p>
          <p className="about-card__text">
            From a skilled mechanic in Ibadan to a fashion designer in Iseyin, a restaurant in Ogbomoso, or a farmer in Oyo, OyoConnect makes it easier to <strong>find, compare, contact, and connect with local businesses — all in one place.</strong>
          </p>
          <p className="about-card__text">
            We believe that great businesses are already serving the communities around us. The challenge is finding them, knowing who to trust, and reaching them when you need their services.
          </p>
          <p className="about-card__text">
            That is why OyoConnect brings local businesses closer to the people who need them.
          </p>
          <p className="about-card__text">
            Our mission is simple: <strong>make local businesses easier to discover, easier to trust, and easier to reach — while giving business owners the tools and visibility they need to grow.</strong>
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-card__title">Built for Oyo State</h2>
          <p className="about-card__text">
            OyoConnect is designed specifically for the communities, towns, cities, and local government areas that make up Oyo State. Whether you are looking for a business around Ibadan, Ogbomoso, Oyo, Iseyin, Saki, Eruwa, or another part of the state, OyoConnect helps you discover services close to you.
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-card__title">Trust Matters</h2>
          <p className="about-card__text">
            We believe finding a business should come with confidence. That's why we focus on <strong>verified business information, genuine customer reviews, ratings, contact details, photos, and clear locations</strong> so users can make informed decisions.
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-card__title">Helping Local Businesses Grow</h2>
          <p className="about-card__text">
            Many great businesses depend on word of mouth. OyoConnect gives them a professional online presence where they can showcase their <strong>services, work, photos, contact information, location, and customer reviews</strong> and reach more people across Oyo State.
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-card__title">Connecting Communities</h2>
          <p className="about-card__text">
            OyoConnect is more than a business directory. It is a platform built around the communities of Oyo State.
          </p>
          <p className="about-card__text">
            We listen to customers, business owners, and local communities so the platform continues to solve real problems and make it easier for people to support businesses around them.
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-card__title">Our Vision</h2>
          <p className="about-card__text">
            <strong>To become the most trusted platform for discovering and connecting with local businesses across Oyo State.</strong>
          </p>
        </div>

        <div className="about-card">
          <h2 className="about-card__title">Our Mission</h2>
          <p className="about-card__text">
            <strong>To connect every community in Oyo State with reliable local businesses while helping entrepreneurs and service providers build visibility, trust, and sustainable growth.</strong>
          </p>
        </div>

        <div className="values-grid">
          {values.map((value) => (
            <div key={value.title} className="value-card">
              <value.icon className="value-card__icon" size={26} aria-hidden="true" />
              <h3 className="value-card__title">{value.title}</h3>
              <p className="value-card__text">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="page-cta">
          <h2 className="page-cta__title">Join us in supporting local</h2>
          <p className="page-cta__text">
            Whether you are a customer or a business owner, there is a place for
            you on OyoConnect.
          </p>
          <ButtonLink to="/list-business" variant="primary" size="lg">
            List your business
          </ButtonLink>
        </div>
      </div>
    </main>
  )
}

export default About