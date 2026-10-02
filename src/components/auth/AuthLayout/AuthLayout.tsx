import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './AuthLayout.css'

interface AuthLayoutProps {
  brandMessage: string
  children: ReactNode
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

function Brand({ className = '' }: { className?: string }) {
  return (
    <Link className={`auth-brand ${className}`} to="/" aria-label="OfficePilot AI home">
      <span className="auth-brand-mark"><OfficePilotMark /></span>
      <span className="auth-brand-name">OfficePilot <span>AI</span></span>
    </Link>
  )
}

export default function AuthLayout({ brandMessage, children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <aside className="auth-brand-panel">
        <Brand />
        <div className="auth-brand-copy">
          <span className="auth-brand-label">AI OFFICE OPERATIONS</span>
          <h2>{brandMessage}</h2>
        </div>
        <p className="auth-brand-footnote">Intelligent operations for modern organizations.</p>
      </aside>
      <main className="auth-form-panel">
        <Brand className="auth-mobile-brand" />
        <section className="auth-form-card">{children}</section>
      </main>
    </div>
  )
}