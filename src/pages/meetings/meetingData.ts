import type { Meeting, MeetingFollowUp } from './meetingTypes'

export function dateOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const today = dateOffset(0)
const tomorrow = dateOffset(1)
const dayAfterTomorrow = dateOffset(2)
const fridayOffset = (5 - new Date().getDay() + 7) % 7 || 7
const friday = dateOffset(fridayOffset)
const lastWeek = dateOffset(-4)
const lastMeetingDate = lastWeek

const participants = (names: string[], department = 'Transport Planning'): Meeting['participants'] => names.map((name, index) => ({ id: `participant-${index}-${name.toLowerCase().replaceAll(' ', '-')}`, name, department }))
const blankNotes = (): Meeting['notes'] => ({ keyDiscussion: '', decisions: '', actionItems: '', questions: '', followUp: '' })

export const mockMeetings: Meeting[] = [
  {
    id: 'meeting-department-coordination',
    title: 'Department Coordination Meeting',
    date: today,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    location: 'Conference Room 2',
    type: 'in-person',
    organizer: 'Transport Planning & Coordination',
    participants: participants(['Cephas', 'Sarah Chen', 'Jordan Lee', 'Maya Patel', 'Alex Morgan', 'Chris Okafor', 'Taylor Kim', 'Sam Rivera']),
    department: 'Planning',
    status: 'upcoming',
    preparationStatus: 'ready',
    description: 'Review current department priorities, pending correspondence, and reporting deadlines.',
    agenda: ['Review previous action items', 'Department updates', 'Pending correspondence', 'Upcoming deadlines', 'Other business'],
    relatedDocuments: [
      { id: 'coord-q3-report', name: 'Q3 Department Report.pdf', type: 'PDF' },
      { id: 'coord-minutes', name: 'Previous Meeting Minutes.docx', type: 'DOCX' },
      { id: 'coord-activity', name: 'Transport Activity Report.pdf', type: 'PDF' },
    ],
    relatedCorrespondence: ['Request for Updated Transport Statistics'],
    relatedTasks: ['Submit Q3 statistics', 'Review pending requests'],
    notes: blankNotes(),
    activity: [{ id: 'coord-created', dateLabel: 'Sep 29, 2026', time: '3:10 PM', description: 'Meeting scheduled by Sarah Chen' }],
  },
  {
    id: 'meeting-quarterly-review',
    title: 'Quarterly Transport Review',
    date: today,
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    location: 'Virtual',
    type: 'virtual',
    organizer: 'Planning Department',
    participants: participants(['Cephas', 'Maya Patel', 'Jordan Lee', 'Sarah Chen', 'Taylor Kim', 'Chris Okafor', 'Sam Rivera', 'Alex Morgan', 'Ari Johnson', 'Morgan Bell', 'Riley Chen', 'Robin Davis']),
    department: 'Planning',
    status: 'upcoming',
    preparationStatus: 'needs-preparation',
    description: 'Review quarterly transport performance, fleet utilization, and open decisions for the next reporting period.',
    agenda: ['Q3 transport performance', 'Vehicle utilization data', 'Open procurement decisions', 'Next-period priorities'],
    relatedDocuments: [{ id: 'quarterly-dashboard', name: 'Q3 Transport Statistics.xlsx', type: 'XLSX' }, { id: 'quarterly-brief', name: 'Quarterly Review Brief.pdf', type: 'PDF' }],
    relatedCorrespondence: ['Request for Updated Transport Statistics', 'Request for Quarterly Activity Report'],
    relatedTasks: ['Provide Q3 transport statistics'],
    notes: blankNotes(),
    activity: [{ id: 'quarterly-created', dateLabel: 'Sep 30, 2026', time: '11:22 AM', description: 'Meeting scheduled by Planning Department' }],
  },
  {
    id: 'meeting-morning-briefing',
    title: 'Morning Briefing',
    date: today,
    startTime: '08:00 AM',
    endTime: '08:30 AM',
    location: 'Operations Room',
    type: 'in-person',
    organizer: 'Transport Planning & Coordination',
    participants: participants(['Cephas', 'Jordan Lee', 'Sarah Chen']),
    department: 'Operations',
    status: 'completed',
    preparationStatus: 'completed',
    description: 'Daily operational briefing and review of urgent handoffs.',
    agenda: ['Overnight updates', 'Fleet availability', 'Immediate follow-ups'],
    relatedDocuments: [],
    relatedCorrespondence: [],
    relatedTasks: ['Review urgent maintenance requests'],
    notes: { keyDiscussion: 'Fleet availability remained stable overnight.', decisions: 'Escalate the depot maintenance request for review.', actionItems: 'Confirm vehicle allocation before noon.', questions: '', followUp: 'Review at the afternoon coordination meeting.' },
    summary: {
      overview: 'The team reviewed overnight fleet availability and identified one depot maintenance request for escalation.',
      keyDecisions: ['Escalate the depot maintenance request.', 'Confirm vehicle allocation before noon.'],
      actionItems: [{ id: 'briefing-action-1', title: 'Confirm vehicle allocation', owner: 'Operations Team', dueDate: today, status: 'pending', taskCreated: false }],
    },
    activity: [{ id: 'briefing-complete', dateLabel: 'Oct 1, 2026', time: '8:32 AM', description: 'Meeting marked complete' }],
  },
  {
    id: 'meeting-management-review',
    title: 'Management Review',
    date: tomorrow,
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Executive Conference Room',
    type: 'in-person',
    organizer: 'Office of the Director',
    participants: participants(['Cephas', 'Sarah Chen', 'Maya Patel', 'Jordan Lee', 'Ari Johnson', 'Taylor Kim', 'Chris Okafor', 'Robin Davis', 'Morgan Bell', 'Sam Rivera', 'Alex Morgan', 'Riley Chen'], 'Management'),
    department: 'Management',
    status: 'upcoming',
    preparationStatus: 'needs-preparation',
    description: 'Review departmental progress, open decisions, and resource needs.',
    agenda: ['Review Q3 outcomes', 'Open decisions', 'Resource planning', 'Confirm next steps'],
    relatedDocuments: [{ id: 'management-review-pack', name: 'Management Review Pack.pdf', type: 'PDF' }],
    relatedCorrespondence: ['Request for Project Status Update'],
    relatedTasks: ['Update department work plan'],
    notes: blankNotes(),
    activity: [{ id: 'management-scheduled', dateLabel: 'Sep 30, 2026', time: '4:05 PM', description: 'Meeting scheduled by Office of the Director' }],
  },
  {
    id: 'meeting-department-budget',
    title: 'Department Budget Check-in',
    date: dayAfterTomorrow,
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    location: 'Virtual',
    type: 'virtual',
    organizer: 'Finance Department',
    participants: participants(['Cephas', 'Jordan Lee', 'Morgan Bell', 'Ari Johnson'], 'Finance'),
    department: 'Finance',
    status: 'upcoming',
    preparationStatus: 'prepared',
    description: 'Check forecast changes and confirm quarter-end assumptions.',
    agenda: ['Review current spend', 'Discuss forecast changes', 'Confirm assumptions'],
    relatedDocuments: [{ id: 'budget-checkin-doc', name: 'Operations Budget Summary.xlsx', type: 'XLSX' }],
    relatedCorrespondence: [],
    relatedTasks: ['Confirm maintenance forecast'],
    notes: blankNotes(),
    activity: [{ id: 'budget-scheduled', dateLabel: 'Sep 28, 2026', time: '10:44 AM', description: 'Meeting prepared by Cephas' }],
  },
  {
    id: 'meeting-project-progress',
    title: 'Project Progress Meeting',
    date: friday,
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    location: 'Virtual',
    type: 'hybrid',
    organizer: 'Project Management Office',
    participants: participants(['Cephas', 'Jordan Lee', 'Maya Patel', 'Taylor Kim', 'Alex Morgan'], 'Projects'),
    department: 'Projects',
    status: 'upcoming',
    preparationStatus: 'ready',
    description: 'Review fleet modernization milestones and discuss delivery dependencies.',
    agenda: ['Milestone status', 'Supplier dependencies', 'Next delivery window'],
    relatedDocuments: [{ id: 'progress-report', name: 'Project Progress Report.pptx', type: 'PDF' }],
    relatedCorrespondence: ['Request for Project Status Update'],
    relatedTasks: ['Confirm supplier delivery dates'],
    notes: blankNotes(),
    activity: [{ id: 'progress-scheduled', dateLabel: 'Sep 27, 2026', time: '1:18 PM', description: 'Meeting scheduled by Project Management Office' }],
  },
  {
    id: 'meeting-previous-management',
    title: 'Management Review',
    date: lastMeetingDate,
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Executive Conference Room',
    type: 'in-person',
    organizer: 'Office of the Director',
    participants: participants(['Cephas', 'Sarah Chen', 'Jordan Lee', 'Maya Patel', 'Ari Johnson', 'Taylor Kim', 'Chris Okafor', 'Sam Rivera', 'Alex Morgan', 'Riley Chen', 'Robin Davis', 'Morgan Bell'], 'Management'),
    department: 'Management',
    status: 'completed',
    preparationStatus: 'completed',
    description: 'Monthly leadership review of operational commitments and reporting.',
    agenda: ['Q3 delivery progress', 'Open actions', 'Resource alignment', 'Next review date'],
    relatedDocuments: [{ id: 'previous-management-minutes', name: 'Management Review Minutes.docx', type: 'DOCX' }],
    relatedCorrespondence: ['Reminder: Pending Documentation'],
    relatedTasks: ['Update department work plan'],
    summary: {
      overview: 'The team reviewed the current reporting cycle, discussed outstanding transport statistics, and agreed that updated figures should be submitted before the next departmental review.',
      keyDecisions: ['Updated statistics will be submitted by Friday.', 'Outstanding correspondence will be reviewed this week.', 'Departmental reports will use the updated reporting template.'],
      actionItems: [
        { id: 'management-action-1', title: 'Submit Q3 transport statistics', owner: 'Planning Team', dueDate: dateOffset(-2), status: 'pending', taskCreated: false },
        { id: 'management-action-2', title: 'Review pending correspondence', owner: 'Admin Unit', dueDate: yesterdayDate(), status: 'in-progress', taskCreated: false },
      ],
    },
    notes: { keyDiscussion: 'The group reviewed reporting deadlines and outstanding procurement dependencies.', decisions: 'Use the updated reporting template for Q3 submissions.', actionItems: 'Three follow-ups were assigned to Planning and Admin.', questions: 'Confirm the supplier delivery window.', followUp: 'Review outstanding actions at the next coordination meeting.' },
    activity: [{ id: 'previous-meeting-complete', dateLabel: 'Sep 27, 2026', time: '11:34 AM', description: 'Meeting completed and summary generated' }],
  },
  {
    id: 'meeting-previous-project',
    title: 'Fleet Modernization Check-in',
    date: lastWeek,
    startTime: '03:00 PM',
    endTime: '03:45 PM',
    location: 'Virtual',
    type: 'virtual',
    organizer: 'Project Management Office',
    participants: participants(['Cephas', 'Jordan Lee', 'Taylor Kim', 'Alex Morgan'], 'Projects'),
    department: 'Projects',
    status: 'completed',
    preparationStatus: 'completed',
    description: 'Short review of the first fleet modernization milestone.',
    agenda: ['Milestone status', 'Supplier response', 'Next check-in'],
    relatedDocuments: [{ id: 'fleet-modernization-minutes', name: 'Fleet Modernization Minutes.docx', type: 'DOCX' }],
    relatedCorrespondence: [],
    relatedTasks: ['Confirm supplier delivery dates'],
    notes: blankNotes(),
    summary: { overview: 'The first fleet modernization milestone remains on schedule. The team is waiting on a supplier confirmation before finalizing the next delivery window.', keyDecisions: ['Keep the current delivery sequence.', 'Escalate supplier confirmation if not received by Thursday.'], actionItems: [{ id: 'fleet-action-1', title: 'Confirm supplier delivery dates', owner: 'Project Team', dueDate: tomorrow, status: 'pending', taskCreated: false }] },
    activity: [{ id: 'fleet-meeting-complete', dateLabel: 'Sep 24, 2026', time: '3:48 PM', description: 'Meeting completed' }],
  },
]

function yesterdayDate(): string {
  return dateOffset(-1)
}

export const mockFollowUps: MeetingFollowUp[] = [
  { id: 'follow-up-transport', meetingId: 'meeting-previous-management', meetingTitle: 'Management Review', action: 'Submit Q3 statistics', owner: 'Planning Team', dueDate: dateOffset(2), status: 'pending' },
  { id: 'follow-up-minutes', meetingId: 'meeting-department-coordination', meetingTitle: 'Department Coordination', action: 'Review pending correspondence', owner: 'Admin Unit', dueDate: dateOffset(1), status: 'pending' },
  { id: 'follow-up-workplan', meetingId: 'meeting-previous-management', meetingTitle: 'Management Review', action: 'Update department work plan', owner: 'Admin Unit', dueDate: dateOffset(4), status: 'in-progress' },
  { id: 'follow-up-supplier', meetingId: 'meeting-previous-project', meetingTitle: 'Fleet Modernization Check-in', action: 'Confirm supplier delivery dates', owner: 'Project Team', dueDate: tomorrow, status: 'pending' },
]

export async function loadMockMeetings(): Promise<Meeting[]> {
  return mockMeetings.map((meeting) => ({
    ...meeting,
    participants: meeting.participants.map((participant) => ({ ...participant })),
    agenda: [...meeting.agenda],
    relatedDocuments: meeting.relatedDocuments.map((document) => ({ ...document })),
    relatedCorrespondence: [...meeting.relatedCorrespondence],
    relatedTasks: [...meeting.relatedTasks],
    notes: { ...meeting.notes },
    summary: meeting.summary ? { ...meeting.summary, keyDecisions: [...meeting.summary.keyDecisions], actionItems: meeting.summary.actionItems.map((action) => ({ ...action })) } : undefined,
    activity: meeting.activity.map((activity) => ({ ...activity })),
  }))
}

export async function loadMockFollowUps(): Promise<MeetingFollowUp[]> {
  return mockFollowUps.map((followUp) => ({ ...followUp }))
}

export function dateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}