import { useEffect, useState } from 'react'
import './Meetings.css'
import { dateOffset, dateString, loadMockFollowUps, loadMockMeetings } from './meetingData'
import type { Meeting, MeetingActionItem, MeetingDateFilter, MeetingFollowUp, MeetingFormValues, MeetingNotes, MeetingSort, MeetingStatus, MeetingSummary, MeetingSummaryFilter, MeetingType, MeetingView } from './meetingTypes'
import MeetingsHeader from './components/MeetingsHeader'
import MeetingOverview from './components/MeetingOverview'
import TodayMeetings from './components/TodayMeetings'
import MeetingsToolbar from './components/MeetingsToolbar'
import MeetingCollection from './components/MeetingCollection'
import MeetingPreparationPanel from './components/MeetingPreparationPanel'
import MeetingFollowUps from './components/MeetingFollowUps'
import MeetingHistory from './components/MeetingHistory'
import MeetingDetail from './components/MeetingDetail'
import ScheduleMeetingModal from './components/ScheduleMeetingModal'
import MeetingAIModal, { type MeetingAIMode } from './components/MeetingAIModal'
import MeetingIcon from './components/MeetingIcon'

interface AIRequest {
  mode: MeetingAIMode
  meetingId?: string
  prompt?: string
}

function formatTime(value: string): string {
  const [hourValue, minute] = value.split(':').map(Number)
  const suffix = hourValue >= 12 ? 'PM' : 'AM'
  const hour = hourValue % 12 || 12
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${suffix}`
}

function activity(description: string) {
  const now = new Date()
  return {
    id: `meeting-activity-${crypto.randomUUID()}`,
    dateLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(now),
    time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(now),
    description,
  }
}

function createSummary(meeting: Meeting): MeetingSummary {
  return {
    overview: meeting.notes.keyDiscussion || `The team reviewed ${meeting.description.toLowerCase()} Decisions and follow-ups are listed below for review.`,
    keyDecisions: meeting.notes.decisions.split('\n').filter(Boolean).length ? meeting.notes.decisions.split('\n').filter(Boolean) : ['Updated statistics will be submitted before the next departmental review.', 'Outstanding correspondence will be reviewed this week.', 'Departmental reports will use the updated reporting template.'],
    actionItems: meeting.summary?.actionItems.map((item) => ({ ...item })) ?? [
      { id: `action-${meeting.id}-1`, title: 'Submit Q3 transport statistics', owner: 'Planning Team', dueDate: dateOffset(2), status: 'pending', taskCreated: false },
      { id: `action-${meeting.id}-2`, title: 'Review pending correspondence', owner: 'Admin Unit', dueDate: dateOffset(1), status: 'pending', taskCreated: false },
    ],
  }
}

function splitLines(value: string): string[] {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [followUps, setFollowUps] = useState<MeetingFollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [summaryFilter, setSummaryFilter] = useState<MeetingSummaryFilter>(null)
  const [view, setView] = useState<MeetingView>('list')
  const [today] = useState(() => dateString(new Date()))
  const [selectedDate, setSelectedDate] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(() => new Date(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1, 1))
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<MeetingType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | 'all'>('all')
  const [departmentFilter, setDepartmentFilter] = useState('All departments')
  const [organizerFilter, setOrganizerFilter] = useState('All organizers')
  const [preparationFilter, setPreparationFilter] = useState<Meeting['preparationStatus'] | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<MeetingDateFilter>('any')
  const [sort, setSort] = useState<MeetingSort>('upcoming')
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>(undefined)
  const [aiRequest, setAIRequest] = useState<AIRequest | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([loadMockMeetings(), loadMockFollowUps()])
      .then(([meetingItems, followUpItems]) => {
        if (active) {
          setMeetings(meetingItems)
          setFollowUps(followUpItems)
          setLoadError(false)
        }
      })
      .catch(() => { if (active) setLoadError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!activeMeetingId && !scheduleOpen && !aiRequest) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMeetingId(null)
        setScheduleOpen(false)
        setAIRequest(null)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activeMeetingId, scheduleOpen, aiRequest])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const departments = [...new Set(meetings.map((meeting) => meeting.department))].sort()
  const organizers = [...new Set(meetings.map((meeting) => meeting.organizer))].sort()
  const activeMeeting = meetings.find((meeting) => meeting.id === activeMeetingId) ?? null
  const aiMeeting = meetings.find((meeting) => meeting.id === aiRequest?.meetingId)
  const todayMeetings = meetings.filter((meeting) => meeting.date === today).sort((first, second) => first.startTime.localeCompare(second.startTime))
  const prepMeeting = meetings.filter((meeting) => meeting.status === 'upcoming' && meeting.preparationStatus === 'needs-preparation').sort((first, second) => first.date.localeCompare(second.date))[0] ?? meetings.find((meeting) => meeting.status === 'upcoming')

  const filteredMeetings = meetings.filter((meeting) => {
    if (summaryFilter === 'today' && meeting.date !== today) return false
    if (summaryFilter === 'week') {
      const age = (Date.parse(`${meeting.date}T12:00:00`) - Date.parse(`${today}T12:00:00`)) / 86400000
      if (age < 0 || age > 6) return false
    }
    if (summaryFilter === 'preparation' && meeting.preparationStatus !== 'needs-preparation') return false
    if (summaryFilter === 'followups' && !meeting.relatedTasks.length) return false
    if (typeFilter !== 'all' && meeting.type !== typeFilter) return false
    if (statusFilter !== 'all' && meeting.status !== statusFilter) return false
    if (departmentFilter !== 'All departments' && meeting.department !== departmentFilter) return false
    if (organizerFilter !== 'All organizers' && meeting.organizer !== organizerFilter) return false
    if (preparationFilter !== 'all' && meeting.preparationStatus !== preparationFilter) return false
    if (dateFilter !== 'any') {
      const age = (Date.parse(`${meeting.date}T12:00:00`) - Date.parse(`${today}T12:00:00`)) / 86400000
      const range = dateFilter === 'today' ? 0 : dateFilter === 'week' ? 6 : 30
      if (age < 0 || age > range) return false
    }
    const normalized = search.trim().toLowerCase()
    if (normalized && ![meeting.title, meeting.description, meeting.location, meeting.organizer, meeting.department, ...meeting.participants.map((participant) => participant.name)].some((value) => value.toLowerCase().includes(normalized))) return false
    return true
  }).sort((first, second) => {
    if (sort === 'oldest') return first.date.localeCompare(second.date)
    if (sort === 'newest' || sort === 'completed') return second.date.localeCompare(first.date)
    return first.date.localeCompare(second.date) || first.startTime.localeCompare(second.startTime)
  })
  const upcomingMeetings = filteredMeetings.filter((meeting) => meeting.status !== 'completed' && meeting.status !== 'cancelled')
  const previousMeetings = meetings.filter((meeting) => meeting.status === 'completed').sort((first, second) => second.date.localeCompare(first.date))

  function updateMeeting(meetingId: string, update: (meeting: Meeting) => Meeting) {
    setMeetings((current) => current.map((meeting) => meeting.id === meetingId ? update(meeting) : meeting))
  }

  function showAI(mode: MeetingAIMode, meeting?: Meeting, prompt?: string) {
    setAIRequest({ mode, meetingId: meeting?.id, prompt })
  }

  function resetFilters() {
    setSearch('')
    setTypeFilter('all')
    setStatusFilter('all')
    setDepartmentFilter('All departments')
    setOrganizerFilter('All organizers')
    setPreparationFilter('all')
    setDateFilter('any')
    setSummaryFilter(null)
  }

  function chooseSummary(filter: Exclude<MeetingSummaryFilter, null>) {
    setSummaryFilter((current) => current === filter ? null : filter)
    if (filter === 'today') setDateFilter('any')
  }

  function saveMeeting(values: MeetingFormValues, status: MeetingStatus) {
    const participantNames = values.participants.split(',').map((name) => name.trim()).filter(Boolean)
    const agenda = splitLines(values.agenda)
    const makeMeeting = (existing?: Meeting): Meeting => ({
      id: existing?.id ?? `meeting-${crypto.randomUUID()}`,
      title: values.title,
      date: values.date || today,
      startTime: formatTime(values.startTime || '09:00'),
      endTime: formatTime(values.endTime || '10:00'),
      location: values.location || 'To be confirmed',
      type: values.type,
      organizer: values.organizer || 'Transport Planning & Coordination',
      participants: participantNames.map((name, index) => ({ id: `${existing?.id ?? 'participant'}-${index}-${name}`, name, department: values.department })),
      department: values.department || 'General',
      status,
      preparationStatus: status === 'draft' ? 'needs-preparation' : 'needs-preparation',
      description: values.description,
      agenda,
      relatedDocuments: splitLines(values.relatedDocuments).map((name, index) => ({ id: `${existing?.id ?? 'related'}-doc-${index}`, name, type: name.toLowerCase().endsWith('.docx') ? 'DOCX' : name.toLowerCase().endsWith('.xlsx') ? 'XLSX' : 'PDF' })),
      relatedCorrespondence: splitLines(values.relatedCorrespondence),
      relatedTasks: splitLines(values.relatedTasks),
      notes: existing?.notes ?? { keyDiscussion: '', decisions: '', actionItems: '', questions: '', followUp: '' },
      summary: existing?.summary,
      activity: [activity(existing ? 'Meeting details updated' : status === 'draft' ? 'Meeting draft saved' : 'Meeting scheduled'), ...(existing?.activity ?? [])],
    })
    if (editingMeeting) {
      const updated = makeMeeting(editingMeeting)
      setMeetings((current) => current.map((meeting) => meeting.id === updated.id ? updated : meeting))
      setToast('Meeting updated.')
      setActiveMeetingId(updated.id)
    } else {
      const created = makeMeeting()
      setMeetings((current) => [created, ...current])
      setToast(status === 'draft' ? 'Meeting draft saved.' : 'Meeting scheduled.')
      if (status !== 'draft') setActiveMeetingId(created.id)
    }
    setScheduleOpen(false)
    setEditingMeeting(undefined)
  }

  function changeStatus(meeting: Meeting, status: MeetingStatus) {
    updateMeeting(meeting.id, (current) => ({ ...current, status, preparationStatus: status === 'completed' ? 'completed' : current.preparationStatus, activity: [activity(status === 'ongoing' ? 'Meeting started' : status === 'completed' ? 'Meeting completed' : status === 'cancelled' ? 'Meeting cancelled' : `Meeting set to ${status}`), ...current.activity] }))
    if (status === 'cancelled') {
      setActiveMeetingId(null)
      setToast('Meeting cancelled in this demo.')
    } else setToast(status === 'ongoing' ? 'Meeting started.' : 'Meeting status updated.')
  }

  function saveNotes(meeting: Meeting, notes: MeetingNotes) {
    updateMeeting(meeting.id, (current) => ({ ...current, notes, activity: current.notes === notes ? current.activity : [activity('Meeting notes updated'), ...current.activity] }))
  }

  function applySuggestedAgenda(meeting: Meeting, agenda: string[]) {
    updateMeeting(meeting.id, (current) => ({ ...current, agenda, preparationStatus: 'prepared', activity: [activity('Suggested agenda added with OfficePilot demo'), ...current.activity] }))
    setToast('Suggested agenda added to the meeting.')
  }

  function generateSummary(meeting: Meeting) {
    setToast('Generating meeting summary…')
    window.setTimeout(() => {
      updateMeeting(meeting.id, (current) => ({ ...current, summary: createSummary(current), preparationStatus: current.preparationStatus === 'needs-preparation' ? 'prepared' : current.preparationStatus, activity: [activity('Meeting summary generated with OfficePilot demo'), ...current.activity] }))
      setToast('Meeting summary generated.')
    }, 500)
  }

  function createActionTask(meeting: Meeting, item: MeetingActionItem) {
    updateMeeting(meeting.id, (current) => current.summary ? ({ ...current, summary: { ...current.summary, actionItems: current.summary.actionItems.map((actionItem) => actionItem.id === item.id ? { ...actionItem, taskCreated: true } : actionItem) }, relatedTasks: [...new Set([...current.relatedTasks, item.title])], activity: [activity(`Task created: ${item.title}`), ...current.activity] }) : current)
    setToast(`Task created: ${item.title}`)
  }

  function createAllTasks(meeting: Meeting) {
    meeting.summary?.actionItems.filter((item) => !item.taskCreated && item.status !== 'completed').forEach((item) => createActionTask(meeting, item))
    setToast('All open action items have been added as tasks.')
  }

  function toggleAction(meeting: Meeting, item: MeetingActionItem) {
    updateMeeting(meeting.id, (current) => current.summary ? ({ ...current, summary: { ...current.summary, actionItems: current.summary.actionItems.map((actionItem) => actionItem.id === item.id ? { ...actionItem, status: actionItem.status === 'completed' ? 'pending' : 'completed' } : actionItem) } }) : current)
  }

  function createFollowUpTask(item: MeetingFollowUp) {
    setFollowUps((current) => current.map((followUp) => followUp.id === item.id ? { ...followUp, status: 'in-progress' } : followUp))
    setMeetings((current) => current.map((meeting) => meeting.id === item.meetingId ? { ...meeting, relatedTasks: [...new Set([...meeting.relatedTasks, item.action])] } : meeting))
    setToast(`Task created: ${item.action}`)
  }

  function applyAgendaFromAI(agenda: string[]) {
    const target = aiRequest?.meetingId ? meetings.find((meeting) => meeting.id === aiRequest.meetingId) : prepMeeting
    if (target) applySuggestedAgenda(target, agenda)
    setAIRequest(null)
  }

  function retryLoad() {
    setLoading(true)
    setLoadError(false)
    Promise.all([loadMockMeetings(), loadMockFollowUps()]).then(([meetingItems, followUpItems]) => { setMeetings(meetingItems); setFollowUps(followUpItems) }).catch(() => setLoadError(true)).finally(() => setLoading(false))
  }

  return <main className="meetings-page">
    <MeetingsHeader onSchedule={() => { setEditingMeeting(undefined); setScheduleOpen(true) }} onPrepare={() => showAI('prepare', prepMeeting)} />
    <MeetingOverview active={summaryFilter} onSelect={chooseSummary} />
    {loading ? <div className="meetings-loading" role="status"><span className="meeting-spinner" />Loading meetings</div> : loadError ? <div className="meetings-page-error" role="alert"><strong>Meetings could not be loaded</strong><p>Try again in a moment.</p><button type="button" onClick={retryLoad}>Retry</button></div> : <>
      <TodayMeetings meetings={todayMeetings} today={today} onOpen={(meeting) => setActiveMeetingId(meeting.id)} onPrepare={(meeting) => showAI('prepare', meeting)} onSchedule={() => { setEditingMeeting(undefined); setScheduleOpen(true) }} />
      <MeetingsToolbar search={search} onSearchChange={setSearch} type={typeFilter} onTypeChange={setTypeFilter} status={statusFilter} onStatusChange={setStatusFilter} department={departmentFilter} onDepartmentChange={setDepartmentFilter} departments={departments} organizer={organizerFilter} onOrganizerChange={setOrganizerFilter} organizers={organizers} preparation={preparationFilter} onPreparationChange={setPreparationFilter} date={dateFilter} onDateChange={setDateFilter} sort={sort} onSortChange={setSort} onReset={resetFilters} />
      <div className="meetings-main-grid"><MeetingCollection meetings={upcomingMeetings} allMeetings={meetings} today={today} view={view} onViewChange={setView} selectedDate={selectedDate} onSelectDate={setSelectedDate} currentMonth={currentMonth} onMonthChange={(direction) => setCurrentMonth((month) => new Date(month.getFullYear(), month.getMonth() + direction, 1))} onOpen={(meeting) => setActiveMeetingId(meeting.id)} onPrepare={(meeting) => showAI('prepare', meeting)} />
        <MeetingPreparationPanel meeting={prepMeeting} onUseAgenda={(meeting) => applySuggestedAgenda(meeting, ['Review outstanding actions', 'Discuss pending correspondence', 'Review Q3 progress', 'Assign next steps'])} onOpenMeeting={(meeting) => setActiveMeetingId(meeting.id)} />
      </div>
      <MeetingFollowUps items={summaryFilter === 'followups' ? followUps.filter((item) => item.status !== 'completed') : followUps} onOpenMeeting={(meetingId) => setActiveMeetingId(meetingId)} onCreateTask={createFollowUpTask} />
      <MeetingHistory meetings={previousMeetings} onOpen={(meeting) => setActiveMeetingId(meeting.id)} />
    </>}
    {toast && <div className="meetings-toast" role="status"><MeetingIcon name="check" size={15} />{toast}</div>}
    {activeMeeting && <MeetingDetail key={activeMeeting.id} meeting={activeMeeting} onClose={() => setActiveMeetingId(null)} onStatusChange={changeStatus} onEdit={(meeting) => { setEditingMeeting(meeting); setScheduleOpen(true) }} onSaveNotes={saveNotes} onUseAgenda={applySuggestedAgenda} onGenerateSummary={generateSummary} onToggleAction={toggleAction} onCreateTask={createActionTask} onCreateAllTasks={createAllTasks} onAIAction={(meeting, action) => showAI(action === 'follow-up' ? 'follow-up' : action === 'decisions' ? 'decisions' : action === 'actions' ? 'actions' : 'summary', meeting)} />}
    {scheduleOpen && <ScheduleMeetingModal meeting={editingMeeting} onClose={() => { setScheduleOpen(false); setEditingMeeting(undefined) }} onSave={saveMeeting} onPrepareAI={(prompt) => showAI('prepare-new', undefined, prompt)} />}
    {aiRequest && <MeetingAIModal meeting={aiMeeting} mode={aiRequest.mode} prompt={aiRequest.prompt} onClose={() => setAIRequest(null)} onUseAgenda={applyAgendaFromAI} onCreateTasks={createAllTasks} />}
  </main>
}