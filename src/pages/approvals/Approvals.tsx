import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ApprovalHeader from '../../components/approvals/ApprovalHeader/ApprovalHeader'
import ApprovalStats from '../../components/approvals/ApprovalStats/ApprovalStats'
import ApprovalTabs from '../../components/approvals/ApprovalTabs/ApprovalTabs'
import ApprovalToolbar from '../../components/approvals/ApprovalToolbar/ApprovalToolbar'
import ApprovalTable from '../../components/approvals/ApprovalTable/ApprovalTable'
import ApprovalCard from '../../components/approvals/ApprovalCard/ApprovalCard'
import ApprovalDetail from '../../components/approvals/ApprovalDetail/ApprovalDetail'
import ApprovalDeadline from '../../components/approvals/ApprovalDeadline/ApprovalDeadline'
import ApprovalRequest from '../../components/approvals/ApprovalRequest/ApprovalRequest'
import EmptyApprovals from '../../components/approvals/EmptyApprovals/EmptyApprovals'
import './Approvals.css'

type ApprovalStatus = 'Pending' | 'In Review' | 'Changes Requested' | 'Approved' | 'Rejected' | 'Cancelled' | 'Expired'
type ApprovalPriority = 'Urgent' | 'High' | 'Normal' | 'Low'
type ApprovalType = 'Document' | 'Correspondence' | 'Meeting' | 'Task' | 'AI Draft'

type ApprovalComment = {
  time: string
  author: string
  text: string
}

type ApprovalWorkflowStage = {
  label: string
  date: string
  isCurrent?: boolean
}

type RelatedWorkItem = {
  label: string
  to: string
  type: string
}

type Approval = {
  id: string
  title: string
  type: ApprovalType
  requestedBy: string
  department: string
  approver: string
  priority: ApprovalPriority
  status: ApprovalStatus
  submitted: string
  due: string
  referenceNumber: string
  reason: string
  item: string
  content: string
  aiAssisted?: boolean
  workflow: ApprovalWorkflowStage[]
  comments: ApprovalComment[]
  relatedWork: RelatedWorkItem[]
}

const tabs = ['Needs My Approval', 'Submitted', 'Approved', 'Rejected', 'All'] as const

const mockApprovals: Approval[] = [
  {
    id: 'approval-1',
    title: 'Quarterly Transport Report',
    type: 'Document',
    requestedBy: 'Cephas A.',
    department: 'TPC',
    approver: 'Manager',
    priority: 'High',
    status: 'Pending',
    submitted: 'Today',
    due: 'Tomorrow',
    referenceNumber: 'REF-TPR-2046',
    reason: 'Final review before submission to the executive team.',
    item: 'Quarterly Transport Report.pdf',
    content: 'This report summarises traffic trends, planned interventions, and implementation forecasts for Q4. It includes service levels, operational bottlenecks, and the budget implications of the recommended response plan. The final stakeholder decision is required before the package is sent for review.',
    workflow: [
      { label: 'Submitted', date: 'Today • 09:14 AM' },
      { label: 'Under Review', date: 'Today • 10:24 AM', isCurrent: true },
      { label: 'Decision', date: 'Pending' },
      { label: 'Completed', date: 'Pending' },
    ],
    comments: [
      { time: '09:14 AM', author: 'Cephas A.', text: 'Cephas submitted this request for executive review.' },
      { time: '10:24 AM', author: 'Manager', text: 'Please confirm the updated budget figure in section 3 before approval.' },
    ],
    relatedWork: [
      { label: 'Quarterly Performance Review', to: '/documents', type: 'Document' },
      { label: 'Budget Planning Task', to: '/tasks', type: 'Task' },
    ],
  },
  {
    id: 'approval-2',
    title: 'Official Response to Directorate',
    type: 'Correspondence',
    requestedBy: 'Transport Planning Unit',
    department: 'TPC',
    approver: 'Director',
    priority: 'Urgent',
    status: 'Pending',
    submitted: 'Today',
    due: 'Today',
    referenceNumber: 'REF-OPS-1092',
    reason: 'Urgent response required before the weekly coordination call.',
    item: 'Official Response to Directorate.docx',
    content: 'The response addresses the directorate’s request for timelines, implementation actions, and outstanding dependencies. The final version will be circulated once the approval is complete and the action plan is confirmed.',
    workflow: [
      { label: 'Submitted', date: 'Today • 08:22 AM' },
      { label: 'Under Review', date: 'Today • 09:40 AM', isCurrent: true },
      { label: 'Decision', date: 'Pending' },
      { label: 'Completed', date: 'Pending' },
    ],
    comments: [
      { time: '08:22 AM', author: 'Transport Planning Unit', text: 'Draft response submitted for review.' },
      { time: '09:40 AM', author: 'Director', text: 'Please clarify the implementation sequence before decision.' },
    ],
    relatedWork: [
      { label: 'Directorate Notes', to: '/correspondence', type: 'Correspondence' },
      { label: 'Coordination Meeting', to: '/meetings', type: 'Meeting' },
    ],
  },
  {
    id: 'approval-3',
    title: 'Meeting Minutes Approval',
    type: 'Meeting',
    requestedBy: 'Administrative Department',
    department: 'Administrative Department',
    approver: 'Manager',
    priority: 'Normal',
    status: 'Approved',
    submitted: 'Yesterday',
    due: '—',
    referenceNumber: 'REF-MIN-1334',
    reason: 'Confirm the final record of decisions and action owners for the committee meeting.',
    item: 'Project Coordination Meeting Minutes',
    content: 'The approval confirms the recorded decisions, action items, and owner assignments from the project coordination meeting. Once approved, the minutes are released to the wider team for execution.',
    workflow: [
      { label: 'Submitted', date: 'Yesterday • 03:10 PM' },
      { label: 'Under Review', date: 'Yesterday • 04:05 PM' },
      { label: 'Decision', date: 'Yesterday • 04:32 PM' },
      { label: 'Completed', date: 'Yesterday • 04:42 PM', isCurrent: true },
    ],
    comments: [
      { time: '03:10 PM', author: 'Administrative Department', text: 'Minutes submitted for approval.' },
      { time: '04:40 PM', author: 'Manager', text: 'Approved. Please circulate to attendees and action owners.' },
    ],
    relatedWork: [
      { label: 'Meeting Agenda', to: '/meetings', type: 'Meeting' },
      { label: 'Action Tracker', to: '/tasks', type: 'Task' },
    ],
  },
  {
    id: 'approval-4',
    title: 'AI Draft: Internal Response Letter',
    type: 'AI Draft',
    requestedBy: 'Naomi L.',
    department: 'HR',
    approver: 'Manager',
    priority: 'High',
    status: 'Changes Requested',
    submitted: '2 days ago',
    due: 'Today',
    referenceNumber: 'REF-AI-4421',
    reason: 'Validate the AI-generated draft before internal distribution.',
    item: 'Internal Response Letter',
    content: 'This AI-assisted draft was generated from the staff concern summary and the approved policy guidance. It is ready for human review, but it should not be sent until approval and final policy validation are complete.',
    aiAssisted: true,
    workflow: [
      { label: 'Submitted', date: '2 days ago • 11:03 AM' },
      { label: 'Under Review', date: 'Yesterday • 09:00 AM' },
      { label: 'Decision', date: 'Today • 11:05 AM', isCurrent: true },
      { label: 'Completed', date: 'Pending' },
    ],
    comments: [
      { time: '11:03 AM', author: 'Naomi L.', text: 'AI draft submitted for policy review and approval.' },
      { time: '11:05 AM', author: 'Manager', text: 'Please clarify the compensation section before we can approve the final wording.' },
    ],
    relatedWork: [
      { label: 'Staff Concern Summary', to: '/documents', type: 'Document' },
      { label: 'HR Action Tracker', to: '/tasks', type: 'Task' },
    ],
  },
  {
    id: 'approval-5',
    title: 'Staff Transport Assistance Request',
    type: 'Task',
    requestedBy: 'Miriam K.',
    department: 'HR',
    approver: 'Permanent Secretary',
    priority: 'Urgent',
    status: 'In Review',
    submitted: 'Today',
    due: 'Today',
    referenceNumber: 'REF-HR-7710',
    reason: 'Confirm eligibility and whether the recommendation should proceed to approval.',
    item: 'Staff Transport Assistance Review',
    content: 'This request covers staff transport support eligibility, budget impact, and the decision to approve a travel sponsorship. It is currently under review and should not be interpreted as a final approval yet.',
    workflow: [
      { label: 'Submitted', date: 'Today • 06:55 AM' },
      { label: 'Under Review', date: 'Today • 08:15 AM', isCurrent: true },
      { label: 'Decision', date: 'Pending' },
      { label: 'Completed', date: 'Pending' },
    ],
    comments: [
      { time: '06:55 AM', author: 'Miriam K.', text: 'Request submitted for review.' },
      { time: '08:15 AM', author: 'Permanent Secretary', text: 'Reviewing budget and employee eligibility before confirming next steps.' },
    ],
    relatedWork: [
      { label: 'Eligibility Checklist', to: '/documents', type: 'Document' },
      { label: 'Travel Support Task', to: '/tasks', type: 'Task' },
    ],
  },
  {
    id: 'approval-6',
    title: 'Procurement Summary Approval',
    type: 'Document',
    requestedBy: 'Cephas A.',
    department: 'TPC',
    approver: 'Director',
    priority: 'Normal',
    status: 'Rejected',
    submitted: 'Last week',
    due: 'Wednesday',
    referenceNumber: 'REF-PROC-1188',
    reason: 'Needs final procurement summary sign-off before final release and actioning.',
    item: 'Procurement Summary Overview',
    content: 'The procurement summary captures the latest supplier updates, funding status, and cost variance information. It is currently rejected pending a revised summary and updated pricing commentary.',
    workflow: [
      { label: 'Submitted', date: 'Last week • 01:40 PM' },
      { label: 'Under Review', date: 'Last week • 02:05 PM' },
      { label: 'Decision', date: 'Last week • 02:50 PM' },
      { label: 'Completed', date: 'Rejected', isCurrent: true },
    ],
    comments: [
      { time: '02:05 PM', author: 'Director', text: 'The submission does not yet reflect the approved procurement pricing model.' },
      { time: '02:50 PM', author: 'Director', text: 'Rejected. Please resubmit after correcting the pricing and supplier sections.' },
    ],
    relatedWork: [
      { label: 'Supplier List', to: '/documents', type: 'Document' },
      { label: 'Procurement Checklists', to: '/files', type: 'File' },
    ],
  },
]

const getApprovalCounts = (approvals: Approval[]) => ({
  awaiting: approvals.filter((item) => item.status === 'Pending' || item.status === 'In Review').length,
  submitted: approvals.filter((item) => item.requestedBy === 'Cephas A.' && item.status !== 'Approved' && item.status !== 'Rejected').length,
  changes: approvals.filter((item) => item.status === 'Changes Requested').length,
  approved: approvals.filter((item) => item.status === 'Approved').length,
})

export default function Approvals() {
  const { approvalId } = useParams()
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(approvalId ?? null)
  const [tab, setTab] = useState<string>('Needs My Approval')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [requesterFilter, setRequesterFilter] = useState('All')
  const [approverFilter, setApproverFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')
  const [sort, setSort] = useState('newest')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setApprovals(mockApprovals)
      setSelectedId(approvalId ?? null)
      setLoading(false)
      setError(false)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [approvalId])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const stats = useMemo(() => getApprovalCounts(approvals), [approvals])

  const filteredApprovals = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return approvals.filter((approval) => {
      if (tab === 'Needs My Approval' && !(approval.status === 'Pending' || approval.status === 'In Review')) return false
      if (tab === 'Submitted' && approval.requestedBy !== 'Cephas A.') return false
      if (tab === 'Approved' && approval.status !== 'Approved') return false
      if (tab === 'Rejected' && approval.status !== 'Rejected') return false
      if (tab === 'All') {
        // all visible by default
      }
      if (typeFilter !== 'All' && approval.type !== typeFilter) return false
      if (statusFilter !== 'All' && approval.status !== statusFilter) return false
      if (priorityFilter !== 'All' && approval.priority !== priorityFilter) return false
      if (departmentFilter !== 'All' && approval.department !== departmentFilter) return false
      if (requesterFilter !== 'All' && approval.requestedBy !== requesterFilter) return false
      if (approverFilter !== 'All' && approval.approver !== approverFilter) return false
      if (dateFilter !== 'All') {
        const todayMatches = approval.submitted === 'Today' || approval.submitted === 'Yesterday'
        if (dateFilter === 'Today' && approval.submitted !== 'Today') return false
        if (dateFilter === 'Yesterday' && approval.submitted !== 'Yesterday') return false
        if (dateFilter === 'Last 7 Days' && !todayMatches && approval.submitted !== '2 days ago' && approval.submitted !== 'Last week') return false
      }
      if (!normalized) return true
      const searchable = [approval.title, approval.requestedBy, approval.department, approval.referenceNumber, approval.item].join(' ').toLowerCase()
      return searchable.includes(normalized)
    }).sort((first, second) => {
      if (sort === 'oldest') return first.submitted.localeCompare(second.submitted)
      if (sort === 'priority') return ['Urgent', 'High', 'Normal', 'Low'].indexOf(first.priority) - ['Urgent', 'High', 'Normal', 'Low'].indexOf(second.priority)
      if (sort === 'deadline') return first.due.localeCompare(second.due)
      return second.referenceNumber.localeCompare(first.referenceNumber)
    })
  }, [approvals, tab, query, typeFilter, statusFilter, priorityFilter, departmentFilter, requesterFilter, approverFilter, dateFilter, sort])

  const selectedApproval = approvals.find((approval) => approval.id === selectedId) ?? null

  const deadlines = useMemo<Array<{ level: 'Urgent' | 'High' | 'Normal'; title: string; due: string }>>(() => [
    { level: 'Urgent', title: 'Official response', due: 'Due today' },
    { level: 'High', title: 'Quarterly report', due: 'Due tomorrow' },
    { level: 'Normal', title: 'Meeting minutes', due: 'Due Friday' },
  ], [])

  function clearFilters() {
    setQuery('')
    setTypeFilter('All')
    setStatusFilter('All')
    setPriorityFilter('All')
    setDepartmentFilter('All')
    setRequesterFilter('All')
    setApproverFilter('All')
    setDateFilter('All')
    setSort('newest')
  }

  function handleDecision(mode: 'approve' | 'changes' | 'reject', comment?: string) {
    if (!selectedApproval) return

    const statusMap = {
      approve: 'Approved',
      changes: 'Changes Requested',
      reject: 'Rejected',
    } as const

    const updatedStatus = statusMap[mode]
    const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const decisionEntry = {
      time: timestamp,
      author: 'Manager',
      text: mode === 'approve' ? comment ? `Approved with note: ${comment}` : 'Manager approved the request.' : mode === 'changes' ? `Changes requested: ${comment}` : `Rejected with note: ${comment}`,
    }

    setApprovals((current) => current.map((approval) => {
      if (approval.id !== selectedApproval.id) return approval

      const workflow = approval.workflow.map((stage, index) => {
        if (mode === 'approve' && index === approval.workflow.length - 1) {
          return { ...stage, date: `${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${timestamp}`, isCurrent: true }
        }

        if (mode === 'changes' && index === 2) {
          return { ...stage, date: `${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${timestamp}`, isCurrent: true }
        }

        if (mode === 'reject' && index === approval.workflow.length - 1) {
          return { ...stage, date: `${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${timestamp}`, isCurrent: true }
        }

        return stage
      })

      return {
        ...approval,
        status: updatedStatus,
        comments: [decisionEntry, ...approval.comments],
        workflow,
      }
    }))

    setToast(mode === 'approve' ? 'Approval approved' : mode === 'changes' ? 'Changes requested' : 'Approval rejected')
  }

  function handleRequestSubmit(payload: Record<string, string>) {
    const newApproval: Approval = {
      id: `approval-${Date.now()}`,
      title: payload.title || 'New approval request',
      type: (payload.type as ApprovalType) || 'Document',
      requestedBy: 'Cephas A.',
      department: payload.department || 'TPC',
      approver: payload.approver || 'Manager',
      priority: (payload.priority as ApprovalPriority) || 'Normal',
      status: 'Pending',
      submitted: 'Today',
      due: payload.dueDate ? new Date(payload.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Tomorrow',
      referenceNumber: `REF-${Math.random().toString().slice(2, 8)}`,
      reason: payload.reason || 'Approval requested for review.',
      item: payload.item || 'Supporting item',
      content: `This approval request was submitted for ${payload.approver.toLowerCase()} review. The decision should be treated as a formal workflow checkpoint, not as an execution step.`,
      aiAssisted: payload.type === 'AI Draft',
      workflow: [
        { label: 'Submitted', date: `Today • ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`, isCurrent: false },
        { label: 'Under Review', date: 'Pending', isCurrent: true },
        { label: 'Decision', date: 'Pending' },
        { label: 'Completed', date: 'Pending' },
      ],
      comments: [
        { time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), author: 'Cephas A.', text: 'Cephas submitted this request for review.' },
      ],
      relatedWork: [
        { label: 'Related document', to: '/documents', type: 'Document' },
        { label: 'Related task', to: '/tasks', type: 'Task' },
      ],
    }

    setApprovals((current) => [newApproval, ...current])
    setSelectedId(newApproval.id)
    setShowRequestModal(false)
    setToast('Approval request submitted.')
  }

  if (loading) {
    return (
      <main className="approvals-page">
        <div className="approvals-loading" role="status">
          <span className="approvals-spinner" />
          Loading approvals...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="approvals-page">
        <div className="approvals-error" role="alert">
          <h3>Approval data could not be loaded.</h3>
          <p>Please retry to restore the decisions workspace.</p>
          <button type="button" className="primary-button" onClick={() => setError(false)}>Retry</button>
        </div>
      </main>
    )
  }

  return (
    <main className="approvals-page">
      {toast ? <div className="approvals-toast">{toast}</div> : null}

      <ApprovalHeader onRequestApproval={() => setShowRequestModal(true)} />

      <ApprovalStats stats={[
        { label: 'Awaiting My Approval', value: stats.awaiting, tone: 'warning' },
        { label: 'Submitted by Me', value: stats.submitted },
        { label: 'Needs Changes', value: stats.changes, tone: 'danger' },
        { label: 'Approved', value: stats.approved, tone: 'success' },
      ]} />

      <div className="approvals-layout">
        <div className="approvals-main">
          <ApprovalTabs tabs={[...tabs]} activeTab={tab} onChange={setTab} />

          <ApprovalToolbar
            query={query}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            departmentFilter={departmentFilter}
            requesterFilter={requesterFilter}
            approverFilter={approverFilter}
            dateFilter={dateFilter}
            sort={sort}
            onQueryChange={setQuery}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onDepartmentChange={setDepartmentFilter}
            onRequesterChange={setRequesterFilter}
            onApproverChange={setApproverFilter}
            onDateChange={setDateFilter}
            onSortChange={setSort}
            onClearFilters={clearFilters}
          />

          {filteredApprovals.length === 0 ? (
            <EmptyApprovals title="You're all caught up." description="No approval requests currently need your attention." />
          ) : isMobile ? (
            <div className="approvals-card-area approvals-cards-grid">
              {filteredApprovals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} onOpen={setSelectedId} />
              ))}
            </div>
          ) : (
            <div className="approvals-table-area">
              <ApprovalTable approvals={filteredApprovals} onOpen={setSelectedId} />
            </div>
          )}
        </div>

        <aside className="approvals-sidebar">
          <ApprovalDeadline deadlines={deadlines} />
        </aside>
      </div>

      {selectedApproval ? (
        <ApprovalDetail
          approval={selectedApproval}
          onClose={() => setSelectedId(null)}
          onApprove={(comment) => handleDecision('approve', comment)}
          onRequestChanges={(comment) => handleDecision('changes', comment)}
          onReject={(comment) => handleDecision('reject', comment)}
        />
      ) : null}

      {showRequestModal ? (
        <div className="approvals-modal-backdrop" onClick={() => setShowRequestModal(false)}>
          <div className="approvals-modal" onClick={(event) => event.stopPropagation()}>
            <ApprovalRequest
              onClose={() => setShowRequestModal(false)}
              onSubmit={(payload) => handleRequestSubmit(payload)}
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}