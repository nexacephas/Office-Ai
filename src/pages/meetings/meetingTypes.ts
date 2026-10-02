export type MeetingType = 'in-person' | 'virtual' | 'hybrid'

export type MeetingStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export type PreparationStatus = 'needs-preparation' | 'ready' | 'prepared' | 'completed'

export type MeetingView = 'list' | 'calendar'

export type MeetingSummaryFilter = 'today' | 'week' | 'preparation' | 'followups' | null

export type MeetingSort = 'newest' | 'oldest' | 'upcoming' | 'completed'

export type MeetingDateFilter = 'any' | 'today' | 'week' | 'month'

export interface MeetingParticipant {
  id: string
  name: string
  department?: string
}

export interface MeetingFile {
  id: string
  name: string
  type: 'PDF' | 'DOCX' | 'XLSX'
}

export interface MeetingActionItem {
  id: string
  title: string
  owner: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  taskCreated: boolean
}

export interface MeetingNotes {
  keyDiscussion: string
  decisions: string
  actionItems: string
  questions: string
  followUp: string
}

export interface MeetingSummary {
  overview: string
  keyDecisions: string[]
  actionItems: MeetingActionItem[]
}

export interface MeetingActivity {
  id: string
  dateLabel: string
  time: string
  description: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: MeetingType
  organizer: string
  participants: MeetingParticipant[]
  department: string
  status: MeetingStatus
  preparationStatus: PreparationStatus
  description: string
  agenda: string[]
  relatedDocuments: MeetingFile[]
  relatedCorrespondence: string[]
  relatedTasks: string[]
  notes: MeetingNotes
  summary?: MeetingSummary
  activity: MeetingActivity[]
}

export interface MeetingFollowUp {
  id: string
  meetingId: string
  meetingTitle: string
  action: string
  owner: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
}

export interface MeetingFormValues {
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: MeetingType
  organizer: string
  participants: string
  department: string
  description: string
  agenda: string
  relatedDocuments: string
  relatedTasks: string
  relatedCorrespondence: string
}