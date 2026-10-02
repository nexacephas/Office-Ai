import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NotificationRecord, NotificationTab, NotificationType } from '../../components/notifications/notificationTypes'
import NotificationsHeader from '../../components/notifications/NotificationsHeader/NotificationsHeader'
import AttentionSummary from '../../components/notifications/AttentionSummary/AttentionSummary'
import NotificationTabs from '../../components/notifications/NotificationTabs/NotificationTabs'
import NotificationToolbar from '../../components/notifications/NotificationToolbar/NotificationToolbar'
import NotificationList from '../../components/notifications/NotificationList/NotificationList'
import NotificationDetail from '../../components/notifications/NotificationDetail/NotificationDetail'
import NotificationBulkActions from '../../components/notifications/NotificationBulkActions/NotificationBulkActions'
import EmptyNotifications from '../../components/notifications/EmptyNotifications/EmptyNotifications'
import NotificationError from '../../components/notifications/NotificationError/NotificationError'
import NotificationIcon from '../../components/notifications/NotificationIcon'
import { loadMockNotifications } from './notificationData'
import './Notifications.css'

type DateFilter = 'All dates' | 'Today' | 'Yesterday' | 'Last 7 days' | 'Older'

function groupFor(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const daysAgo = Math.round((day.getTime() - target.getTime()) / 86_400_000)
  if (daysAgo <= 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 7) return 'Earlier this week'
  return 'Earlier'
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  if (groupFor(timestamp) === 'Today') return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date)
  if (groupFor(timestamp) === 'Yesterday') return `Yesterday, ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date)}`
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', ...(date.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}) }).format(date)
}

function iconFor(type: NotificationType): 'task' | 'approval' | 'mail' | 'meeting' | 'document' | 'registry' | 'ai' | 'system' {
  if (type === 'Tasks') return 'task'
  if (type === 'Approvals') return 'approval'
  if (type === 'Correspondence') return 'mail'
  if (type === 'Meetings') return 'meeting'
  if (type === 'Documents') return 'document'
  if (type === 'Files & Registry') return 'registry'
  if (type === 'AI') return 'ai'
  return 'system'
}

export default function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [tab, setTab] = useState<NotificationTab>('All')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Read' | 'Unread'>('All')
  const [priorityFilter, setPriorityFilter] = useState<'All' | NotificationRecord['priority']>('All')
  const [dateFilter, setDateFilter] = useState<DateFilter>('All dates')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detail, setDetail] = useState<NotificationRecord | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const [actionLoading, setActionLoading] = useState(false)

  async function loadNotifications() {
    setLoading(true)
    setLoadError(false)
    try {
      setNotifications(await loadMockNotifications())
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadNotifications() }, [])

  const activeNotifications = notifications.filter((notification) => !notification.archived)
  const unreadCount = activeNotifications.filter((notification) => !notification.read).length
  const attentionItems = activeNotifications.filter((notification) => notification.actionRequired && !notification.read)
  const counts = useMemo(() => ({
    All: activeNotifications.length,
    Unread: activeNotifications.filter((notification) => !notification.read).length,
    'Action Required': activeNotifications.filter((notification) => notification.actionRequired && !notification.read).length,
    Mentions: activeNotifications.filter((notification) => notification.mention && !notification.read).length,
    System: activeNotifications.filter((notification) => notification.type === 'System').length,
  }), [activeNotifications])

  const filtered = activeNotifications.filter((notification) => {
    if (tab === 'Unread' && notification.read) return false
    if (tab === 'Action Required' && (!notification.actionRequired || notification.read)) return false
    if (tab === 'Mentions' && !notification.mention) return false
    if (tab === 'System' && notification.type !== 'System') return false
    if (typeFilter !== 'All' && notification.type !== typeFilter) return false
    if (statusFilter === 'Read' && !notification.read) return false
    if (statusFilter === 'Unread' && notification.read) return false
    if (priorityFilter !== 'All' && notification.priority !== priorityFilter) return false
    const age = (Date.now() - new Date(notification.timestamp).getTime()) / 86_400_000
    if (dateFilter === 'Today' && groupFor(notification.timestamp) !== 'Today') return false
    if (dateFilter === 'Yesterday' && groupFor(notification.timestamp) !== 'Yesterday') return false
    if (dateFilter === 'Last 7 days' && age > 7) return false
    if (dateFilter === 'Older' && age <= 7) return false
    const query = search.trim().toLowerCase()
    if (query && ![notification.title, notification.message, notification.type, notification.relatedType, notification.relatedId, notification.actor].some((value) => value.toLowerCase().includes(query))) return false
    return true
  })
  const visible = filtered.slice(0, visibleCount)
  const groups = ['Today', 'Yesterday', 'Earlier this week', 'Earlier'].flatMap((label) => {
    const items = visible.filter((notification) => groupFor(notification.timestamp) === label)
    return items.length ? [{ label, items }] : []
  })
  const hasFilters = search.length > 0 || typeFilter !== 'All' || statusFilter !== 'All' || priorityFilter !== 'All' || dateFilter !== 'All dates'

  function updateNotifications(ids: string[], change: Partial<NotificationRecord>) {
    setNotifications((current) => current.map((notification) => ids.includes(notification.id) ? { ...notification, ...change } : notification))
  }

  async function performAction(action: () => void) {
    if (actionLoading) return
    setActionLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, 160))
    action()
    setActionLoading(false)
  }

  function openNotification(notification: NotificationRecord) {
    updateNotifications([notification.id], { read: true })
    setDetail(null)
    navigate(notification.route)
  }

  function showDetails(notification: NotificationRecord) {
    setDetail(notification)
    setDetailLoading(true)
    window.setTimeout(() => setDetailLoading(false), 180)
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id])
  }

  function toggleSelectVisible() {
    const visibleIds = visible.map((notification) => notification.id)
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))
    setSelectedIds((current) => allSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  }

  function clearFilters() {
    setSearch('')
    setTypeFilter('All')
    setStatusFilter('All')
    setPriorityFilter('All')
    setDateFilter('All dates')
  }

  function showAttentionItems() {
    setTab('Action Required')
    setTypeFilter('All')
    setStatusFilter('All')
    setPriorityFilter('All')
    setDateFilter('All dates')
    setSearch('')
  }

  return (
    <section className="notifications-page">
      <NotificationsHeader unreadCount={unreadCount} onMarkAllRead={() => void performAction(() => updateNotifications(activeNotifications.map((item) => item.id), { read: true }))} onSettings={() => navigate('/settings/notifications')} loading={actionLoading} />
      <div className="notifications-workspace">
        {attentionItems.length > 0 && <AttentionSummary items={attentionItems} iconFor={iconFor} formatTime={formatTime} onReview={showAttentionItems} onOpen={openNotification} />}
        <section className="notifications-feed" aria-label="Notification activity">
          <NotificationTabs active={tab} counts={counts} onChange={(nextTab) => { setTab(nextTab); setSelectedIds([]); setVisibleCount(8) }} />
          <NotificationToolbar search={search} type={typeFilter} status={statusFilter} priority={priorityFilter} date={dateFilter} filtersOpen={filtersOpen} hasFilters={hasFilters} onSearch={setSearch} onType={setTypeFilter} onStatus={setStatusFilter} onPriority={setPriorityFilter} onDate={setDateFilter} onToggleFilters={() => setFiltersOpen((open) => !open)} onClear={clearFilters} />
          <NotificationBulkActions selectedCount={selectedIds.length} allVisibleSelected={visible.length > 0 && visible.every((item) => selectedIds.includes(item.id))} loading={actionLoading} onToggleAll={toggleSelectVisible} onMarkRead={() => void performAction(() => { updateNotifications(selectedIds, { read: true }); setSelectedIds([]) })} onMarkUnread={() => void performAction(() => { updateNotifications(selectedIds, { read: false }); setSelectedIds([]) })} onArchive={() => void performAction(() => { updateNotifications(selectedIds, { archived: true }); setSelectedIds([]) })} />
          {loadError ? <NotificationError onRetry={() => void loadNotifications()} /> : <NotificationList loading={loading} groups={groups} selectedIds={selectedIds} formatTime={formatTime} iconFor={iconFor} onOpen={openNotification} onDetails={showDetails} onSelect={toggleSelected} />}
          {!loading && !loadError && filtered.length === 0 && <EmptyNotifications tab={tab} hasFilters={hasFilters} onClearFilters={clearFilters} onViewAll={() => { setTab('All'); clearFilters() }} />}
          {!loading && !loadError && filtered.length > visibleCount && <button className="notifications-load-more" type="button" onClick={() => setVisibleCount((count) => count + 8)}>Load more notifications <span>{visible.length} of {filtered.length}</span></button>}
          {!loading && !loadError && filtered.length > 0 && <p className="notifications-pagination-note">Showing {visible.length} of {filtered.length} notifications</p>}
        </section>
        <footer className="notifications-settings-note">
          <span className="notifications-settings-icon"><NotificationIcon name="settings" size={18} /></span>
          <span><strong>Control what OfficePilot notifies you about.</strong><small>Adjust the updates you receive across your workspace.</small></span>
          <button type="button" onClick={() => navigate('/settings/notifications')}>Manage notification settings <NotificationIcon name="arrow" size={16} /></button>
        </footer>
      </div>
      {detail && <NotificationDetail notification={detail} icon={iconFor(detail.type)} formatTime={formatTime} loading={detailLoading} onClose={() => setDetail(null)} onOpen={() => openNotification(detail)} onMarkRead={() => { updateNotifications([detail.id], { read: true }); setDetail((current) => current ? { ...current, read: true } : current) }} onDismiss={() => { updateNotifications([detail.id], { archived: true }); setDetail(null) }} />}
    </section>
  )
}