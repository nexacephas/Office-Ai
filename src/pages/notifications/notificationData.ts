import type { NotificationRecord } from '../../components/notifications/notificationTypes'

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString()

export const mockNotifications: NotificationRecord[] = [
  {
    id: 'notice-approval-1', type: 'Approvals', title: 'Approval requested',
    message: 'Quarterly Transport Report is waiting for your approval.', timestamp: minutesAgo(18), read: false,
    actionRequired: true, priority: 'High', relatedType: 'Approval', relatedId: 'approval-1', route: '/approvals/approval-1',
    actor: 'Naomi L.', activity: ['Naomi submitted the report for review.', 'The request was assigned to you.'],
  },
  {
    id: 'notice-task-1', type: 'Tasks', title: 'New task assigned',
    message: 'You were assigned “Prepare response to Directorate”.', timestamp: minutesAgo(48), read: false,
    actionRequired: false, priority: 'Normal', relatedType: 'Task', relatedId: 'task-12', route: '/tasks',
    actor: 'Transport Planning Unit', activity: ['The task was assigned to you.', 'Due date: October 5, 2026.'], mention: true,
  },
  {
    id: 'notice-correspondence-1', type: 'Correspondence', title: 'Correspondence awaiting response',
    message: 'FMT/TPC/2026/041 requires a response by the end of the day.', timestamp: minutesAgo(115), read: false,
    actionRequired: true, priority: 'Urgent', relatedType: 'Correspondence', relatedId: 'FMT/TPC/2026/041', route: '/correspondence',
    actor: 'Registry', activity: ['Correspondence was received and registered.', 'A response deadline was set for today.'],
  },
  {
    id: 'notice-meeting-1', type: 'Meetings', title: 'Meeting starts in 30 minutes',
    message: 'Transport Coordination Meeting begins at 10:00 AM.', timestamp: minutesAgo(175), read: false,
    actionRequired: false, priority: 'High', relatedType: 'Meeting', relatedId: 'meeting-8', route: '/meetings',
    actor: 'Calendar', activity: ['Meeting reminder scheduled.', 'Meeting starts at 10:00 AM.'], mention: true,
  },
  {
    id: 'notice-ai-1', type: 'AI', title: 'Summary ready',
    message: 'OfficePilot finished summarizing Procurement_Report.pdf.', timestamp: minutesAgo(280), read: true,
    actionRequired: false, priority: 'Low', relatedType: 'AI summary', relatedId: 'summary-204', route: '/ai/summarize',
    actor: 'OfficePilot AI', activity: ['Summary generated successfully.', 'Source: Procurement_Report.pdf.'],
  },
  {
    id: 'notice-document-1', type: 'Documents', title: 'Document conversion completed',
    message: 'Management_Report.pdf is ready to view as an editable document.', timestamp: minutesAgo(360), read: false,
    actionRequired: false, priority: 'Normal', relatedType: 'Document', relatedId: 'document-72', route: '/documents',
    actor: 'OfficePilot', activity: ['Conversion completed.', 'The editable file is available in Documents.'],
  },
  {
    id: 'notice-task-2', type: 'Tasks', title: 'Task overdue',
    message: 'Review the Q3 fleet maintenance schedule. It was due yesterday.', timestamp: minutesAgo(480), read: false,
    actionRequired: true, priority: 'Urgent', relatedType: 'Task', relatedId: 'task-9', route: '/tasks',
    actor: 'OfficePilot', activity: ['The task passed its due date.', 'Assigned to you.'],
  },
  {
    id: 'notice-security-1', type: 'System', title: 'New login detected',
    message: 'Your OfficePilot account was accessed from a new device in Nairobi.', timestamp: minutesAgo(620), read: false,
    actionRequired: true, priority: 'High', relatedType: 'Security event', relatedId: 'security-2026-10-02', route: '/settings',
    actor: 'OfficePilot Security', activity: ['New browser sign-in detected.', 'If this was not you, review your account security.'],
  },
  {
    id: 'notice-registry-1', type: 'Files & Registry', title: 'File movement recorded',
    message: 'File FMT/TPC/2026/063 was transferred to the Registry.', timestamp: minutesAgo(1440), read: true,
    actionRequired: false, priority: 'Normal', relatedType: 'Registry file', relatedId: 'FMT/TPC/2026/063', route: '/registry',
    actor: 'Miriam K.', activity: ['Movement recorded by Miriam K.', 'Current location: Registry.'],
  },
  {
    id: 'notice-approval-2', type: 'Approvals', title: 'Approval decision recorded',
    message: 'The procurement brief was approved by the Director.', timestamp: minutesAgo(1920), read: true,
    actionRequired: false, priority: 'Normal', relatedType: 'Approval', relatedId: 'approval-2', route: '/approvals',
    actor: 'Director', activity: ['Decision: Approved.', 'The request is ready for its next step.'],
  },
  {
    id: 'notice-knowledge-1', type: 'AI', title: 'Knowledge source ready',
    message: 'Transport Policy Handbook has finished indexing and is searchable.', timestamp: minutesAgo(3900), read: true,
    actionRequired: false, priority: 'Low', relatedType: 'Knowledge source', relatedId: 'knowledge-17', route: '/knowledge',
    actor: 'OfficePilot AI', activity: ['Indexing completed.', 'The source is now available in Knowledge.'],
  },
  {
    id: 'notice-document-2', type: 'Documents', title: 'Document shared with you',
    message: 'Naomi shared “Regional Operations Brief” with your team.', timestamp: minutesAgo(7200), read: true,
    actionRequired: false, priority: 'Low', relatedType: 'Document', relatedId: 'document-31', route: '/documents',
    actor: 'Naomi L.', activity: ['Document shared with the Transport Planning team.'], mention: true,
  },
  {
    id: 'notice-correspondence-2', type: 'Correspondence', title: 'Incoming correspondence received',
    message: 'FMT/TPC/2026/038 from the Ministry of Transport was registered.', timestamp: minutesAgo(12960), read: true,
    actionRequired: false, priority: 'Normal', relatedType: 'Correspondence', relatedId: 'FMT/TPC/2026/038', route: '/correspondence',
    actor: 'Registry', activity: ['Correspondence received.', 'Assigned to Transport Planning Unit.'],
  },
  {
    id: 'notice-ocr-1', type: 'Documents', title: 'OCR processing complete',
    message: 'Scanned_Minutes_Sept.pdf is now searchable.', timestamp: minutesAgo(28800), read: true,
    actionRequired: false, priority: 'Low', relatedType: 'Document', relatedId: 'document-19', route: '/documents',
    actor: 'OfficePilot', activity: ['Text extraction completed.', 'Searchable content added to the document.'],
  },
]

export async function loadMockNotifications(): Promise<NotificationRecord[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 250))
  return mockNotifications.map((notification) => ({ ...notification, activity: [...notification.activity] }))
}