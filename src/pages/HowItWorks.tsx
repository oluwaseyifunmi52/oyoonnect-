import { Search, BadgeCheck, MessageCircle, Store, ShieldCheck, Sparkles } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ButtonLink } from '../components/ui/Button'

const steps = [
  {
    icon: Search,
    step: 'Step 1',
    title: 'Search for what you need',
    description:
      'Type a service like "mechanic" or "jollof rice", then pick your town or city. Our directory covers every major part of Oyo State.',
  },
  {
    icon: BadgeCheck,
    step: 'Step 2',
    title: 'Compare trusted options',
    description:
      'Compare ratings, review counts, verified badges, services and opening hours so you can choose with confidence.',
  },
  {
    icon: MessageCircle,
    step: 'Step 3',
    title: 'Contact in one tap',
    description:
      'Call the business directly or message them on WhatsApp. No accounts, no forms, no waiting.',
  },
]

const perks = [
  {
    icon: ShieldCheck,
    title: 'Verified providers',
    description:
      'Listings we verify get a badge, so you always know who you are dealing with.',
  },
  {
    icon: Sparkles,
    title: 'Honest ratings',
    description:
      'Real reviews from real customers help you find quality every single time.',
  },
  {
    icon: Store,
    title: 'Local first',
    description:
      'Everything is built around Oyo State — from Ibadan to Iseyin and beyond.',
  },
]

function HowItWorks() {
  return (
    <main className="page">
      <div className="container container--narrow">
        <SectionHeading
          eyebrow="Simple by design"
          title="How OyoConnect works"
          subtitle="We make finding local services as easy as searching, comparing and contacting."
        />

        <div className="steps steps--vertical">
          {steps.map((item, index) => (
            <div key={item.title} className="step step--vertical">
              <div className="step__icon" aria-hidden="true">
                <item.icon size={26} />
              </div>
              <div className="step__content">
                <p className="step__number">{item.step}</p>
                <h3 className="step__title">{item.title}</h3>
                <p className="step__description">{item.description}</p>
              </div>
              {index < steps.length - 1 ? (
                <span className="step__line step__line--vertical" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="perks">
          {perks.map((perk) => (
            <div key={perk.title} className="perk">
              <perk.icon className="perk__icon" size={26} aria-hidden="true" />
              <h3 className="perk__title">{perk.title}</h3>
              <p className="perk__description">{perk.description}</p>
            </div>
          ))}
        </div>

        <div className="page-cta">
          <h2 className="page-cta__title">Own a business in Oyo State?</h2>
          <p className="page-cta__text">
            Get listed for free and let customers find you.
          </p>
          <ButtonLink to="/list-business" variant="primary" size="lg">
            List your business
          </ButtonLink>
        </div>
      </div>
    </main>
  )
}

export default HowItWorks