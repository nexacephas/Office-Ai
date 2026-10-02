import type { NotificationTab } from '../notificationTypes'
import NotificationIcon from '../NotificationIcon'
import './EmptyNotifications.css'

type Props = { tab: NotificationTab; hasFilters: boolean; onClearFilters: () => void; onViewAll: () => void }

export default function EmptyNotifications({ tab, hasFilters, onClearFilters, onViewAll }: Props) {
  const actionEmpty = tab === 'Action Required'
  const unreadEmpty = tab === 'Unread'
  return <div className="empty-notifications"><span className="empty-notifications-icon"><NotificationIcon name={actionEmpty || unreadEmpty ? 'check' : 'bell'} size={22} /></span><h2>{actionEmpty ? 'Nothing needs your attention right now.' : unreadEmpty ? "You're all caught up." : 'No notifications found.'}</h2><p>{hasFilters ? 'Try adjusting your search or filters.' : unreadEmpty ? 'No unread notifications.' : actionEmpty ? 'Any work that needs a decision will appear here.' : 'Workplace updates will appear here as activity happens.'}</p>{hasFilters ? <button type="button" onClick={onClearFilters}>Clear filters</button> : unreadEmpty ? <button type="button" onClick={onViewAll}>View all notifications</button> : null}</div>
}