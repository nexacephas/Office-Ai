import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import FileActions from '../../components/registry/FileActions/FileActions'
import FileCard from '../../components/registry/FileCard/FileCard'
import FileDetail from '../../components/registry/FileDetail/FileDetail'
import FileMovementForm from '../../components/registry/FileMovementForm/FileMovementForm'
import FileTable from '../../components/registry/FileTable/FileTable'
import OverdueFiles from '../../components/registry/OverdueFiles/OverdueFiles'
import RegisterFileForm from '../../components/registry/RegisterFileForm/RegisterFileForm'
import RegistryActivity from '../../components/registry/RegistryActivity/RegistryActivity'
import RegistryHeader from '../../components/registry/RegistryHeader/RegistryHeader'
import RegistryStats from '../../components/registry/RegistryStats/RegistryStats'
import RegistryTabs from '../../components/registry/RegistryTabs/RegistryTabs'
import RegistryToolbar from '../../components/registry/RegistryToolbar/RegistryToolbar'
import EmptyRegistry from '../../components/registry/EmptyRegistry/EmptyRegistry'
import './FilesRegistry.css'

export type RegistryDirection = 'Incoming' | 'Outgoing'
export type RegistryStatus = 'Registered' | 'Received' | 'With Registry' | 'With Staff' | 'Under Action' | 'Returned' | 'Dispatched' | 'Closed' | 'Archived' | 'Overdue'
export type RegistryPriority = 'Low' | 'Normal' | 'High' | 'Urgent'

export interface RegistryMovementEvent {
  id: string
  date: string
  movement: string
  from: string
  to: string
  person: string
  remarks: string
}

export interface RegistryFileRecord {
  id: string
  fileNumber: string
  subject: string
  direction: RegistryDirection
  department: string
  currentHolder: string
  status: RegistryStatus
  lastMovement: string
  priority: RegistryPriority
  referenceNumber: string
  createdDate: string
  expectedReturnDate: string
  daysOverdue: number
  description: string
  relatedDocument: string
  relatedCorrespondence: string
  relatedTask: string
  relatedMeeting: string
  currentLocation: string
  tags: string[]
  movementHistory: RegistryMovementEvent[]
}

const registryTabs = ['All Files', 'Incoming', 'Outgoing', 'With Staff', 'Overdue', 'Archived'] as const

const mockFiles: RegistryFileRecord[] = [
  {
    id: 'file-1',
    fileNumber: 'FMT/TPC/2026/041',
    subject: 'Transport Infrastructure Coordination Meeting',
    direction: 'Incoming',
    department: 'TPC',
    currentHolder: 'Cephas A.',
    status: 'With Staff',
    lastMovement: 'Today, 10:42 AM',
    priority: 'High',
    referenceNumber: 'FMT/DR/2026/019',
    createdDate: '2026-05-01',
    expectedReturnDate: '2026-05-04',
    daysOverdue: 0,
    description: 'Official meeting briefing from the Directorate of Rail concerning infrastructure coordination and approvals.',
    relatedDocument: 'Transport Infrastructure Report.pdf',
    relatedCorrespondence: 'Correspondence FMT/DR/2026/009',
    relatedTask: 'Prepare response to Directorate',
    relatedMeeting: 'Infrastructure Coordination Meeting',
    currentLocation: 'Transport Planning Unit',
    tags: ['planning', 'transport', 'coordination'],
    movementHistory: [
      { id: 'hist-1', date: 'Today — 10:42 AM', movement: 'Received by TPC Registry', from: 'Directorate of Rail', to: 'TPC Registry', person: 'Registry Officer', remarks: 'Reference verified and registered.' },
      { id: 'hist-2', date: 'Today — 11:15 AM', movement: 'Forwarded to Transport Planning Unit', from: 'TPC Registry', to: 'Transport Planning Unit', person: 'Cephas A.', remarks: 'Assigned for action and follow-up.' },
      { id: 'hist-3', date: 'Yesterday — 3:25 PM', movement: 'Received from Directorate of Rail', from: 'Directorate of Rail', to: 'TPC Registry', person: 'Registry Officer', remarks: 'Initial intake completed.' },
      { id: 'hist-4', date: 'Monday — 9:10 AM', movement: 'File registered', from: '-', to: 'Registry', person: 'Registry Officer', remarks: 'Official file opened on the main register.' },
    ],
  },
  {
    id: 'file-2',
    fileNumber: 'FMT/ADM/2026/018',
    subject: 'Request for Departmental Records',
    direction: 'Incoming',
    department: 'Registry',
    currentHolder: 'Registry',
    status: 'Returned',
    lastMovement: 'Yesterday',
    priority: 'Normal',
    referenceNumber: 'FMT/ADM/2026/018',
    createdDate: '2026-04-21',
    expectedReturnDate: '2026-04-25',
    daysOverdue: 0,
    description: 'Administrative request for archived departmental records and corresponding approvals.',
    relatedDocument: 'Departmental Records Index.pdf',
    relatedCorrespondence: 'Correspondence FMT/ADM/2026/111',
    relatedTask: 'Review records request',
    relatedMeeting: 'Administration Review',
    currentLocation: 'Registry Archive',
    tags: ['administration', 'records'],
    movementHistory: [
      { id: 'hist-5', date: 'Yesterday — 4:10 PM', movement: 'Returned to Registry', from: 'Administration', to: 'Registry', person: 'Records Clerk', remarks: 'Original request files returned and closed.' },
      { id: 'hist-6', date: 'Monday — 2:05 PM', movement: 'Forwarded to Administration', from: 'Registry', to: 'Administration', person: 'Records Clerk', remarks: 'Request sent for verification and action.' },
    ],
  },
  {
    id: 'file-3',
    fileNumber: 'FMT/TPC/2026/063',
    subject: 'Quarterly Transport Report',
    direction: 'Outgoing',
    department: 'TPC',
    currentHolder: 'Registry',
    status: 'Dispatched',
    lastMovement: 'Today',
    priority: 'Urgent',
    referenceNumber: 'FMT/TPC/2026/063',
    createdDate: '2026-05-05',
    expectedReturnDate: '2026-05-06',
    daysOverdue: 0,
    description: 'Quarterly transport report sent to the Permanent Secretary for review and approval.',
    relatedDocument: 'Quarterly Transport Report.pdf',
    relatedCorrespondence: 'Correspondence FMT/PS/2026/074',
    relatedTask: 'Finalize submission package',
    relatedMeeting: 'Executive Review Meeting',
    currentLocation: 'Permanent Secretary Office',
    tags: ['report', 'executive', 'outgoing'],
    movementHistory: [
      { id: 'hist-7', date: 'Today — 8:40 AM', movement: 'Dispatched', from: 'TPC Registry', to: 'Permanent Secretary', person: 'Office Assistant', remarks: 'Dispatch recorded with acknowledgement requested.' },
      { id: 'hist-8', date: 'Yesterday — 4:30 PM', movement: 'Prepared for dispatch', from: 'Transport Planning Unit', to: 'TPC Registry', person: 'Cephas A.', remarks: 'Final review approved by unit head.' },
    ],
  },
  {
    id: 'file-4',
    fileNumber: 'FMT/INF/2026/022',
    subject: 'Staff Transport Assistance Request',
    direction: 'Incoming',
    department: 'HR',
    currentHolder: 'Miriam K.',
    status: 'Under Action',
    lastMovement: '2 days ago',
    priority: 'High',
    referenceNumber: 'HR/ADM/2026/117',
    createdDate: '2026-04-28',
    expectedReturnDate: '2026-04-30',
    daysOverdue: 2,
    description: 'Staff transportation assistance request pending decision and approval from administration.',
    relatedDocument: 'Staff Transport Request.pdf',
    relatedCorrespondence: 'Correspondence HR/ADM/2026/010',
    relatedTask: 'Confirm eligibility and authorize support',
    relatedMeeting: 'Human Resources Review',
    currentLocation: 'HR Admin Office',
    tags: ['human resources', 'overdue', 'staff'],
    movementHistory: [
      { id: 'hist-9', date: '2 days ago — 12:25 PM', movement: 'Transferred to HR Admin', from: 'Registry', to: 'HR Admin', person: 'Miriam K.', remarks: 'Awaiting eligibility review.' },
      { id: 'hist-10', date: 'Monday — 3:25 PM', movement: 'Received by Registry', from: 'Human Resources', to: 'Registry', person: 'Registry Clerk', remarks: 'Request logged on intake.' },
    ],
  },
]

const activeSummary = {
  total: 1248,
  incoming: 18,
  outgoing: 11,
  withStaff: 43,
  overdue: 7,
}

const defaultFormState = {
  fileNumber: '',
  subject: '',
  fileType: 'Report',
  direction: 'Incoming',
  referenceNumber: '',
  originDepartment: '',
  destinationDepartment: '',
  sender: '',
  recipient: '',
  dateReceived: '',
  dateRegistered: '',
  priority: 'Normal',
  currentHolder: '',
  description: '',
  relatedDocument: '',
  relatedCorrespondence: '',
  tags: '',
}

const defaultMovementState = {
  file: mockFiles[0].fileNumber,
  currentLocation: mockFiles[0].currentLocation,
  newLocation: '',
  movementType: 'Received',
  dateTime: '',
  reason: '',
  expectedReturnDate: '',
}

export default function FilesRegistry() {
  const [files, setFiles] = useState<RegistryFileRecord[]>(mockFiles)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<string>('All Files')
  const [query, setQuery] = useState('')
  const [directionFilter, setDirectionFilter] = useState<'All' | RegistryDirection>('All')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sort, setSort] = useState('latest')
  const [view, setView] = useState<'Table' | 'Cards'>('Table')
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showMovementForm, setShowMovementForm] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [movementError, setMovementError] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false)
      setError(null)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [])

  const filteredFiles = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return files.filter((file) => {
      if (tab === 'Incoming' && file.direction !== 'Incoming') return false
      if (tab === 'Outgoing' && file.direction !== 'Outgoing') return false
      if (tab === 'With Staff' && file.status !== 'With Staff') return false
      if (tab === 'Overdue' && file.daysOverdue <= 0) return false
      if (tab === 'Archived' && file.status !== 'Archived') return false
      if (directionFilter !== 'All' && file.direction !== directionFilter) return false
      if (departmentFilter !== 'All' && file.department !== departmentFilter) return false
      if (statusFilter !== 'All' && file.status !== statusFilter) return false
      if (priorityFilter !== 'All' && file.priority !== priorityFilter) return false
      if (!normalized) return true

      const searchable = [
        file.fileNumber,
        file.subject,
        file.referenceNumber,
        file.department,
        file.currentHolder,
        file.currentLocation,
        file.tags.join(' '),
      ].join(' ').toLowerCase()

      return searchable.includes(normalized)
    }).sort((first, second) => {
      if (sort === 'file-asc') return first.fileNumber.localeCompare(second.fileNumber)
      if (sort === 'priority') return ['Urgent', 'High', 'Normal', 'Low'].indexOf(second.priority) - ['Urgent', 'High', 'Normal', 'Low'].indexOf(first.priority)
      if (sort === 'status') return first.status.localeCompare(second.status)
      return second.createdDate.localeCompare(first.createdDate)
    })
  }, [files, query, tab, directionFilter, departmentFilter, statusFilter, priorityFilter, sort])

  const selectedFile = files.find((file) => file.id === selectedFileId) ?? null
  const overdueFiles = files.filter((file) => file.daysOverdue > 0 || (file.status === 'Overdue' || file.status === 'With Staff' && file.daysOverdue > 0))

  function clearFilters() {
    setQuery('')
    setDirectionFilter('All')
    setDepartmentFilter('All')
    setStatusFilter('All')
    setPriorityFilter('All')
    setSort('latest')
  }

  function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const fileNumber = (formData.get('fileNumber') as string)?.trim()
    const subject = (formData.get('subject') as string)?.trim()

    if (!fileNumber || !subject) {
      setRegisterError('File number and subject are required before registration.')
      return
    }

    const newFile: RegistryFileRecord = {
      id: `file-${Date.now()}`,
      fileNumber,
      subject,
      direction: (formData.get('direction') as RegistryDirection) || 'Incoming',
      department: (formData.get('originDepartment') as string)?.trim() || 'Registry',
      currentHolder: (formData.get('currentHolder') as string)?.trim() || 'Registry',
      status: 'Registered',
      lastMovement: 'Just now',
      priority: (formData.get('priority') as RegistryPriority) || 'Normal',
      referenceNumber: (formData.get('referenceNumber') as string)?.trim() || `REF-${Date.now()}`,
      createdDate: new Date().toISOString().slice(0, 10),
      expectedReturnDate: (formData.get('dateReceived') as string) || new Date().toISOString().slice(0, 10),
      daysOverdue: 0,
      description: (formData.get('description') as string)?.trim() || 'New office file registered in the registry.',
      relatedDocument: (formData.get('relatedDocument') as string)?.trim() || 'No related document',
      relatedCorrespondence: (formData.get('relatedCorrespondence') as string)?.trim() || 'No related correspondence',
      relatedTask: 'Review and assign to responsible officer',
      relatedMeeting: 'Pending scheduling',
      currentLocation: 'Registry',
      tags: String(formData.get('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean),
      movementHistory: [
        {
          id: `event-${Date.now()}`,
          date: `Today — ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
          movement: 'File registered',
          from: 'New intake',
          to: 'Registry',
          person: 'Registry Officer',
          remarks: 'Official record created in the registry.',
        },
      ],
    }

    setFiles((current) => [newFile, ...current])
    setSelectedFileId(newFile.id)
    setShowRegisterForm(false)
    setRegisterError(null)
    setTab('All Files')
    form.reset()
  }

  function handleMovementSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const chosenFile = files.find((file) => file.fileNumber === String(formData.get('file') || ''))

    if (!chosenFile) {
      setMovementError('Please select a valid file before recording movement.')
      return
    }

    const movementType = (formData.get('movementType') as string) || 'Received'
    const newLocation = (formData.get('newLocation') as string)?.trim() || chosenFile.currentLocation
    const reason = (formData.get('reason') as string)?.trim() || 'Movement recorded'

    setFiles((current) => current.map((file) => {
      if (file.id !== chosenFile.id) return file
      const nextHistory: RegistryMovementEvent = {
        id: `move-${Date.now()}`,
        date: `${formData.get('dateTime') ? String(formData.get('dateTime')) : 'Today'} `,
        movement: movementType,
        from: file.currentLocation,
        to: newLocation,
        person: file.currentHolder,
        remarks: reason,
      }

      return {
        ...file,
        currentLocation: newLocation,
        currentHolder: file.currentHolder,
        status: movementType === 'Returned' ? 'Returned' : movementType === 'Dispatched' ? 'Dispatched' : 'With Staff',
        lastMovement: movementType,
        movementHistory: [nextHistory, ...file.movementHistory],
      }
    }))

    setShowMovementForm(false)
    setMovementError(null)
    form.reset()
  }

  function handleArchive(fileId: string) {
    const shouldArchive = window.confirm('Archive this file entry? This action is reversible from the registry workflow.')
    if (!shouldArchive) return

    setFiles((current) => current.map((file) => file.id === fileId ? { ...file, status: 'Archived' } : file))
  }

  function handleOpenFile(fileId: string) {
    setSelectedFileId(fileId)
  }

  function handleRetry() {
    setError(null)
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setError(null)
    }, 500)
  }

  if (loading) {
    return (
      <main className="registry-page">
        <div className="registry-loading">
          <div className="registry-skeleton large" />
          <div className="registry-skeleton medium" />
          <div className="registry-skeleton row" />
          <div className="registry-skeleton table" />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="registry-page">
        <div className="registry-empty-state registry-error">
          <h3>Registry data couldn't be loaded.</h3>
          <p>Please retry to restore the registry view.</p>
          <button type="button" className="primary-button" onClick={handleRetry}>Retry</button>
        </div>
      </main>
    )
  }

  return (
    <main className="registry-page">
      <RegistryHeader
        onRegister={() => setShowRegisterForm(true)}
        onRecordMovement={() => setShowMovementForm(true)}
      />

      <RegistryStats stats={activeSummary} />

      <section className="registry-main-panel">
        <RegistryTabs tabs={registryTabs} activeTab={tab} onChange={setTab} />

        <RegistryToolbar
          query={query}
          onQueryChange={setQuery}
          direction={directionFilter}
          department={departmentFilter}
          status={statusFilter}
          priority={priorityFilter}
          sort={sort}
          view={view}
          onDirectionChange={setDirectionFilter}
          onDepartmentChange={setDepartmentFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSortChange={setSort}
          onViewChange={setView}
          onClearFilters={clearFilters}
        />

        {filteredFiles.length === 0 ? (
          <EmptyRegistry />
        ) : view === 'Table' ? (
          <div className="registry-table-area">
            <FileTable files={filteredFiles} onOpen={handleOpenFile} onArchive={handleArchive} />
          </div>
        ) : (
          <div className="registry-cards-grid">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} onOpen={handleOpenFile} onArchive={handleArchive} />
            ))}
          </div>
        )}
      </section>

      <div className="registry-lower-grid">
        <div className="registry-column">
          <OverdueFiles files={overdueFiles.slice(0, 4)} onOpen={handleOpenFile} />
        </div>
        <div className="registry-column">
          <RegistryActivity files={files} />
        </div>
      </div>

      {selectedFile ? (
        <FileDetail file={selectedFile} onClose={() => setSelectedFileId(null)}>
          <FileActions onOpen={() => handleOpenFile(selectedFile.id)} onRecordMovement={() => setShowMovementForm(true)} onAssign={() => window.alert('Assign workflow ready for implementation.')} onReminder={() => window.alert('Reminder queued.')} onLinkDocument={() => window.alert('Link document workflow ready for implementation.')} onCreateTask={() => window.alert('Task workflow ready for implementation.')} onArchive={() => handleArchive(selectedFile.id)} />
        </FileDetail>
      ) : null}

      {showRegisterForm ? (
        <div className="registry-modal-backdrop" onClick={() => setShowRegisterForm(false)}>
          <div className="registry-modal" onClick={(event) => event.stopPropagation()}>
            <RegisterFileForm
              formState={defaultFormState}
              onClose={() => setShowRegisterForm(false)}
              onSubmit={handleRegisterSubmit}
              error={registerError}
            />
          </div>
        </div>
      ) : null}

      {showMovementForm ? (
        <div className="registry-modal-backdrop" onClick={() => setShowMovementForm(false)}>
          <div className="registry-modal movement-modal" onClick={(event) => event.stopPropagation()}>
            <FileMovementForm
              files={files}
              onClose={() => setShowMovementForm(false)}
              onSubmit={handleMovementSubmit}
              defaultState={defaultMovementState}
              error={movementError}
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}
