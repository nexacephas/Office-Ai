import type { CorrespondenceTab } from '../correspondenceTypes'
import './CorrespondenceTabs.css'

const tabs: CorrespondenceTab[] = ['All', 'Incoming', 'Outgoing', 'Drafts', 'Awaiting Response', 'Archived']

export default function CorrespondenceTabs({ active, onChange }: { active: CorrespondenceTab; onChange: (tab: CorrespondenceTab) => void }) {
  return <nav className="correspondence-tabs" aria-label="Correspondence views" role="tablist">{tabs.map((tab) => <button type="button" key={tab} role="tab" aria-selected={active === tab} className={active === tab ? 'is-active' : ''} onClick={() => onChange(tab)}>{tab}</button>)}</nav>
}