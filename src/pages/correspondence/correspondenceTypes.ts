export type CorrespondenceType = 'incoming' | 'outgoing'

export type CorrespondenceStatus =
  | 'draft'
  | 'received'
  | 'under-review'
  | 'awaiting-response'
  | 'response-drafted'
  | 'sent'
  | 'completed'
  | 'archived'
  | 'overdue'

export type CorrespondencePriority = 'low' | 'normal' | 'high' | 'urgent'

export type CorrespondenceTab = 'All' | 'Incoming' | 'Outgoing' | 'Drafts' | 'Awaiting Response' | 'Archived'

export type CorrespondenceSort = 'newest' | 'oldest' | 'priority' | 'deadline'

export type CorrespondenceDateFilter = 'any' | 'week' | 'month'

export type CorrespondenceStatusFilter = CorrespondenceStatus | 'all'

export type CorrespondenceAIAction =
  | 'summarize'
  | 'extract'
  | 'deadlines'
  | 'task'
  | 'documents'
  | 'explain'
  | 'forward'

export type CorrespondenceSummaryFilter = 'incoming' | 'awaiting' | 'outgoing' | 'overdue' | null

export type CorrespondenceListAction = 'draft' | 'task' | 'forward' | 'archive' | 'summarize'

export interface CorrespondenceAttachment {
  id: string
  name: string
  type: 'PDF' | 'DOCX' | 'XLSX' | 'JPG'
  size: string
}

export interface CorrespondenceActivity {
  id: string
  dateLabel: string
  time: string
  description: string
}

export interface CorrespondenceItem {
  id: string
  subject: string
  preview: string
  message: string
  type: CorrespondenceType
  referenceNumber: string
  sender: string
  recipient: string
  department: string
  status: CorrespondenceStatus
  priority: CorrespondencePriority
  date: string
  dateLabel: string
  responseDeadline?: string
  relatedDocuments: CorrespondenceAttachment[]
  attachments: CorrespondenceAttachment[]
  relatedTask?: string
  notes: string
  responseDraft: string
  activity: CorrespondenceActivity[]
}

export interface CorrespondenceFormValues {
  type: CorrespondenceType
  subject: string
  referenceNumber: string
  date: string
  sender: string
  recipient: string
  department: string
  priority: CorrespondencePriority
  responseDeadline: string
  relatedDocument: string
  responseTo: string
  message: string
  notes: string
}