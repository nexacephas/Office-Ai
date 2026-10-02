import SettingsSection from '../SettingsSection/SettingsSection'
import SettingsSaveState from '../SettingsSaveState/SettingsSaveState'
import SettingsIcon from '../SettingsIcon'
import type { SettingsPanelProps } from '../../../pages/settings/settingsTypes'
import './PrivacySettings.css'

type Props = SettingsPanelProps<'privacy'> & { notice: string; onAction: (action: 'export' | 'download' | 'delete') => void }
const privacyChoices: Array<{ key: keyof SettingsPanelProps<'privacy'>['value']; title: string; description: string }> = [
  { key: 'conversationHistory', title: 'AI conversation history', description: 'Save your AI conversations so you can return to previous work.' },
  { key: 'documentProcessing', title: 'Document processing', description: 'Allow documents you select to be processed for requested tasks.' },
  { key: 'usageAnalytics', title: 'Usage analytics', description: 'Share limited usage information to help improve OfficePilot.' },
  { key: 'personalization', title: 'Personalization', description: 'Use your preferences to tailor OfficePilot responses.' },
]

export default function PrivacySettings({ value, onChange, onSave, onCancel, status, notice, onAction }: Props) {
  return <SettingsSection eyebrow="OFFICEPILOT" title="Data & Privacy" description="Control personal data preferences and review available account data actions."><div className="privacy-choice-list">{privacyChoices.map((choice) => <label className="settings-toggle-row" key={choice.key}><input type="checkbox" checked={value[choice.key]} onChange={(event) => onChange({ ...value, [choice.key]: event.target.checked })} /><span><strong>{choice.title}</strong><small>{choice.description}</small></span><i /></label>)}</div><div className="settings-form-footer"><SettingsSaveState status={status} /><div className="settings-form-actions"><button type="button" className="settings-button-secondary" onClick={onCancel}>Cancel</button><button type="button" className="settings-button-primary" onClick={onSave} disabled={status === 'saving'}>Save privacy settings</button></div></div><div className="privacy-data-actions"><h3>Your data</h3><p>Export or download a copy of your account data. Account deletion is permanent.</p><div><button type="button" onClick={() => onAction('export')}><SettingsIcon name="download" size={15} /> Export my data</button><button type="button" onClick={() => onAction('download')}><SettingsIcon name="download" size={15} /> Download account data</button><button type="button" className="privacy-delete-button" onClick={() => onAction('delete')}><SettingsIcon name="trash" size={15} /> Delete account</button></div>{notice && <span role="status">{notice}</span>}</div></SettingsSection>
}