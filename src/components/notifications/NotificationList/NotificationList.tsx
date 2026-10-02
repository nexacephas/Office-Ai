import type { NotificationIconName } from '../NotificationIcon'
import type { NotificationRecord, NotificationType } from '../notificationTypes'
import NotificationGroup from '../NotificationGroup/NotificationGroup'
import './NotificationList.css'

export type NotificationGroupData = { label: string; items: NotificationRecord[] }
type Props = { loading: boolean; groups: NotificationGroupData[]; selectedIds: string[]; formatTime: (timestamp: string) => string; iconFor: (type: NotificationType) => NotificationIconName; onOpen: (item: NotificationRecord) => void; onDetails: (item: NotificationRecord) => void; onSelect: (id: string) => void }

export default function NotificationList({ loading, groups, selectedIds, formatTime, iconFor, onOpen, onDetails, onSelect }: Props) {
  if (loading) return <div className="notification-skeleton-list" aria-label="Loading notifications" aria-busy="true">{Array.from({ length: 5 }, (_, index) => <div className="notification-skeleton" key={index}><i /><span><b /><b /><small /></span></div>)}</div>
  return <div className="notification-list">{groups.map((group) => <NotificationGroup key={group.label} group={group} selectedIds={selectedIds} formatTime={formatTime} iconFor={iconFor} onOpen={onOpen} onDetails={onDetails} onSelect={onSelect} />)}</div>
}