import type { MeetingSummaryFilter } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './MeetingOverview.css'

const metrics = [
  { id: 'today', label: 'Today', detail: 'meetings', value: '4', icon: 'calendar' },
  { id: 'week', label: 'This week', detail: 'meetings', value: '12', icon: 'clock' },
  { id: 'preparation', label: 'Needs preparation', detail: 'upcoming', value: '3', icon: 'sparkles' },
  { id: 'followups', label: 'Follow-ups', detail: 'to track', value: '7', icon: 'task' },
] as const

export default function MeetingOverview({ active, onSelect }: { active: MeetingSummaryFilter; onSelect: (value: Exclude<MeetingSummaryFilter, null>) => void }) {
  return <section className="meeting-overview" aria-label="Meeting overview">{metrics.map((metric) => <button type="button" key={metric.id} className={`meeting-overview-item metric-${metric.id} ${active === metric.id ? 'is-active' : ''}`} aria-pressed={active === metric.id} onClick={() => onSelect(metric.id)}><span className="meeting-overview-icon"><MeetingIcon name={metric.icon} size={17} /></span><span className="meeting-overview-copy"><strong>{metric.label}</strong><small>{metric.detail}</small></span><b>{metric.value}</b></button>)}</section>
}