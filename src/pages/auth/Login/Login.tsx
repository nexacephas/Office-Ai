import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout'
import { isAuthenticated, startTemporarySession } from '../../../services/authService'
import './Login.css'

interface LoginErrors {
  email?: string
  password?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: LoginErrors = {}
    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      nextErrors.email = 'Enter your work email.'
    } else if (!isValidEmail(normalizedEmail)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password) {
      nextErrors.password = 'Enter your password.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 300))
    startTemporarySession()
    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthLayout brandMessage="Bring clarity to the work behind every decision.">
      <div className="auth-heading">
        <h1>Welcome back</h1>
        <p>Sign in to continue to your OfficePilot workspace.</p>
      </div>

      <form className="auth-form login-form" noValidate onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor="login-email">
          <span className="auth-label">Work email</span>
          <input
            id="login-email"
            className="auth-input"
            type="email"
            autoComplete="email"
            placeholder="name@organization.com"
            value={email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: undefined }))
            }}
          />
          {errors.email && <span id="login-email-error" className="auth-error" role="alert">{errors.email}</span>}
        </label>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">Password</label>
          <span className="auth-password-wrap">
            <input
              id="login-password"
              className="auth-input"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
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
          {errors.password && <span id="login-password-error" className="auth-error" role="alert">{errors.password}</span>}
        </div>

        <div className="auth-options-row">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <Link className="auth-text-link" to="/forgot-password">Forgot password?</Link>
        </div>

        <button className="btn btn-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="auth-divider" aria-hidden="true">OR</div>

        <button className="auth-google-button" type="button" disabled>
          <span className="auth-google-mark" aria-hidden="true">G</span>
          Continue with Google
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account? <Link className="auth-text-link" to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  )
}