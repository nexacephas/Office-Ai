import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout'
import './ForgotPassword.css'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setError('Enter your work email.')
      return
    }
    if (!isValidEmail(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setError('')
    setIsSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <AuthLayout brandMessage="Account access, handled with care and clarity.">
      <div className="auth-heading">
        <h1>Reset your password</h1>
        <p>Enter your work email to request password reset instructions.</p>
      </div>

      {isSubmitted ? (
        <div className="auth-reset-success" role="status">
          <p className="auth-status">Your request is recorded for this demo. No email was sent.</p>
          <Link className="btn btn-primary auth-submit forgot-back-action" to="/login">Back to login</Link>
        </div>
      ) : (
        <form className="auth-form forgot-form" noValidate onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="reset-email">
            <span className="auth-label">Work email</span>
            <input
              id="reset-email"
              className="auth-input"
              type="email"
              autoComplete="email"
              placeholder="name@organization.com"
              value={email}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'reset-email-error' : undefined}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
            />
            {error && <span id="reset-email-error" className="auth-error" role="alert">{error}</span>}
          </label>
          <button className="btn btn-primary auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <p className="auth-footer">
        <Link className="auth-text-link" to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  )
}