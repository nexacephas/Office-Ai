import NotificationIcon from '../NotificationIcon'
import './NotificationsHeader.css'

type Props = { unreadCount: number; loading: boolean; onMarkAllRead: () => void; onSettings: () => void }

export default function NotificationsHeader({ unreadCount, loading, onMarkAllRead, onSettings }: Props) {
  return (
    <header className="notifications-header">
      <div className="notifications-header-copy">
        <span className="notifications-eyebrow">WORKPLACE ACTIVITY</span>
        <div className="notifications-title-row"><h1>Notifications</h1>{unreadCount > 0 && <span className="notifications-unread-total">{unreadCount} unread</span>}</div>
        <p>Stay informed about work, approvals, deadlines, and activity that needs your attention.</p>
      </div>
      <div className="notifications-header-actions">
        <button type="button" className="notifications-secondary-action" onClick={onSettings}><NotificationIcon name="settings" size={16} /> Notification settings</button>
        <button type="button" className="notifications-primary-action" onClick={onMarkAllRead} disabled={loading || unreadCount === 0}><NotificationIcon name="check" size={16} /> Mark all as read</button>
      </div>
    </header>
  )
}