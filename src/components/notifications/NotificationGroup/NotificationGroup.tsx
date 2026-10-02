import type { NotificationIconName } from '../NotificationIcon'
import type { NotificationRecord, NotificationType } from '../notificationTypes'
import type { NotificationGroupData } from '../NotificationList/NotificationList'
import NotificationItem from '../NotificationItem/NotificationItem'
import './NotificationGroup.css'

type Props = { group: NotificationGroupData; selectedIds: string[]; formatTime: (timestamp: string) => string; iconFor: (type: NotificationType) => NotificationIconName; onOpen: (item: NotificationRecord) => void; onDetails: (item: NotificationRecord) => void; onSelect: (id: string) => void }

export default function NotificationGroup({ group, selectedIds, formatTime, iconFor, onOpen, onDetails, onSelect }: Props) {
  return <section className="notification-group"><h2>{group.label}</h2><div className="notification-group-items">{group.items.map((item) => <NotificationItem key={item.id} item={item} selected={selectedIds.includes(item.id)} timestamp={formatTime(item.timestamp)} icon={iconFor(item.type)} onOpen={() => onOpen(item)} onDetails={() => onDetails(item)} onSelect={() => onSelect(item.id)} />)}</div></section>
}