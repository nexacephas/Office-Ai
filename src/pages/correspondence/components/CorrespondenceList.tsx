import { useState } from 'react'
import type { CorrespondenceItem, CorrespondenceListAction, CorrespondenceStatus } from '../correspondenceTypes'
import { correspondenceStatusLabels } from '../correspondenceUtils'
import CorrespondenceIcon from './CorrespondenceIcon'
import './CorrespondenceList.css'

interface CorrespondenceListProps {
  items: CorrespondenceItem[]
  loading: boolean
  loadError: boolean
  activeTab: string
  search: string
  today: string
  onOpen: (item: CorrespondenceItem) => void
  onAction: (item: CorrespondenceItem, action: CorrespondenceListAction) => void
  onRetry: () => void
}

function getStatus(item: CorrespondenceItem, today: string): CorrespondenceStatus {
  if (item.status === 'completed' || item.status === 'archived' || item.status === 'sent' || item.status === 'draft') return item.status
  if (item.status === 'overdue' || (item.responseDeadline && item.responseDeadline < today)) return 'overdue'
  return item.status
}

function StatusBadge({ item, today }: { item: CorrespondenceItem; today: string }) {
  const status = getStatus(item, today)
  return <span className={`correspondence-status status-${status}`}>{correspondenceStatusLabels[status]}</span>
}

function PriorityMark({ priority }: { priority: CorrespondenceItem['priority'] }) {
  return <span className={`correspondence-priority priority-${priority}`}><i />{priority}</span>
}

function RowActions({ item, onOpen, onAction }: { item: CorrespondenceItem; onOpen: () => void; onAction: (action: CorrespondenceListAction) => void }) {
  const [open, setOpen] = useState(false)
  return <div className="correspondence-menu-wrap"><button type="button" className="correspondence-icon-button" aria-label={`More actions for ${item.subject}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><CorrespondenceIcon name="more" /></button>{open && <><button type="button" className="correspondence-menu-dismiss" aria-label="Close correspondence actions" onClick={() => setOpen(false)} /><div className="correspondence-action-menu" role="menu"><button type="button" role="menuitem" onClick={() => { setOpen(false); onOpen() }}>Open correspondence</button><button type="button" role="menuitem" onClick={() => { setOpen(false); onAction('draft') }}>Draft response</button><button type="button" role="menuitem" onClick={() => { setOpen(false); onAction('summarize') }}>Summarize with AI</button><button type="button" role="menuitem" onClick={() => { setOpen(false); onAction('task') }}>Create related task</button><button type="button" role="menuitem" onClick={() => { setOpen(false); onAction('forward') }}>Forward</button><button type="button" role="menuitem" onClick={() => { setOpen(false); onAction('archive') }}>Archive</button></div></>}</div>
}

function CorrespondenceCard({ item, today, onOpen, onAction }: { item: CorrespondenceItem; today: string; onOpen: () => void; onAction: (action: CorrespondenceListAction) => void }) {
  return <article className="correspondence-mobile-card">
    <div className="correspondence-mobile-card__top"><span className={`correspondence-type-icon type-${item.type}`}><CorrespondenceIcon name={item.type === 'incoming' ? 'inbox' : 'send'} size={16} /></span><button type="button" className="correspondence-subject-button" onClick={onOpen}>{item.subject}</button><RowActions item={item} onOpen={onOpen} onAction={onAction} /></div>
    <p className="correspondence-mobile-preview">{item.preview}</p>
    <div className="correspondence-mobile-reference"><span>{item.referenceNumber}</span><span>{item.type === 'incoming' ? 'From' : 'To'} {item.type === 'incoming' ? item.sender : item.recipient}</span></div>
    <div className="correspondence-mobile-meta"><StatusBadge item={item} today={today} /><PriorityMark priority={item.priority} /><time>{item.dateLabel}</time></div>
    <div className="correspondence-mobile-department"><CorrespondenceIcon name="building" size={13} />{item.department}</div>
  </article>
}

export default function CorrespondenceList({ items, loading, loadError, activeTab, search, today, onOpen, onAction, onRetry }: CorrespondenceListProps) {
  const emptyTitle = search ? 'No correspondence found' : activeTab === 'Incoming' ? 'No incoming correspondence' : activeTab === 'Outgoing' ? 'No outgoing correspondence' : activeTab === 'Drafts' ? 'No drafts' : activeTab === 'Awaiting Response' ? 'Nothing awaiting response' : activeTab === 'Archived' ? 'No archived correspondence' : 'No correspondence found'

  return (
    <section className="correspondence-list-section" aria-labelledby="correspondence-list-title">
      <header className="correspondence-list-heading"><div><span className="correspondence-eyebrow">REGISTER</span><h2 id="correspondence-list-title">Correspondence register</h2><p>{loading ? 'Loading correspondence...' : `${items.length} ${items.length === 1 ? 'item' : 'items'} in this view`}</p></div><span className="correspondence-list-scope"><CorrespondenceIcon name="list" size={15} />{activeTab}</span></header>
      {loading ? <div className="correspondence-loading" role="status"><span className="correspondence-spinner" />Loading correspondence</div> : loadError ? <div className="correspondence-empty"><strong>Correspondence could not be loaded</strong><p>Try again in a moment.</p><button type="button" onClick={onRetry}>Retry</button></div> : items.length === 0 ? <div className="correspondence-empty"><span className="correspondence-empty-icon"><CorrespondenceIcon name="search" size={20} /></span><h3>{emptyTitle}</h3><p>Try adjusting your search or filters.</p></div> : <>
        <div className="correspondence-table-wrap"><table className="correspondence-table"><thead><tr><th>Subject</th><th>Type</th><th>Reference</th><th>From / To</th><th>Department</th><th>Status</th><th>Date</th><th>Priority</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className={`correspondence-row status-row-${getStatus(item, today)}`}>
          <td className="correspondence-subject-cell"><div className="correspondence-subject-wrap"><span className={`correspondence-type-icon type-${item.type}`}><CorrespondenceIcon name={item.type === 'incoming' ? 'inbox' : 'send'} size={16} /></span><div><button type="button" className="correspondence-subject-button" onClick={() => onOpen(item)}>{item.subject}</button><small>{item.preview}</small></div></div></td>
          <td><span className={`correspondence-type-tag type-${item.type}`}>{item.type === 'incoming' ? 'Incoming' : 'Outgoing'}</span></td>
          <td><span className="correspondence-reference">{item.referenceNumber}</span></td>
          <td><span className="correspondence-from-to">{item.type === 'incoming' ? item.sender : item.recipient}</span><small>{item.type === 'incoming' ? 'Sender' : 'Recipient'}</small></td>
          <td><span className="correspondence-department"><CorrespondenceIcon name="building" size={13} />{item.department}</span></td>
          <td><StatusBadge item={item} today={today} /></td>
          <td><time className="correspondence-date">{item.dateLabel}</time></td>
          <td><PriorityMark priority={item.priority} /></td>
          <td><RowActions item={item} onOpen={() => onOpen(item)} onAction={(action) => onAction(item, action)} /></td>
        </tr>)}</tbody></table></div>
        <div className="correspondence-mobile-list">{items.map((item) => <CorrespondenceCard key={item.id} item={item} today={today} onOpen={() => onOpen(item)} onAction={(action) => onAction(item, action)} />)}</div>
      </>}
    </section>
  )
}