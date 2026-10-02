import type { IntegrationProvider, SettingsFormState, WorkspaceMember } from './settingsTypes'

const eventKeys = [
  'taskAssigned', 'taskDueSoon', 'taskOverdue', 'taskCompleted',
  'approvalRequested', 'approvalApproved', 'changesRequested', 'approvalRejected',
  'newCorrespondence', 'responseDue', 'overdueResponse',
  'upcomingMeeting', 'meetingChanged', 'followUpReminder',
  'documentShared', 'documentProcessing', 'conversionComplete',
  'aiProcessing', 'summaryReady', 'knowledgeReady', 'newLogin', 'securityChanges',
]

export function createInitialSettings(): SettingsFormState {
  return {
    profile: { fullName: 'Cephas Adekeye', email: 'cephas@example.com', phone: '+234 803 555 0142', jobTitle: 'Transport Planning Officer', department: 'Transport Planning & Coordination', photo: '' },
    preferences: { language: 'English', timezone: 'Africa/Lagos', dateFormat: 'DD/MM/YYYY', timeFormat: '12-hour' },
    appearance: { theme: 'Light', density: 'Comfortable', sidebar: 'Expanded' },
    notifications: { importantActionRequired: true, channels: Object.fromEntries(eventKeys.map((key) => [key, { inApp: true, email: ['approvalRequested', 'taskOverdue', 'responseDue', 'overdueResponse', 'newLogin'].includes(key) }])) },
    ai: { responseStyle: 'Balanced', writingTone: 'Professional', askBeforeActions: true, authorizedKnowledge: true, selectedDocuments: true, saveHistory: true },
    workspace: { name: 'OfficePilot Demo Organization', id: 'WS-OP-2048', industry: 'Public Sector', department: 'Transport Planning & Coordination', timezone: 'Africa/Lagos' },
    organization: { name: 'OfficePilot Demo Organization', id: 'ORG-OP-2048', industry: 'Public Sector', address: '12 Independence Avenue, Abuja, Nigeria', contactEmail: 'admin@example.com', logo: '' },
    privacy: { conversationHistory: true, documentProcessing: true, usageAnalytics: false, personalization: true },
  }
}

export const notificationPreferenceGroups = [
  { label: 'Tasks', items: [['taskAssigned', 'Task assigned'], ['taskDueSoon', 'Task due soon'], ['taskOverdue', 'Task overdue'], ['taskCompleted', 'Task completed']] },
  { label: 'Approvals', items: [['approvalRequested', 'Approval requested'], ['approvalApproved', 'Approval approved'], ['changesRequested', 'Changes requested'], ['approvalRejected', 'Approval rejected']] },
  { label: 'Correspondence', items: [['newCorrespondence', 'New correspondence'], ['responseDue', 'Response due'], ['overdueResponse', 'Overdue response']] },
  { label: 'Meetings', items: [['upcomingMeeting', 'Upcoming meeting'], ['meetingChanged', 'Meeting changed'], ['followUpReminder', 'Follow-up reminder']] },
  { label: 'Documents', items: [['documentShared', 'Document shared'], ['documentProcessing', 'Document processing complete'], ['conversionComplete', 'Conversion complete']] },
  { label: 'AI', items: [['aiProcessing', 'AI processing complete'], ['summaryReady', 'Summary ready'], ['knowledgeReady', 'Knowledge source ready']] },
  { label: 'Security', items: [['newLogin', 'New login'], ['securityChanges', 'Password/security changes']] },
] as const

export const initialMembers: WorkspaceMember[] = [
  { id: 'member-1', name: 'Cephas Adekeye', email: 'cephas@example.com', department: 'Transport Planning', role: 'Administrator', status: 'Active', lastActive: 'Now' },
  { id: 'member-2', name: 'Naomi Lwanga', email: 'naomi@example.com', department: 'Transport Planning', role: 'Manager', status: 'Active', lastActive: '12 min ago' },
  { id: 'member-3', name: 'Miriam Kamau', email: 'miriam@example.com', department: 'Registry', role: 'Member', status: 'Active', lastActive: 'Yesterday' },
  { id: 'member-4', name: 'Daniel Okoro', email: 'daniel@example.com', department: 'Administration', role: 'Viewer', status: 'Invited', lastActive: 'Not joined' },
]

export const integrationInfo: Array<{ provider: IntegrationProvider; description: string }> = [
  { provider: 'Google Drive', description: 'Access authorized files and documents from Google Drive.' },
  { provider: 'Microsoft 365', description: 'Work with approved Microsoft 365 documents and services.' },
  { provider: 'Google Calendar', description: 'Bring upcoming work meetings into OfficePilot.' },
  { provider: 'Microsoft Outlook', description: 'Coordinate workplace mail and calendar activity.' },
  { provider: 'Slack', description: 'Receive selected OfficePilot workspace updates in Slack.' },
]

export async function saveMockSettings<T>(value: T): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, 380))
  return structuredClone(value)
}