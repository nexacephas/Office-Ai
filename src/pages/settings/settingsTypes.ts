export type SettingsSectionId =
  | 'profile' | 'preferences' | 'notifications' | 'security'
  | 'workspace' | 'organization' | 'members'
  | 'ai' | 'integrations' | 'privacy'
  | 'subscription' | 'usage' | 'appearance' | 'support'

export type SettingsSaveStatus = 'idle' | 'editing' | 'saving' | 'saved' | 'error'

export type SettingsFormState = {
  profile: { fullName: string; email: string; phone: string; jobTitle: string; department: string; photo: string }
  preferences: { language: string; timezone: string; dateFormat: string; timeFormat: '12-hour' | '24-hour' }
  appearance: { theme: 'Light' | 'Dark' | 'System'; density: 'Comfortable' | 'Compact'; sidebar: 'Expanded' | 'Collapsed' }
  notifications: { importantActionRequired: boolean; channels: Record<string, { inApp: boolean; email: boolean }> }
  ai: { responseStyle: 'Concise' | 'Balanced' | 'Detailed'; writingTone: 'Professional' | 'Formal' | 'Friendly' | 'Neutral'; askBeforeActions: boolean; authorizedKnowledge: boolean; selectedDocuments: boolean; saveHistory: boolean }
  workspace: { name: string; id: string; industry: string; department: string; timezone: string }
  organization: { name: string; id: string; industry: string; address: string; contactEmail: string; logo: string }
  privacy: { conversationHistory: boolean; documentProcessing: boolean; usageAnalytics: boolean; personalization: boolean }
}

export type EditableSettingsSection = keyof SettingsFormState

export type SettingsPanelProps<K extends EditableSettingsSection> = {
  value: SettingsFormState[K]
  onChange: (value: SettingsFormState[K]) => void
  onSave: () => void
  onCancel: () => void
  status: SettingsSaveStatus
  isAdmin: boolean
}

export type WorkspaceMember = { id: string; name: string; email: string; department: string; role: 'Administrator' | 'Manager' | 'Member' | 'Viewer'; status: 'Active' | 'Invited' | 'Inactive'; lastActive: string }

export type IntegrationProvider = 'Google Drive' | 'Microsoft 365' | 'Google Calendar' | 'Microsoft Outlook' | 'Slack'