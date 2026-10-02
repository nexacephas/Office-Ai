import type { KeyboardEvent } from 'react'
import type { SubscriptionPlanId } from '../../../types'
import './PlanCard.css'

interface PlanCardProps {
  id: SubscriptionPlanId
  name: string
  description: string
  price: string
  billing: string
  features: string[]
  popular?: boolean
  selected: boolean
  onSelect: () => void
}

export default function PlanCard({
  id,
  name,
  description,
  price,
  billing,
  features,
  popular = false,
  selected,
  onSelect,
}: PlanCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <article
      className={`plan-card${selected ? ' is-selected' : ''}${popular ? ' is-popular' : ''}`}
      role="radio"
      aria-checked={selected}
      aria-label={`${name} plan, ${price}, ${billing}${popular ? ', Most Popular' : ''}`}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {popular && <span className="plan-card-popular">Most Popular</span>}
      <div className="plan-card-heading">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>

      <div className="plan-card-price-block">
        <p className="plan-card-price">{price}</p>
        <p className="plan-card-billing">{billing}</p>
      </div>

      <ul className="plan-card-features" aria-label={`${name} plan features`}>
        {features.map((feature) => (
          <li key={feature}>
            <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
              <path d="m4 10 4 4 8-8" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="plan-card-footer">
        {selected ? (
          <span className="plan-card-selected-label">
            <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
              <path d="m4 10 4 4 8-8" />
            </svg>
            Selected
          </span>
        ) : (
          <span className="plan-card-action">
            {id === 'enterprise' ? 'Contact Sales' : `Choose ${name}`}
          </span>
        )}
      </div>
    </article>
  )
}