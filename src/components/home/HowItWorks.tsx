import { Search, BadgeCheck, MessageCircle } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'

const steps = [
  {
    icon: Search,
    step: 'Step 1',
    title: 'Search',
    description:
      'Search by service or category and narrow results by location across Oyo State.',
  },
  {
    icon: BadgeCheck,
    step: 'Step 2',
    title: 'Compare',
    description:
      'Review ratings, verified badges, services and opening hours side by side.',
  },
  {
    icon: MessageCircle,
    step: 'Step 3',
    title: 'Contact',
    description:
      'Reach providers instantly by call or WhatsApp.',
  },
]

export function HowItWorks() {
  return (
    <section className="section section--tinted">
      <div className="container">
        <SectionHeading
          eyebrow="Simple by design"
          title="How OyoConnect works"
          subtitle="Three easy steps from search to service."
        />
        <div className="steps">
          {steps.map((step, index) => (
            <div key={step.title} className="step">
              <div className="step__top">
                <span className="step__icon" aria-hidden="true">
                  <step.icon size={26} />
                </span>
                {index < steps.length - 1 ? (
                  <span className="step__line" aria-hidden="true" />
                ) : null}
              </div>
              <p className="step__number">{step.step}</p>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}