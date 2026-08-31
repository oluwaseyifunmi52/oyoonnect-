import { useState, useEffect } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { ButtonLink } from '../components/ui/Button'
import { Construction, ArrowRight } from 'lucide-react'

function ServicesHome() {
  return (
    <main className="page">
      <div className="container">
        <SectionHeading
          eyebrow="Bills & Digital Services"
          title="Services Coming Soon"
          subtitle="We're working hard to bring you bill payments, airtime, data bundles, TV subscriptions, and more. Stay tuned!"
        />
        <EmptyState
          icon={<Construction size={48} />}
          title="Services Coming Soon"
          description="Our digital services platform is currently under development. We're partnering with trusted providers to bring you secure bill payments, airtime recharges, data bundles, TV subscriptions, education products, and more."
          action={
            <ButtonLink to="/" variant="primary">
              <ArrowRight size={18} />
              Back to Business Directory
            </ButtonLink>
          }
        />
      </div>
    </main>
  )
}

export default ServicesHome