import type { CorrespondenceItem, CorrespondenceStatus } from './correspondenceTypes'

export const correspondenceStatusLabels: Record<CorrespondenceStatus, string> = {
  draft: 'Draft',
  received: 'Received',
  'under-review': 'Under Review',
  'awaiting-response': 'Awaiting Response',
  'response-drafted': 'Response Drafted',
  sent: 'Sent',
  completed: 'Completed',
  archived: 'Archived',
  overdue: 'Overdue',
}

export function getCorrespondenceStatus(item: CorrespondenceItem, today: string): CorrespondenceStatus {
  if (item.status === 'completed' || item.status === 'archived' || item.status === 'sent' || item.status === 'draft') return item.status
  if (item.status === 'overdue' || (item.responseDeadline && item.responseDeadline < today)) return 'overdue'
  return item.status
}

export function dateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
}