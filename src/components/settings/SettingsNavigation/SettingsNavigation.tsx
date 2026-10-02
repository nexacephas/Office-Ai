import type { SettingsSectionId } from '../../../pages/settings/settingsTypes'
import SettingsIcon, { type SettingsIconName } from '../SettingsIcon'
import './SettingsNavigation.css'

type SettingsNavigationItem = { id: SettingsSectionId; label: string; group: string; icon: SettingsIconName; admin?: boolean }
const settingsNavigationItems: SettingsNavigationItem[] = [
  { id: 'profile', label: 'Profile', group: 'ACCOUNT', icon: 'user' },
  { id: 'preferences', label: 'Preferences', group: 'ACCOUNT', icon: 'sliders' },
  { id: 'notifications', label: 'Notifications', group: 'ACCOUNT', icon: 'bell' },
  { id: 'security', label: 'Security', group: 'ACCOUNT', icon: 'shield' },
  { id: 'workspace', label: 'Workspace', group: 'WORKSPACE', icon: 'building', admin: true },
  { id: 'organization', label: 'Organization', group: 'WORKSPACE', icon: 'building', admin: true },
  { id: 'members', label: 'Members & Roles', group: 'WORKSPACE', icon: 'users', admin: true },
  { id: 'ai', label: 'AI Preferences', group: 'OFFICEPILOT', icon: 'sparkles' },
  { id: 'integrations', label: 'Integrations', group: 'OFFICEPILOT', icon: 'link', admin: true },
  { id: 'privacy', label: 'Data & Privacy', group: 'OFFICEPILOT', icon: 'database' },
  { id: 'subscription', label: 'Subscription', group: 'PLAN', icon: 'credit', admin: true },
  { id: 'usage', label: 'Usage', group: 'PLAN', icon: 'chart' },
  { id: 'appearance', label: 'Appearance', group: 'SYSTEM', icon: 'palette' },
  { id: 'support', label: 'Help & Support', group: 'SYSTEM', icon: 'help' },
]

type Props = { active: SettingsSectionId; isAdmin: boolean; onSelect: (id: SettingsSectionId) => void }

export default function SettingsNavigation({ active, isAdmin, onSelect }: Props) {
  const groups = [...new Set(settingsNavigationItems.map((item) => item.group))]
  const selected = settingsNavigationItems.find((item) => item.id === active)?.label ?? 'Profile'
  return (
    <nav className="settings-navigation" aria-label="Settings sections">
      <label className="settings-mobile-select"><span>Settings section</span><select value={active} onChange={(event) => onSelect(event.target.value as SettingsSectionId)}>{settingsNavigationItems.filter((item) => isAdmin || !item.admin).map((item) => <option key={item.id} value={item.id}>{item.label}{item.admin ? ' · Admin' : ''}</option>)}</select></label>
      <div className="settings-nav-desktop" aria-label={`Current section: ${selected}`}>{groups.map((group) => {
        const items = settingsNavigationItems.filter((item) => item.group === group && (isAdmin || !item.admin))
        return <div className="settings-nav-group" key={group}><h2>{group}</h2>{items.map((item) => <button key={item.id} type="button" className={`settings-nav-item${active === item.id ? ' is-active' : ''}`} aria-current={active === item.id ? 'page' : undefined} onClick={() => onSelect(item.id)}><SettingsIcon name={item.icon} size={17} /><span>{item.label}</span>{item.admin && <small>Admin</small>}</button>)}</div>
      })}</div>
    </nav>
  )
}