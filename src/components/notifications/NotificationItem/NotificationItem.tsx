import type { NotificationIconName } from '../NotificationIcon'
import NotificationIcon from '../NotificationIcon'
import type { NotificationRecord } from '../notificationTypes'
import './NotificationItem.css'

type Props = { item: NotificationRecord; selected: boolean; timestamp: string; icon: NotificationIconName; onOpen: () => void; onDetails: () => void; onSelect: () => void }

function actionLabel(item: NotificationRecord) {
  if (item.type === 'Approvals') return 'Review approval'
  if (item.type === 'Tasks') return item.title.toLowerCase().includes('overdue') ? 'Open task' : 'View task'
  if (item.type === 'Correspondence') return 'Open correspondence'
  if (item.type === 'Meetings') return 'View meeting'
  if (item.type === 'Documents') return 'Open document'
  if (item.type === 'Files & Registry') return 'View file'
  if (item.type === 'System') return 'Review security'
  if (item.title.toLowerCase().includes('summary')) return 'View summary'
  return 'Open item'
}

export default function NotificationItem({ item, selected, timestamp, icon, onOpen, onDetails, onSelect }: Props) {
  return (
    <article className={`notification-item${item.read ? '' : ' is-unread'}${selected ? ' is-selected' : ''}`}>
      <label className="notification-select" aria-label={`Select ${item.title}`}><input type="checkbox" checked={selected} onChange={onSelect} /><span /></label>
      <div className={`notification-type-icon type-${item.type.toLowerCase().replace(/[^a-z]+/g, '-')}`}><NotificationIcon name={icon} size={18} /></div>
      <button type="button" className="notification-item-content" onClick={onOpen}>
        <span className="notification-item-title-row"><strong>{item.title}</strong>{!item.read && <i className="notification-unread-dot" aria-label="Unread" />}</span>
        <span className="notification-item-message">{item.message}</span>
        <span className="notification-item-meta"><span>{item.type}</span><span aria-hidden="true">·</span><span>{item.relatedType}: {item.relatedId}</span><span aria-hidden="true">·</span><time dateTime={item.timestamp}>{timestamp}</time></span>
      </button>
      <div className="notification-item-trailing">
        {item.actionRequired && <span className="notification-action-badge">{item.title.toLowerCase().includes('overdue') ? 'Overdue' : 'Action required'}</span>}
        {!item.actionRequired && (item.priority === 'Urgent' || item.priority === 'High') && <span className={`notification-priority priority-${item.priority.toLowerCase()}`}>{item.priority}</span>}
        <button type="button" className="notification-open-action" onClick={onOpen}>{actionLabel(item)} <NotificationIcon name="arrow" size={14} /></button>
        <button type="button" className="notification-details-action" aria-label={`Details for ${item.title}`} title="Notification details" onClick={onDetails}><NotificationIcon name="info" size={16} /></button>
      </div>
    </article>
  )
}