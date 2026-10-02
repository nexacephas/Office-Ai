import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout'
import { subscriptionPlans } from '../../../config/subscriptionPlans'
import {
  clearPendingPlan,
  createTemporaryAccount,
  getPendingPlan,
  isAuthenticated,
  savePendingPlan,
} from '../../../services/authService'
import type { SubscriptionPlanId } from '../../../types'
import PlanSelection from './PlanSelection'
import './Signup.css'

interface SignupErrors {
  fullName?: string
  email?: string
  organization?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Signup() {
  const navigate = useNavigate()
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId | null>(() => getPendingPlan() ?? 'free')
  const [step, setStep] = useState<'plan' | 'workspace' | 'enterprise-confirmation'>('workspace')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<SignupErrors>({})
  const selectedPlan = subscriptionPlans.find((plan) => plan.id === selectedPlanId) ?? subscriptionPlans[0]

  if (isAuthenticated() && step !== 'enterprise-confirmation') {
    return <Navigate to="/dashboard" replace />
  }

  if (step === 'plan') {
    return (
      <PlanSelection
        selectedPlan={selectedPlanId}
        onSelect={(plan) => {
          setSelectedPlanId(plan)
          savePendingPlan(plan)
        }}
        onContinue={() => {
          if (selectedPlan) setStep('workspace')
        }}
      />
    )
  }

  if (step === 'enterprise-confirmation') {
    return (
      <AuthLayout brandMessage="A dedicated partnership for organization-wide operations.">
        <section className="signup-enterprise-confirmation" aria-labelledby="enterprise-confirmation-title">
          <span className="signup-confirmation-mark" aria-hidden="true">
            <svg fill="none" viewBox="0 0 24 24">
              <path d="m5 12 4.5 4.5L19 7" />
            </svg>
          </span>
          <h1 id="enterprise-confirmation-title">Enterprise workspace request received</h1>
          <p>
            Thank you for choosing OfficePilot Enterprise. Our team will contact you to discuss your organization&apos;s requirements.
          </p>
          <button
            className="btn btn-primary auth-submit"
            type="button"
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            Continue to Dashboard
          </button>
        </section>
      </AuthLayout>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: SignupErrors = {}
    if (!fullName.trim()) nextErrors.fullName = 'Enter your full name.'
    if (!email.trim()) {
      nextErrors.email = 'Enter your work email.'
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!organization.trim()) nextErrors.organization = 'Enter your organization name.'
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.'
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }
    if (!acceptedTerms) nextErrors.terms = 'You must agree to continue.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 300))
    createTemporaryAccount({
      name: fullName.trim(),
      email: email.trim(),
      organization: organization.trim(),
      plan: selectedPlan.id,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      planBilling: selectedPlan.billing,
    })
    clearPendingPlan()

    if (selectedPlan.id === 'enterprise') {
      setIsSubmitting(false)
      setStep('enterprise-confirmation')
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthLayout brandMessage="Give your organization one clear place to move work forward.">
      <div className="signup-plan-summary">
        <div>
          <span className="signup-plan-name">{selectedPlan.name} Plan</span>
          <span className="signup-plan-price">
            {selectedPlan.price}{' '}
            <span>
              {selectedPlan.billing.startsWith('per ')
                ? `/ ${selectedPlan.billing.slice(4)}`
                : `· ${selectedPlan.billing}`}
            </span>
          </span>
        </div>
        <button className="auth-text-link signup-change-plan" type="button" onClick={() => setStep('plan')}>
          Change plan
        </button>
      </div>
      <div className="auth-heading">
        <h1>Create your workspace</h1>
        <p>Set up your organization&apos;s intelligent operations workspace.</p>
      </div>

      <form className="auth-form signup-form" noValidate onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor="signup-name">
          <span className="auth-label">Full name</span>
          <input
            id="signup-name"
            className="auth-input"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={fullName}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'signup-name-error' : undefined}
            onChange={(event) => {
              setFullName(event.target.value)
              setErrors((current) => ({ ...current, fullName: undefined }))
            }}
          />
          {errors.fullName && <span id="signup-name-error" className="auth-error" role="alert">{errors.fullName}</span>}
        </label>

        <label className="auth-field" htmlFor="signup-email">
          <span className="auth-label">Work email</span>
          <input
            id="signup-email"
            className="auth-input"
            type="email"
            autoComplete="email"
            placeholder="name@organization.com"
            value={email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: undefined }))
            }}
          />
          {errors.email && <span id="signup-email-error" className="auth-error" role="alert">{errors.email}</span>}
        </label>

        <label className="auth-field" htmlFor="signup-organization">
          <span className="auth-label">Organization name</span>
          <input
            id="signup-organization"
            className="auth-input"
            type="text"
            autoComplete="organization"
            placeholder="Your organization"
            value={organization}
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={errors.organization ? 'signup-organization-error' : undefined}
            onChange={(event) => {
              setOrganization(event.target.value)
              setErrors((current) => ({ ...current, organization: undefined }))
            }}
          />
          {errors.organization && <span id="signup-organization-error" className="auth-error" role="alert">{errors.organization}</span>}
        </label>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-password">Password</label>
          <span className="auth-password-wrap">
            <input
              id="signup-password"
              className="auth-input"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrors((current) => ({ ...current, password: undefined }))
              }}
            />
            <button
              className="auth-password-toggle"
              type="button"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isPasswordVisible}
              onClick={() => setIsPasswordVisible((visible) => !visible)}
            >
              {isPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </span>
          {errors.password && <span id="signup-password-error" className="auth-error" role="alert">{errors.password}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-confirm-password">Confirm password</label>
          <span className="auth-password-wrap">
            <input
              id="signup-confirm-password"
              className="auth-input"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setErrors((current) => ({ ...current, confirmPassword: undefined }))
              }}
            />
            <button
              className="auth-password-toggle"
              type="button"
              aria-label={isConfirmPasswordVisible ? 'Hide confirmation password' : 'Show confirmation password'}
              aria-pressed={isConfirmPasswordVisible}
              onClick={() => setIsConfirmPasswordVisible((visible) => !visible)}
            >
              {isConfirmPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </span>
          {errors.confirmPassword && <span id="signup-confirm-password-error" className="auth-error" role="alert">{errors.confirmPassword}</span>}
        </div>

        <div className="signup-terms-block">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={acceptedTerms}
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={errors.terms ? 'signup-terms-error' : undefined}
              onChange={(event) => {
                setAcceptedTerms(event.target.checked)
                setErrors((current) => ({ ...current, terms: undefined }))
              }}
            />
            <span>I agree to the terms and privacy policy.</span>
          </label>
          {errors.terms && <span id="signup-terms-error" className="auth-error" role="alert">{errors.terms}</span>}
        </div>

        <button className="btn btn-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating workspace...' : 'Create Workspace'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link className="auth-text-link" to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}