import { useEffect, useState } from 'react'
import './Correspondence.css'
import { loadMockCorrespondence } from './correspondenceData'
import type { CorrespondenceAIAction, CorrespondenceDateFilter, CorrespondenceFormValues, CorrespondenceItem, CorrespondenceListAction, CorrespondencePriority, CorrespondenceSort, CorrespondenceStatus, CorrespondenceStatusFilter, CorrespondenceSummaryFilter, CorrespondenceTab, CorrespondenceType } from './correspondenceTypes'
import { dateString, getCorrespondenceStatus } from './correspondenceUtils'
import CorrespondenceHeader from './components/CorrespondenceHeader'
import CorrespondenceStats from './components/CorrespondenceStats'
import CorrespondenceTabs from './components/CorrespondenceTabs'
import CorrespondenceToolbar from './components/CorrespondenceToolbar'
import CorrespondenceList from './components/CorrespondenceList'
import CorrespondenceDetail from './components/CorrespondenceDetail'
import CorrespondenceAIModal from './components/CorrespondenceAIModal'
import CorrespondenceForm from './components/CorrespondenceForm'
import AIDraftingModal from './components/AIDraftingModal'

interface DraftRequest {
  itemId?: string
  prompt: string
}

interface AIRequest {
  itemId: string
  action: Exclude<CorrespondenceAIAction, 'task' | 'documents' | 'forward'>
}

function createActivity(description: string) {
  return {
    id: `activity-${crypto.randomUUID()}`,
    dateLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
    time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
    description,
  }
}

function displayDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

export default function Correspondence() {
  const [items, setItems] = useState<CorrespondenceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [activeTab, setActiveTab] = useState<CorrespondenceTab>('All')
  const [summaryFilter, setSummaryFilter] = useState<CorrespondenceSummaryFilter>(null)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<CorrespondenceType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<CorrespondenceStatusFilter>('all')
  const [departmentFilter, setDepartmentFilter] = useState('All departments')
  const [dateFilter, setDateFilter] = useState<CorrespondenceDateFilter>('any')
  const [priorityFilter, setPriorityFilter] = useState<CorrespondencePriority | 'all'>('all')
  const [sort, setSort] = useState<CorrespondenceSort>('newest')
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)
  const [draftRequest, setDraftRequest] = useState<DraftRequest | null>(null)
  const [aiRequest, setAIRequest] = useState<AIRequest | null>(null)
  const [formAIDraft, setFormAIDraft] = useState('')
  const [toast, setToast] = useState('')
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({})
  const [today] = useState(() => dateString(new Date()))

  useEffect(() => {
    let active = true
    loadMockCorrespondence()
      .then((result) => {
        if (active) {
          setItems(result)
          setLoadError(false)
        }
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!activeItemId && !draftRequest && !aiRequest && !newOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveItemId(null)
        setDraftRequest(null)
        setAIRequest(null)
        setNewOpen(false)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activeItemId, draftRequest, aiRequest, newOpen])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const departments = [...new Set(items.map((item) => item.department))].sort()
  const activeItem = items.find((item) => item.id === activeItemId) ?? null
  const draftItem = items.find((item) => item.id === draftRequest?.itemId)
  const aiItem = items.find((item) => item.id === aiRequest?.itemId)

  const visibleItems = items.filter((item) => {
    const status = getCorrespondenceStatus(item, today)
    if (activeTab === 'Incoming' && item.type !== 'incoming') return false
    if (activeTab === 'Outgoing' && item.type !== 'outgoing') return false
    if (activeTab === 'Drafts' && status !== 'draft') return false
    if (activeTab === 'Awaiting Response' && !['awaiting-response', 'response-drafted', 'overdue'].includes(status)) return false
    if (activeTab === 'Archived' && status !== 'archived') return false
    if (summaryFilter === 'incoming' && item.type !== 'incoming') return false
    if (summaryFilter === 'outgoing' && item.type !== 'outgoing') return false
    if (summaryFilter === 'awaiting' && !['awaiting-response', 'response-drafted'].includes(status)) return false
    if (summaryFilter === 'overdue' && status !== 'overdue') return false
    if (typeFilter !== 'all' && item.type !== typeFilter) return false
    if (statusFilter !== 'all' && status !== statusFilter) return false
    if (departmentFilter !== 'All departments' && item.department !== departmentFilter) return false
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false
    if (dateFilter !== 'any') {
      const age = (Date.parse(`${today}T12:00:00`) - Date.parse(`${item.date}T12:00:00`)) / 86400000
      if (age < 0 || age > (dateFilter === 'week' ? 7 : 30)) return false
    }
    const normalized = query.trim().toLowerCase()
    if (normalized && ![item.subject, item.preview, item.message, item.referenceNumber, item.sender, item.recipient, item.department, item.status].some((value) => value.toLowerCase().includes(normalized))) return false
    return true
  }).sort((first, second) => {
    if (sort === 'oldest') return first.date.localeCompare(second.date)
    if (sort === 'priority') {
      const rank: Record<CorrespondencePriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
      return rank[first.priority] - rank[second.priority] || second.date.localeCompare(first.date)
    }
    if (sort === 'deadline') return (first.responseDeadline ?? '9999-12-31').localeCompare(second.responseDeadline ?? '9999-12-31')
    return second.date.localeCompare(first.date)
  })

  function updateItem(itemId: string, update: (item: CorrespondenceItem) => CorrespondenceItem) {
    setItems((current) => current.map((item) => item.id === itemId ? update(item) : item))
  }

  function chooseSummaryFilter(filter: Exclude<CorrespondenceSummaryFilter, null>) {
    setSummaryFilter((current) => current === filter ? null : filter)
    setActiveTab('All')
    setStatusFilter('all')
  }

  function resetFilters() {
    setQuery('')
    setTypeFilter('all')
    setStatusFilter('all')
    setDepartmentFilter('All departments')
    setDateFilter('any')
    setPriorityFilter('all')
    setSummaryFilter(null)
    setActiveTab('All')
  }

  function handleListAction(item: CorrespondenceItem, action: CorrespondenceListAction) {
    if (action === 'draft') {
      setActiveItemId(item.id)
      setDraftRequest({ itemId: item.id, prompt: `Draft a formal response to: ${item.subject}` })
    } else if (action === 'summarize') {
      setAIRequest({ itemId: item.id, action: 'summarize' })
    } else if (action === 'archive') {
      updateItem(item.id, (current) => ({ ...current, status: 'archived', activity: [createActivity('Archived by you'), ...current.activity] }))
      setToast('Correspondence archived.')
    } else if (action === 'forward') {
      setActiveItemId(item.id)
      setToast('Forward this record from the detail view.')
    } else {
      const title = item.relatedTask || `Respond to: ${item.subject}`
      updateItem(item.id, (current) => ({ ...current, relatedTask: title, activity: [createActivity(`Related task created: ${title}`), ...current.activity] }))
      setToast('Related task added to this correspondence.')
    }
  }

  function saveNew(values: CorrespondenceFormValues, status: CorrespondenceStatus, openAfterSave: boolean) {
    const id = `corr-${crypto.randomUUID()}`
    const item: CorrespondenceItem = {
      id,
      subject: values.subject,
      preview: values.message || `${values.sender} ${values.type === 'incoming' ? 'sent correspondence' : 'will receive this correspondence'}.`,
      message: values.message || 'No message text was entered.',
      type: values.type,
      referenceNumber: values.referenceNumber || `FMT/TPC/${new Date().getFullYear()}/${String(items.length + 1).padStart(3, '0')}`,
      sender: values.sender,
      recipient: values.recipient,
      department: values.department,
      status,
      priority: values.priority,
      date: values.date,
      dateLabel: displayDate(values.date),
      responseDeadline: values.responseDeadline || undefined,
      relatedDocuments: values.relatedDocument ? [{ id: `doc-${crypto.randomUUID()}`, name: values.relatedDocument, type: values.relatedDocument.toLowerCase().endsWith('.xlsx') ? 'XLSX' : values.relatedDocument.toLowerCase().endsWith('.docx') ? 'DOCX' : 'PDF', size: 'Linked document' }] : [],
      attachments: [],
      notes: values.notes,
      responseDraft: '',
      activity: [createActivity(status === 'draft' ? 'Draft saved by you' : values.type === 'incoming' ? 'Received and registered by you' : 'Outgoing correspondence drafted')],
    }
    setItems((current) => [item, ...current])
    setNewOpen(false)
    setFormAIDraft('')
    setActiveTab(status === 'draft' ? 'Drafts' : values.type === 'incoming' ? 'Incoming' : 'Outgoing')
    setSummaryFilter(null)
    if (openAfterSave) setActiveItemId(id)
    setToast(status === 'draft' ? 'Draft saved.' : 'Correspondence saved to the register.')
  }

  function saveResponse(item: CorrespondenceItem, response: string, status: CorrespondenceStatus) {
    const activityMessage = status === 'sent' ? `Demo response marked sent to ${item.type === 'incoming' ? item.sender : item.recipient}` : status === 'response-drafted' ? 'Response draft saved' : 'Response updated'
    updateItem(item.id, (current) => ({ ...current, responseDraft: response, status, activity: [createActivity(activityMessage), ...current.activity] }))
    if (status === 'sent') setToast('Marked as sent in this demo. No message was sent.')
    else setToast(status === 'response-drafted' ? 'Response draft saved.' : 'Response updated.')
  }

  function createRelatedTask(item: CorrespondenceItem, title: string, due: string, priority: CorrespondencePriority) {
    updateItem(item.id, (current) => ({ ...current, relatedTask: title, responseDeadline: due, priority, activity: [createActivity(`Related task created: ${title}`), ...current.activity] }))
    setToast('Related task created in this demo workspace.')
  }

  function forwardItem(item: CorrespondenceItem, recipient: string) {
    updateItem(item.id, (current) => ({ ...current, notes: `${current.notes}${current.notes ? '\n' : ''}Forwarded to ${recipient} in demo.`, activity: [createActivity(`Forwarded to ${recipient} in demo`), ...current.activity] }))
    setToast(`Forwarded to ${recipient} in this demo.`)
  }

  function useAIDraft(draft: string) {
    if (draftRequest?.itemId) {
      const itemId = draftRequest.itemId
      setResponseDrafts((current) => ({ ...current, [itemId]: draft }))
      updateItem(itemId, (item) => ({ ...item, responseDraft: draft, status: 'response-drafted', activity: [createActivity('Response draft created with OfficePilot demo'), ...item.activity] }))
      setActiveItemId(itemId)
      setToast('AI draft added to the response workflow.')
    } else {
      setFormAIDraft(draft)
      setToast('AI draft added to the new correspondence form.')
    }
    setDraftRequest(null)
  }

  function retryLoad() {
    setLoading(true)
    setLoadError(false)
    loadMockCorrespondence().then(setItems).catch(() => setLoadError(true)).finally(() => setLoading(false))
  }

  return <main className="correspondence-page">
    <CorrespondenceHeader onNew={() => { setFormAIDraft(''); setNewOpen(true) }} />
    <CorrespondenceStats active={summaryFilter} onSelect={chooseSummaryFilter} />
    <CorrespondenceTabs active={activeTab} onChange={(tab) => { setActiveTab(tab); setSummaryFilter(null) }} />
    <CorrespondenceToolbar query={query} onQueryChange={setQuery} type={typeFilter} onTypeChange={setTypeFilter} status={statusFilter} onStatusChange={setStatusFilter} department={departmentFilter} onDepartmentChange={setDepartmentFilter} departments={departments} date={dateFilter} onDateChange={setDateFilter} priority={priorityFilter} onPriorityChange={setPriorityFilter} sort={sort} onSortChange={setSort} onReset={resetFilters} />
    <CorrespondenceList items={visibleItems} loading={loading} loadError={loadError} activeTab={summaryFilter ? 'Filtered' : activeTab} search={query} today={today} onOpen={(item) => setActiveItemId(item.id)} onAction={handleListAction} onRetry={retryLoad} />
    {toast && <div className="correspondence-toast" role="status">{toast}</div>}
    {activeItem && <CorrespondenceDetail key={activeItem.id} item={activeItem} today={today} responseText={responseDrafts[activeItem.id] ?? activeItem.responseDraft} onResponseChange={(response) => setResponseDrafts((current) => ({ ...current, [activeItem.id]: response }))} onClose={() => setActiveItemId(null)} onUpdateStatus={(item, status) => { updateItem(item.id, (current) => ({ ...current, status, activity: [createActivity(status === 'archived' ? 'Archived by you' : `Status changed to ${status}`), ...current.activity] })); if (status === 'archived') { setActiveItemId(null); setToast('Correspondence archived.') } }} onSaveResponse={saveResponse} onDraftAI={(item) => setDraftRequest({ itemId: item.id, prompt: `Draft a formal response to: ${item.subject}` })} onAIAction={(item, action) => setAIRequest({ itemId: item.id, action })} onCreateTask={createRelatedTask} onForward={forwardItem} />}
    {newOpen && <CorrespondenceForm items={items} aiDraftText={formAIDraft} onClose={() => { setNewOpen(false); setFormAIDraft('') }} onSave={saveNew} onDraftWithAI={(prompt) => setDraftRequest({ prompt: `Draft formal correspondence: ${prompt}` })} />}
    {draftRequest && <AIDraftingModal item={draftItem} initialPrompt={draftRequest.prompt} onClose={() => setDraftRequest(null)} onUseDraft={useAIDraft} />}
    {aiRequest && aiItem && <CorrespondenceAIModal item={aiItem} action={aiRequest.action} onClose={() => setAIRequest(null)} />}
  </main>
}