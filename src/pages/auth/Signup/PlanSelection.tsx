import { Link } from 'react-router-dom'
import PlanCard from '../../../components/subscription/PlanCard/PlanCard'
import { subscriptionPlans } from '../../../config/subscriptionPlans'
import type { SubscriptionPlanId } from '../../../types'
import './PlanSelection.css'

interface PlanSelectionProps {
  selectedPlan: SubscriptionPlanId | null
  onSelect: (plan: SubscriptionPlanId) => void
  onContinue: () => void
}

function OfficePilotMark() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 32 32">
      <path d="M8 25V11.5L16 7l8 4.5V25" />
      <path d="M12 25v-7h8v7M5 25h22M16 7V4" />
      <path d="m25 5 .8 2.2L28 8l-2.2.8L25 11l-.8-2.2L22 8l2.2-.8L25 5Z" />
    </svg>
  )
}

export default function PlanSelection({ selectedPlan, onSelect, onContinue }: PlanSelectionProps) {
  const selectedPlanDetails = subscriptionPlans.find((plan) => plan.id === selectedPlan)

  return (
    <main className="plan-selection-page">
      <div className="plan-selection-container">
        <header className="signup-flow-header">
          <Link className="signup-flow-brand" to="/" aria-label="OfficePilot AI home">
            <span className="signup-flow-brand-mark"><OfficePilotMark /></span>
            <span>OfficePilot <strong>AI</strong></span>
          </Link>
          <ol className="signup-progress" aria-label="Signup progress">
            <li aria-current="step"><span>1</span> Choose plan</li>
            <li><span>2</span> Create workspace</li>
          </ol>
        </header>

        <section className="plan-selection-content" aria-labelledby="plan-selection-title">
          <div className="plan-selection-heading">
            <p className="plan-selection-eyebrow">STEP 1 OF 2</p>
            <h1 id="plan-selection-title">Choose your plan</h1>
            <p>Start with the plan that fits your organization&apos;s needs. You can change your plan later.</p>
          </div>

          <div className="plan-card-grid" role="radiogroup" aria-label="Select a subscription plan">
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                {...plan}
                selected={selectedPlan === plan.id}
                onSelect={() => onSelect(plan.id)}
              />
            ))}
          </div>

          <div className="plan-selection-actions">
            <button
              className="btn btn-primary plan-selection-continue"
              type="button"
              disabled={!selectedPlanDetails}
              onClick={onContinue}
            >
              {selectedPlanDetails ? `Continue with ${selectedPlanDetails.name}` : 'Choose a plan to continue'}
            </button>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </section>
      </div>
    </main>
  )
}