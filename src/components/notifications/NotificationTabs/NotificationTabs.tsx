import type { NotificationTab } from '../notificationTypes'
import './NotificationTabs.css'

const tabs: NotificationTab[] = ['All', 'Unread', 'Action Required', 'Mentions', 'System']
type Props = { active: NotificationTab; counts: Record<NotificationTab, number>; onChange: (tab: NotificationTab) => void }

export default function NotificationTabs({ active, counts, onChange }: Props) {
  return <div className="notification-tabs" role="tablist" aria-label="Notification filters">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={active === tab} className={active === tab ? 'is-active' : ''} onClick={() => onChange(tab)}>{tab}{(tab === 'Unread' || tab === 'Action Required') && counts[tab] > 0 && <span>{counts[tab]}</span>}</button>)}</div>
}