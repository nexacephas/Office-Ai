import { Link } from 'react-router-dom'
import './Intro.css'

function OfficePilotMark() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 32 32">
      <path d="M8 25V11.5L16 7l8 4.5V25" />
      <path d="M12 25v-7h8v7M5 25h22M16 7V4" />
      <path d="m25 5 .8 2.2L28 8l-2.2.8L25 11l-.8-2.2L22 8l2.2-.8L25 5Z" />
    </svg>
  )
}

export default function Intro() {
  return (
    <main className="intro-page">
      <header className="intro-header">
        <Link className="intro-brand" to="/" aria-label="OfficePilot AI home">
          <span className="intro-brand-mark"><OfficePilotMark /></span>
          <span>OfficePilot <strong>AI</strong></span>
        </Link>
        <span className="intro-header-label">OFFICE OPERATIONS PLATFORM</span>
      </header>

      <section className="intro-content" aria-labelledby="intro-title">
        <p className="intro-eyebrow"><span /> AI OFFICE OPERATIONS</p>
        <h1 id="intro-title">Your office. Organized, understood, and assisted by AI.</h1>
        <p className="intro-description">
          Manage documents, tasks, workflows, meetings and office knowledge from one intelligent workspace.
        </p>
        <Link className="intro-primary-action" to="/login">
          Get Started
          <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
            <path d="M3.5 10h12m-5-5 5 5-5 5" />
          </svg>
        </Link>
      </section>

      <footer className="intro-footer">
        <span className="intro-footer-rule" />
        <p>Intelligent operations for modern organizations.</p>
        <span className="intro-footer-note">SECURE BY DESIGN</span>
      </footer>

      <div className="intro-geometry" aria-hidden="true">
        <span className="intro-geometry-ring" />
        <span className="intro-geometry-core" />
        <span className="intro-geometry-line" />
      </div>
    </main>
  )
}