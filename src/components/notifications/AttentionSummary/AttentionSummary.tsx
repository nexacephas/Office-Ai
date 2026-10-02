import type { NotificationIconName } from '../NotificationIcon'
import NotificationIcon from '../NotificationIcon'
import type { NotificationRecord, NotificationType } from '../notificationTypes'
import './AttentionSummary.css'

type Props = { items: NotificationRecord[]; iconFor: (type: NotificationType) => NotificationIconName; formatTime: (timestamp: string) => string; onReview: () => void; onOpen: (item: NotificationRecord) => void }

export default function AttentionSummary({ items, iconFor, formatTime, onReview, onOpen }: Props) {
  const approvalCount = items.filter((item) => item.type === 'Approvals').length
  const overdueTasks = items.filter((item) => item.type === 'Tasks' && item.title.toLowerCase().includes('overdue')).length
  const correspondenceCount = items.filter((item) => item.type === 'Correspondence').length
  const securityCount = items.filter((item) => item.type === 'System').length
  const summary = [approvalCount && `${approvalCount} approval${approvalCount === 1 ? '' : 's'} awaiting your decision`, overdueTasks && `${overdueTasks} overdue task${overdueTasks === 1 ? '' : 's'}`, correspondenceCount && `${correspondenceCount} correspondence item${correspondenceCount === 1 ? '' : 's'} awaiting response`, securityCount && `${securityCount} security event${securityCount === 1 ? '' : 's'} to review`].filter(Boolean).join(' · ')
  return (
    <section className="attention-summary" aria-label="Items needing attention">
      <div className="attention-summary-icon"><NotificationIcon name="clock" size={18} /></div>
      <div className="attention-summary-copy"><strong>{items.length} {items.length === 1 ? 'item needs' : 'items need'} your attention</strong><span>{summary}</span></div>
      <div className="attention-summary-preview">{items.slice(0, 2).map((item) => <button type="button" key={item.id} title={`${item.title} · ${formatTime(item.timestamp)}`} onClick={() => onOpen(item)}><NotificationIcon name={iconFor(item.type)} size={14} />{item.title}</button>)}</div>
      <button type="button" className="attention-summary-review" onClick={onReview}>Review attention items <NotificationIcon name="arrow" size={15} /></button>
    </section>
  )
}