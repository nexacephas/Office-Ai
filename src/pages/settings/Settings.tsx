import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import SettingsNavigation from '../../components/settings/SettingsNavigation/SettingsNavigation'
import SettingsIcon from '../../components/settings/SettingsIcon'
import ProfileSettings from '../../components/settings/ProfileSettings/ProfileSettings'
import PreferenceSettings from '../../components/settings/PreferenceSettings/PreferenceSettings'
import AppearanceSettings from '../../components/settings/AppearanceSettings/AppearanceSettings'
import NotificationSettings from '../../components/settings/NotificationSettings/NotificationSettings'
import AIPreferences from '../../components/settings/AIPreferences/AIPreferences'
import SecuritySettings from '../../components/settings/SecuritySettings/SecuritySettings'
import WorkspaceSettings from '../../components/settings/WorkspaceSettings/WorkspaceSettings'
import OrganizationSettings from '../../components/settings/OrganizationSettings/OrganizationSettings'
import MembersSettings, { type InviteMemberValues } from '../../components/settings/MembersSettings/MembersSettings'
import SubscriptionSettings from '../../components/settings/SubscriptionSettings/SubscriptionSettings'
import UsageSettings from '../../components/settings/UsageSettings/UsageSettings'
import IntegrationSettings from '../../components/settings/IntegrationSettings/IntegrationSettings'
import PrivacySettings from '../../components/settings/PrivacySettings/PrivacySettings'
import SupportSettings from '../../components/settings/SupportSettings/SupportSettings'
import DangerZone, { type DangerAction } from '../../components/settings/DangerZone/DangerZone'
import UnsavedChangesModal from '../../components/settings/UnsavedChangesModal/UnsavedChangesModal'
import type { EditableSettingsSection, IntegrationProvider, SettingsFormState, SettingsSaveStatus, SettingsSectionId, WorkspaceMember } from './settingsTypes'
import { createInitialSettings, initialMembers, saveMockSettings } from './settingsData'
import { getThemePreference, resolveThemePreference, saveThemePreference, type ThemePreference } from '../../services/themePreference'
import './Settings.css'

const validSections: SettingsSectionId[] = ['profile', 'preferences', 'notifications', 'security', 'workspace', 'organization', 'members', 'ai', 'integrations', 'privacy', 'subscription', 'usage', 'appearance', 'support']
const editableSections: EditableSettingsSection[] = ['profile', 'preferences', 'notifications', 'appearance', 'ai', 'workspace', 'organization', 'privacy']
const initialIntegrationState: Record<IntegrationProvider, boolean> = { 'Google Drive': false, 'Microsoft 365': true, 'Google Calendar': false, 'Microsoft Outlook': false, Slack: false }

function emptySaveStatuses(): Record<EditableSettingsSection, SettingsSaveStatus> {
  return { profile: 'idle', preferences: 'idle', notifications: 'idle', appearance: 'idle', ai: 'idle', workspace: 'idle', organization: 'idle', privacy: 'idle' }
}

function sectionFromLocation(pathname: string, search: string): SettingsSectionId {
  const slug = pathname.replace(/^\/settings\/?/, '').split('/')[0]
  const querySection = new URLSearchParams(search).get('section')
  const candidate = slug || querySection || 'profile'
  return validSections.includes(candidate as SettingsSectionId) ? candidate as SettingsSectionId : 'profile'
}

function sectionPath(section: SettingsSectionId): string {
  return section === 'profile' ? '/settings/profile' : `/settings/${section}`
}

function createSettingsDefaults(): SettingsFormState {
  const initial = createInitialSettings()
  const preference = getThemePreference()
  initial.appearance.theme = preference === 'system' ? 'System' : preference === 'dark' ? 'Dark' : 'Light'
  return initial
}

export default function Settings() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const activeSection = sectionFromLocation(location.pathname, location.search)
  const [draft, setDraft] = useState<SettingsFormState>(() => createSettingsDefaults())
  const [saved, setSaved] = useState<SettingsFormState>(() => createSettingsDefaults())
  const [saveStatuses, setSaveStatuses] = useState(emptySaveStatuses)
  const [pendingSection, setPendingSection] = useState<SettingsSectionId | null>(null)
  const [members, setMembers] = useState<WorkspaceMember[]>(initialMembers)
  const [memberNotice, setMemberNotice] = useState('')
  const [securityNotice, setSecurityNotice] = useState('')
  const [subscriptionNotice, setSubscriptionNotice] = useState('')
  const [privacyNotice, setPrivacyNotice] = useState('')
  const [supportNotice, setSupportNotice] = useState('')
  const [integrations, setIntegrations] = useState(initialIntegrationState)
  const [dangerAction, setDangerAction] = useState<DangerAction | null>(null)
  const [dangerNotice, setDangerNotice] = useState('')
  const isAdmin = /administrator|owner/i.test(auth?.user?.role ?? 'Administrator')

  const isDirty = useMemo(() => editableSections.some((section) => JSON.stringify(draft[section]) !== JSON.stringify(saved[section])), [draft, saved])
  const dirtyActiveSection = editableSections.includes(activeSection as EditableSettingsSection)
    && JSON.stringify(draft[activeSection as EditableSettingsSection]) !== JSON.stringify(saved[activeSection as EditableSettingsSection])

  useEffect(() => {
    const appearance = draft.appearance
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const resolvedTheme = resolveThemePreference(appearance.theme.toLowerCase() as ThemePreference)
      document.documentElement.dataset.theme = resolvedTheme
      document.documentElement.dataset.density = appearance.density.toLowerCase()
      document.documentElement.dataset.sidebarPreference = appearance.sidebar.toLowerCase()
      document.dispatchEvent(new CustomEvent('officepilot-theme-change', { detail: resolvedTheme }))
      window.dispatchEvent(new CustomEvent('officepilot-sidebar-preference-change', { detail: appearance.sidebar === 'Collapsed' }))
    }
    apply()
    if (appearance.theme === 'System') media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [draft.appearance])

  useEffect(() => {
    const syncHeaderTheme = (event: Event) => {
      const theme = (event as CustomEvent<'light' | 'dark'>).detail
      if (theme !== 'light' && theme !== 'dark') return
      const preference = theme === 'dark' ? 'Dark' : 'Light'
      setDraft((current) => ({ ...current, appearance: { ...current.appearance, theme: preference } }))
      setSaved((current) => ({ ...current, appearance: { ...current.appearance, theme: preference } }))
      setSaveStatuses((current) => ({ ...current, appearance: 'saved' }))
    }
    window.addEventListener('officepilot-header-theme-change', syncHeaderTheme)
    return () => window.removeEventListener('officepilot-header-theme-change', syncHeaderTheme)
  }, [])

  useEffect(() => {
    if (!location.pathname.startsWith('/settings/')) return
    const routeSection = location.pathname.replace(/^\/settings\//, '').split('/')[0]
    if (!validSections.includes(routeSection as SettingsSectionId)) navigate('/settings', { replace: true })
  }, [location.pathname, navigate])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  function selectSection(section: SettingsSectionId) {
    if (section === activeSection) return
    if (dirtyActiveSection) {
      setPendingSection(section)
      return
    }
    navigate(sectionPath(section))
  }

  function updateSection<K extends EditableSettingsSection>(section: K, value: SettingsFormState[K]) {
    setDraft((current) => ({ ...current, [section]: value }))
    setSaveStatuses((current) => ({ ...current, [section]: 'editing' }))
  }

  function cancelSection<K extends EditableSettingsSection>(section: K) {
    setDraft((current) => ({ ...current, [section]: saved[section] }))
    setSaveStatuses((current) => ({ ...current, [section]: 'idle' }))
  }

  async function saveSection<K extends EditableSettingsSection>(section: K) {
    setSaveStatuses((current) => ({ ...current, [section]: 'saving' }))
    try {
      const result = await saveMockSettings(draft[section])
      if (section === 'appearance') saveThemePreference(draft.appearance.theme.toLowerCase() as ThemePreference)
      setSaved((current) => ({ ...current, [section]: result }))
      setSaveStatuses((current) => ({ ...current, [section]: 'saved' }))
    } catch {
      setSaveStatuses((current) => ({ ...current, [section]: 'error' }))
    }
  }

  function discardAndNavigate() {
    if (dirtyActiveSection && editableSections.includes(activeSection as EditableSettingsSection)) cancelSection(activeSection as EditableSettingsSection)
    if (pendingSection) navigate(sectionPath(pendingSection))
    setPendingSection(null)
  }

  function confirmDangerAction() {
    setDangerNotice(dangerAction === 'delete' ? 'Account deletion was confirmed in preview; no account data was removed.' : 'Account deactivation was confirmed in preview; your account remains active.')
    setDangerAction(null)
  }

  function inviteMember(values: InviteMemberValues) {
    const newMember: WorkspaceMember = { ...values, id: `member-${crypto.randomUUID()}`, status: 'Invited', lastActive: 'Not joined' }
    setMembers((current) => [...current, newMember])
    setMemberNotice(`Invitation prepared for ${values.email}. No email was sent.`)
  }

  function updateMemberRole(id: string, role: WorkspaceMember['role']) {
    setMembers((current) => current.map((member) => member.id === id ? { ...member, role } : member))
    setMemberNotice('Member role updated in this preview.')
  }

  function toggleMemberStatus(member: WorkspaceMember) {
    const status = member.status === 'Inactive' ? 'Active' : 'Inactive'
    setMembers((current) => current.map((item) => item.id === member.id ? { ...item, status } : item))
    setMemberNotice(`${member.name} marked ${status.toLowerCase()} in this preview.`)
  }

  function renderPanel() {
    if (activeSection === 'profile') return <><ProfileSettings value={draft.profile} onChange={(value) => updateSection('profile', value)} onSave={() => void saveSection('profile')} onCancel={() => cancelSection('profile')} status={saveStatuses.profile} isAdmin={isAdmin} /><DangerZone onAction={setDangerAction} /></>
    if (activeSection === 'preferences') return <PreferenceSettings value={draft.preferences} onChange={(value) => updateSection('preferences', value)} onSave={() => void saveSection('preferences')} onCancel={() => cancelSection('preferences')} status={saveStatuses.preferences} isAdmin={isAdmin} />
    if (activeSection === 'appearance') return <AppearanceSettings value={draft.appearance} onChange={(value) => updateSection('appearance', value)} onSave={() => void saveSection('appearance')} onCancel={() => cancelSection('appearance')} status={saveStatuses.appearance} isAdmin={isAdmin} />
    if (activeSection === 'notifications') return <NotificationSettings value={draft.notifications} onChange={(value) => updateSection('notifications', value)} onSave={() => void saveSection('notifications')} onCancel={() => cancelSection('notifications')} status={saveStatuses.notifications} isAdmin={isAdmin} />
    if (activeSection === 'ai') return <AIPreferences value={draft.ai} onChange={(value) => updateSection('ai', value)} onSave={() => void saveSection('ai')} onCancel={() => cancelSection('ai')} status={saveStatuses.ai} isAdmin={isAdmin} />
    if (activeSection === 'security') return <SecuritySettings message={securityNotice} onAction={setSecurityNotice} />
    if (activeSection === 'workspace') return <WorkspaceSettings value={draft.workspace} onChange={(value) => updateSection('workspace', value)} onSave={() => void saveSection('workspace')} onCancel={() => cancelSection('workspace')} status={saveStatuses.workspace} isAdmin={isAdmin} />
    if (activeSection === 'organization') return <OrganizationSettings value={draft.organization} onChange={(value) => updateSection('organization', value)} onSave={() => void saveSection('organization')} onCancel={() => cancelSection('organization')} status={saveStatuses.organization} isAdmin={isAdmin} />
    if (activeSection === 'members') return <MembersSettings members={members} isAdmin={isAdmin} notice={memberNotice} onInvite={inviteMember} onRoleChange={updateMemberRole} onToggleStatus={toggleMemberStatus} onView={(member) => setMemberNotice(`${member.name} · ${member.role} · ${member.status}`)} />
    if (activeSection === 'subscription') return <SubscriptionSettings message={subscriptionNotice} isAdmin={isAdmin} onMessage={setSubscriptionNotice} onUsage={() => selectSection('usage')} />
    if (activeSection === 'usage') return <UsageSettings />
    if (activeSection === 'integrations') return <IntegrationSettings connected={integrations} isAdmin={isAdmin} onToggle={(provider) => setIntegrations((current) => ({ ...current, [provider]: !current[provider] }))} />
    if (activeSection === 'privacy') return <PrivacySettings value={draft.privacy} onChange={(value) => updateSection('privacy', value)} onSave={() => void saveSection('privacy')} onCancel={() => cancelSection('privacy')} status={saveStatuses.privacy} isAdmin={isAdmin} notice={privacyNotice} onAction={(action) => action === 'delete' ? setDangerAction('delete') : setPrivacyNotice(action === 'export' ? 'Your data export is being prepared in this preview.' : 'Your account data download is being prepared in this preview.')} />
    return <SupportSettings notice={supportNotice} onAction={(title) => setSupportNotice(`${title} will be available when support services are connected.`)} />
  }

  return <section className="settings-page">
    <header className="settings-page-heading"><div><span>CONTROL CENTER</span><h1>Settings</h1><p>Manage your OfficePilot account, workspace, preferences, and controls.</p></div><div className="settings-account-chip"><SettingsIcon name="shield" size={15} /> Administrator</div></header>
    <div className="settings-layout"><aside className="settings-sidebar"><SettingsNavigation active={activeSection} isAdmin={isAdmin} onSelect={selectSection} /></aside><main className="settings-main-panel">{renderPanel()}</main></div>
    {pendingSection && <UnsavedChangesModal mode="unsaved" title="You have unsaved changes." description="Stay here to keep editing, or discard your changes and switch settings sections." confirmLabel="Discard changes" onStay={() => setPendingSection(null)} onConfirm={discardAndNavigate} />}
    {dangerAction && <UnsavedChangesModal mode="danger" title={dangerAction === 'delete' ? 'Delete account?' : 'Deactivate account?'} description={dangerAction === 'delete' ? 'This permanently deletes your account and personal data. This cannot be undone. The action is simulated and will not remove real data.' : 'This temporarily disables account access. The action is simulated in this preview.'} confirmLabel={dangerAction === 'delete' ? 'Delete account' : 'Deactivate account'} requiredPhrase={dangerAction === 'delete' ? 'DELETE' : undefined} onStay={() => setDangerAction(null)} onConfirm={confirmDangerAction} />}
    {dangerNotice && <div className="settings-toast" role="status"><span>{dangerNotice}</span><button type="button" onClick={() => setDangerNotice('')}>Dismiss</button></div>}
  </section>
}