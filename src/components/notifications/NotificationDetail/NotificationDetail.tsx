import { useEffect } from 'react'
import type { NotificationIconName } from '../NotificationIcon'
import NotificationIcon from '../NotificationIcon'
import type { NotificationRecord } from '../notificationTypes'
import './NotificationDetail.css'

type Props = { notification: NotificationRecord; icon: NotificationIconName; formatTime: (timestamp: string) => string; loading: boolean; onClose: () => void; onOpen: () => void; onMarkRead: () => void; onDismiss: () => void }

export default function NotificationDetail({ notification, icon, formatTime, loading, onClose, onOpen, onMarkRead, onDismiss }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="notification-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="notification-detail-sheet" role="dialog" aria-modal="true" aria-labelledby="notification-detail-title">
        <header className="notification-detail-header"><div><span className="notification-detail-kicker">NOTIFICATION DETAILS</span><h2 id="notification-detail-title">Activity detail</h2></div><button type="button" className="notification-detail-close" onClick={onClose} aria-label="Close details"><NotificationIcon name="close" size={19} /></button></header>
        {loading ? <div className="notification-detail-loading" role="status" aria-label="Loading notification details"><i /><i /><i /></div> : <div className="notification-detail-body">
          <div className="notification-detail-title"><span className="notification-detail-icon"><NotificationIcon name={icon} size={20} /></span><div><h3>{notification.title}</h3><span>{notification.type}{notification.actionRequired ? ' · Action required' : ''}</span></div></div>
          <p className="notification-detail-description">{notification.message}</p>
          <dl className="notification-detail-fields"><div><dt>Created</dt><dd>{new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.timestamp))}</dd></div><div><dt>Related item</dt><dd>{notification.relatedType} · {notification.relatedId}</dd></div><div><dt>Triggered by</dt><dd>{notification.actor}</dd></div><div><dt>Status</dt><dd>{notification.read ? 'Read' : 'Unread'}</dd></div></dl>
          <div className="notification-detail-activity"><h4>Activity</h4><ol>{notification.activity.map((activity, index) => <li key={`${notification.id}-activity-${index}`}><span className="notification-detail-activity-dot" /><span>{activity}<small>{index === 0 ? formatTime(notification.timestamp) : 'Related activity'}</small></span></li>)}</ol></div>
        </div>}
        {!loading && <footer className="notification-detail-footer"><button type="button" className="notification-detail-dismiss" onClick={onDismiss}><NotificationIcon name="archive" size={16} /> Dismiss</button>{!notification.read && <button type="button" className="notification-detail-read" onClick={onMarkRead}>Mark as read</button>}<button type="button" className="notification-detail-open" onClick={onOpen}>{notification.type === 'System' ? 'Review security' : 'Open related item'} <NotificationIcon name="arrow" size={15} /></button></footer>}
      </section>
    </div>
  )
}