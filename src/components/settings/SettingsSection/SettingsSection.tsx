import type { ReactNode } from 'react'
import './SettingsSection.css'

export default function SettingsSection({ title, description, eyebrow, children }: { title: string; description: string; eyebrow: string; children: ReactNode }) {
  return <section className="settings-section"><header className="settings-section-header"><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></header><div className="settings-section-content">{children}</div></section>
}