import NotificationIcon from '../NotificationIcon'
import './NotificationBulkActions.css'

type Props = { selectedCount: number; allVisibleSelected: boolean; loading: boolean; onToggleAll: () => void; onMarkRead: () => void; onMarkUnread: () => void; onArchive: () => void }

export default function NotificationBulkActions({ selectedCount, allVisibleSelected, loading, onToggleAll, onMarkRead, onMarkUnread, onArchive }: Props) {
  return (
    <div className="notification-bulk-actions">
      <label className="notification-select-all"><input type="checkbox" checked={allVisibleSelected} onChange={onToggleAll} aria-label="Select all visible notifications" /><span /> Select visible</label>
      {selectedCount > 0 && <><span className="notification-selected-count">{selectedCount} selected</span><div className="notification-bulk-buttons"><button type="button" disabled={loading} onClick={onMarkRead}><NotificationIcon name="check" size={15} /> Mark read</button><button type="button" disabled={loading} onClick={onMarkUnread}><NotificationIcon name="bell" size={15} /> Mark unread</button><button type="button" disabled={loading} onClick={onArchive}><NotificationIcon name="archive" size={15} /> Archive</button></div></>}
    </div>
  )
}