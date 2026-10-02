import type { CorrespondenceSummaryFilter } from '../correspondenceTypes'
import CorrespondenceIcon from './CorrespondenceIcon'
import './CorrespondenceStats.css'

interface CorrespondenceStatsProps {
  active: CorrespondenceSummaryFilter
  onSelect: (filter: Exclude<CorrespondenceSummaryFilter, null>) => void
}

const summaries = [
  { id: 'incoming', label: 'Incoming', count: '24', icon: 'inbox', detail: 'received' },
  { id: 'awaiting', label: 'Awaiting response', count: '8', icon: 'clock', detail: 'needs a reply' },
  { id: 'outgoing', label: 'Outgoing', count: '31', icon: 'send', detail: 'sent by your team' },
  { id: 'overdue', label: 'Overdue', count: '3', icon: 'alert', detail: 'past response date' },
] as const

export default function CorrespondenceStats({ active, onSelect }: CorrespondenceStatsProps) {
  return (
    <section className="correspondence-stats" aria-label="Correspondence overview">
      {summaries.map((summary) => <button type="button" key={summary.id} className={`correspondence-stat correspondence-stat--${summary.id} ${active === summary.id ? 'is-active' : ''}`} aria-pressed={active === summary.id} onClick={() => onSelect(summary.id)}>
        <span className="correspondence-stat-icon"><CorrespondenceIcon name={summary.icon} size={17} /></span>
        <span className="correspondence-stat-copy"><span>{summary.label}</span><small>{summary.detail}</small></span>
        <strong>{summary.count}</strong>
      </button>)}
    </section>
  )
}