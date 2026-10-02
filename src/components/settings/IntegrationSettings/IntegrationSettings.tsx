import SettingsIcon from '../SettingsIcon'
import SettingsSection from '../SettingsSection/SettingsSection'
import type { IntegrationProvider } from '../../../pages/settings/settingsTypes'
import { integrationInfo } from '../../../pages/settings/settingsData'
import './IntegrationSettings.css'

type Props = { connected: Record<IntegrationProvider, boolean>; isAdmin: boolean; onToggle: (provider: IntegrationProvider) => void }
const providerIcons: Record<IntegrationProvider, 'file' | 'calendar' | 'mail' | 'link'> = { 'Google Drive': 'file', 'Microsoft 365': 'file', 'Google Calendar': 'calendar', 'Microsoft Outlook': 'mail', Slack: 'link' }

export default function IntegrationSettings({ connected, isAdmin, onToggle }: Props) {
  return <SettingsSection eyebrow="OFFICEPILOT · ADMIN ONLY" title="Integrations" description="Connect approved work services to make relevant information available in OfficePilot."><div className="integration-access-note"><SettingsIcon name="lock" size={16} /> Connected services only expose content allowed by your existing provider permissions.</div><div className="integration-grid">{integrationInfo.map(({ provider, description }) => <article className="integration-item" key={provider}><span className="integration-provider-icon"><SettingsIcon name={providerIcons[provider]} size={19} /></span><div className="integration-provider-copy"><strong>{provider}</strong><p>{description}</p></div><span className={`integration-status${connected[provider] ? ' is-connected' : ''}`}>{connected[provider] ? 'Connected' : 'Not connected'}</span><button type="button" disabled={!isAdmin} className={connected[provider] ? 'is-disconnect' : ''} onClick={() => onToggle(provider)}>{connected[provider] ? 'Disconnect' : 'Connect'}</button></article>)}</div>{!isAdmin && <p className="settings-inline-message">Requires administrator permission to manage integrations.</p>}</SettingsSection>
}