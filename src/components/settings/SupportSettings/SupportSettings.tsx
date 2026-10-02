import SettingsIcon from '../SettingsIcon'
import SettingsSection from '../SettingsSection/SettingsSection'
import './SupportSettings.css'

const supportItems = [
  { title: 'Help Center', description: 'Browse product guides and answers.', icon: 'help' as const },
  { title: 'Contact Support', description: 'Get help with your OfficePilot workspace.', icon: 'mail' as const },
  { title: 'Report a Problem', description: 'Tell us about an issue you encountered.', icon: 'info' as const },
  { title: 'Keyboard Shortcuts', description: 'Review available workspace shortcuts.', icon: 'laptop' as const },
]

export default function SupportSettings({ notice, onAction }: { notice: string; onAction: (title: string) => void }) {
  return <SettingsSection eyebrow="SYSTEM" title="Help & Support" description="Find guidance and share feedback about your OfficePilot workspace."><div className="support-links">{supportItems.map((item) => <button type="button" key={item.title} onClick={() => onAction(item.title)}><span><SettingsIcon name={item.icon} size={18} /></span><span><strong>{item.title}</strong><small>{item.description}</small></span><SettingsIcon name="chevron" size={16} /></button>)}</div>{notice && <p className="settings-inline-message" role="status">{notice}</p>}</SettingsSection>
}